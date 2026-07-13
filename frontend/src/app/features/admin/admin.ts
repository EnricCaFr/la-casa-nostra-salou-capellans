import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { I18nService, LanguageCode } from '../../core/i18n.service';
import { AllergenTag, AllergenTagRequest, Category, MediaAsset, MenuItem, MenuItemRequest, TranslationMap } from '../../core/models';

type ToastType = 'success' | 'error';
type ItemStatusFilter = 'all' | 'active' | 'inactive';
type FeaturedFilter = 'all' | 'featured' | 'normal';
type ConfirmDialog = {
  type: 'item' | 'category' | 'media' | 'tag';
  id: number;
  name: string;
  title: string;
  message: string;
  busy: boolean;
};

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  @ViewChild('categoryEditor') private readonly categoryEditor?: ElementRef<HTMLElement>;
  @ViewChild('itemEditor') private readonly itemEditor?: ElementRef<HTMLElement>;
  @ViewChild('tagEditor') private readonly tagEditor?: ElementRef<HTMLElement>;

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  readonly languages = this.i18n.languages;
  activeCategoryLanguage = signal<LanguageCode>('es');
  activeItemLanguage = signal<LanguageCode>('es');
  activeTagLanguage = signal<LanguageCode>('es');
  categoryTranslations = signal<TranslationMap>(this.emptyTranslations());
  itemTranslations = signal<TranslationMap>(this.emptyTranslations());
  tagTranslations = signal<TranslationMap>(this.emptyTranslations(false));
  categories = signal<Category[]>([]);
  items = signal<MenuItem[]>([]);
  adminTags = signal<AllergenTag[]>([]);
  mediaImages = signal<MediaAsset[]>([]);
  editingItemId = signal<number | null>(null);
  editingCategoryId = signal<number | null>(null);
  editingTagId = signal<number | null>(null);
  loading = signal(true);
  savingItem = signal(false);
  savingCategory = signal(false);
  savingTag = signal(false);
  itemSearch = signal('');
  itemCategoryFilter = signal('');
  itemStatusFilter = signal<ItemStatusFilter>('all');
  itemFeaturedFilter = signal<FeaturedFilter>('all');
  uploadingImage = signal(false);
  imageUploadError = signal('');
  toast = signal<{ type: ToastType; message: string } | null>(null);
  confirmDialog = signal<ConfirmDialog | null>(null);
  private toastTimeout?: number;
  tags = computed(() => {
    return this.adminTags().map((tag) => ({ code: tag.code, label: `${tag.icon} ${tag.name}` }));
  });
  filteredItems = computed(() => {
    const term = this.normalize(this.itemSearch());
    const category = this.itemCategoryFilter();
    const status = this.itemStatusFilter();
    const featured = this.itemFeaturedFilter();

    return this.items().filter((item) => {
      const searchable = this.normalize([
        item.name,
        item.description,
        item.slug,
        item.category.name,
        item.category.slug,
        ...item.tags.map((tag) => `${tag.name} ${tag.code}`),
      ].join(' '));
      const termOk = !term || searchable.includes(term);
      const categoryOk = !category || String(item.category.id) === category;
      const statusOk = status === 'all' || (status === 'active' ? item.active : !item.active);
      const featuredOk = featured === 'all' || (featured === 'featured' ? item.highlighted : !item.highlighted);
      return termOk && categoryOk && statusOk && featuredOk;
    });
  });
  hasItemFilters = computed(() => Boolean(
    this.itemSearch().trim()
    || this.itemCategoryFilter()
    || this.itemStatusFilter() !== 'all'
    || this.itemFeaturedFilter() !== 'all'));

  categoryForm = this.fb.nonNullable.group({
    name: [''],
    slug: [''],
    description: [''],
    displayOrder: [0, Validators.required],
    active: [true],
  });

  tagForm = this.fb.nonNullable.group({
    name: [''],
    icon: ['', Validators.required],
    type: ['ALLERGEN', Validators.required],
  });

  itemForm = this.fb.nonNullable.group({
    name: [''],
    slug: [''],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    imageAssetId: [null as number | null],
    highlighted: [false],
    active: [true],
    displayOrder: [0],
    categoryId: [0, Validators.required],
    tagCodes: [[] as string[]],
  });

  ngOnInit(): void { this.reload(); }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  reload(refreshFailureMessage = 'No se ha podido cargar la informacion del panel.'): void {
    this.loading.set(true);
    forkJoin({ categories: this.api.getAdminCategories(), items: this.api.getAdminMenuItems(), tags: this.api.getAdminTags(), mediaImages: this.api.getMediaImages() })
      .subscribe({
        next: ({ categories, items, tags, mediaImages }) => {
          this.categories.set(categories);
          this.items.set(items);
          this.adminTags.set(tags);
          this.mediaImages.set(mediaImages);
          if (!this.itemForm.controls.categoryId.value && categories[0]) this.itemForm.controls.categoryId.setValue(categories[0].id);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.showToast('error', refreshFailureMessage);
        },
      });
  }

  languageLabel(code: string): string {
    const labels: Record<string, string> = {
      es: 'Espa\u00f1ol',
      ca: 'Catal\u00e1n',
      en: 'Ingl\u00e9s',
      fr: 'Franc\u00e9s',
      de: 'Alem\u00e1n',
      it: 'Italiano',
      pt: 'Portugu\u00e9s',
      nl: 'Neerland\u00e9s',
      ru: 'Ruso',
    };
    return labels[code] || code.toUpperCase();
  }

  translationValue(map: TranslationMap, language: string, field: 'name' | 'description'): string {
    return map[language]?.[field] || '';
  }

  setCategoryTranslation(language: string, field: 'name' | 'description', value: string): void {
    this.categoryTranslations.update((translations) => this.withTranslationValue(translations, language, field, value));
    this.syncCategoryPrimaryFields();
  }

  setItemTranslation(language: string, field: 'name' | 'description', value: string): void {
    this.itemTranslations.update((translations) => this.withTranslationValue(translations, language, field, value));
    this.syncItemPrimaryFields();
  }

  setTagTranslation(language: string, value: string): void {
    this.tagTranslations.update((translations) => this.withTranslationValue(translations, language, 'name', value));
    this.syncTagPrimaryFields();
  }

  categoryLanguageComplete(language: string): boolean {
    return Boolean(this.categoryTranslations()[language]?.name?.trim());
  }

  itemLanguageComplete(language: string): boolean {
    const translation = this.itemTranslations()[language];
    return Boolean(translation?.name?.trim() && translation?.description?.trim());
  }

  tagLanguageComplete(language: string): boolean {
    return Boolean(this.tagTranslations()[language]?.name?.trim());
  }

  private validateTranslations(kind: 'category' | 'item' | 'tag'): boolean {
    const translations = kind === 'category' ? this.categoryTranslations() : kind === 'item' ? this.itemTranslations() : this.tagTranslations();
    const requireDescription = kind === 'item';
    for (const language of this.languages) {
      const translation = translations[language.code];
      if (!translation?.name?.trim()) {
        this.showToast('error', `Falta el nombre en ${this.languageLabel(language.code)}.`);
        this.setActiveTranslationLanguage(kind, language.code);
        return false;
      }
      if (requireDescription && !translation.description?.trim()) {
        this.showToast('error', `Falta la descripcion en ${this.languageLabel(language.code)}.`);
        this.setActiveTranslationLanguage(kind, language.code);
        return false;
      }
    }
    return true;
  }

  saveCategory(): void {
    if (this.savingCategory()) return;
    if (this.categoryForm.invalid || !this.validateTranslations('category')) {
      this.categoryForm.markAllAsTouched();
      this.showToast('error', 'Revisa los campos de la categoria.');
      return;
    }
    this.savingCategory.set(true);
    const id = this.editingCategoryId();
    const payload = { ...this.categoryForm.getRawValue(), translations: this.categoryTranslations() };
    const request = id ? this.api.updateCategory(id, payload) : this.api.createCategory(payload);
    request.subscribe({
      next: () => {
        this.showToast('success', id ? 'Categoria actualizada correctamente.' : 'Categoria creada correctamente.');
        this.resetCategoryForm();
        this.reload('Operacion correcta, pero no se pudo refrescar la lista.');
        this.savingCategory.set(false);
      },
      error: () => {
        this.savingCategory.set(false);
        this.showToast('error', id ? 'No se pudieron guardar los cambios de la categoria.' : 'No se pudo crear la categoria.');
      },
    });
  }

  editCategory(category: Category): void {
    this.editingCategoryId.set(category.id);
    this.categoryTranslations.set(this.translationsFromEntity(category.translations, category.name, category.description || '', true));
    this.activeCategoryLanguage.set('es');
    this.categoryForm.setValue({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      displayOrder: category.displayOrder,
      active: category.active,
    });
    this.scrollToCategoryEditor();
  }

  cancelCategoryEdit(): void {
    this.resetCategoryForm();
  }

  saveTag(): void {
    if (this.savingTag()) return;
    if (this.tagForm.invalid || !this.validateTranslations('tag')) {
      this.tagForm.markAllAsTouched();
      this.showToast('error', 'Revisa los campos del tag.');
      return;
    }
    this.savingTag.set(true);
    const id = this.editingTagId();
    const payload = { ...this.tagForm.getRawValue(), translations: this.tagTranslations() } as AllergenTagRequest;
    const request = id ? this.api.updateTag(id, payload) : this.api.createTag(payload);
    request.subscribe({
      next: () => {
        this.showToast('success', id ? 'Tag actualizado correctamente.' : 'Tag creado correctamente.');
        this.resetTagForm();
        this.reload('Operacion correcta, pero no se pudo refrescar la lista.');
        this.savingTag.set(false);
      },
      error: (error) => {
        this.savingTag.set(false);
        this.showToast('error', error?.error?.message || (id ? 'No se pudo guardar el tag.' : 'No se pudo crear el tag.'));
      },
    });
  }

  editTag(tag: AllergenTag): void {
    this.editingTagId.set(tag.id);
    this.tagTranslations.set(this.translationsFromEntity(tag.translations, tag.name, '', false));
    this.activeTagLanguage.set('es');
    this.tagForm.setValue({
      name: tag.name,
      icon: tag.icon,
      type: tag.type,
    });
    this.scrollToTagEditor();
  }

  cancelTagEdit(): void {
    this.resetTagForm();
  }

  editItem(item: MenuItem): void {
    this.editingItemId.set(item.id);
    this.itemTranslations.set(this.translationsFromEntity(item.translations, item.name, item.description, true));
    this.activeItemLanguage.set('es');
    this.itemForm.setValue({
      name: item.name,
      slug: item.slug,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl || '',
      imageAssetId: item.imageAssetId || this.mediaImages().find((image) => image.url === item.imageUrl)?.id || null,
      highlighted: item.highlighted,
      active: item.active,
      displayOrder: item.displayOrder,
      categoryId: item.category.id,
      tagCodes: item.tags.map((tag) => tag.code),
    });
    this.scrollToItemEditor();
  }

  saveItem(): void {
    if (this.savingItem()) return;
    if (this.itemForm.invalid || !this.validateTranslations('item')) {
      this.itemForm.markAllAsTouched();
      this.showToast('error', 'Completa las traducciones obligatorias antes de guardar.');
      return;
    }
    this.savingItem.set(true);
    const payload = { ...this.itemForm.getRawValue(), translations: this.itemTranslations() } as MenuItemRequest;
    const id = this.editingItemId();
    const request = id ? this.api.updateMenuItem(id, payload) : this.api.createMenuItem(payload);
    request.subscribe({
      next: () => this.handleItemSaveSuccess(Boolean(id)),
      error: () => {
        if (id) {
          this.verifySavedAfterUpdateError(id, payload);
          return;
        }
        this.savingItem.set(false);
        this.showToast('error', 'No se pudo crear el plato. Revisa los datos e intentalo de nuevo.');
      },
    });
  }

  requestDeleteItem(item: MenuItem): void {
    this.confirmDialog.set({
      type: 'item',
      id: item.id,
      name: item.name,
      title: 'Eliminar plato',
      message: `Seguro que quieres eliminar "${item.name}"?`,
      busy: false,
    });
  }

  requestDeleteCategory(category: Category): void {
    this.confirmDialog.set({
      type: 'category',
      id: category.id,
      name: category.name,
      title: 'Eliminar categoria',
      message: `Seguro que quieres eliminar "${category.name}"?`,
      busy: false,
    });
  }

  requestDeleteImage(image: MediaAsset): void {
    this.confirmDialog.set({
      type: 'media',
      id: image.id,
      name: image.originalFileName,
      title: 'Eliminar imagen',
      message: 'Seguro que quieres eliminar esta imagen?',
      busy: false,
    });
  }

  requestDeleteTag(tag: AllergenTag): void {
    this.confirmDialog.set({
      type: 'tag',
      id: tag.id,
      name: tag.name,
      title: 'Eliminar tag',
      message: `Seguro que quieres eliminar "${tag.name}"?`,
      busy: false,
    });
  }

  cancelConfirm(): void {
    if (this.confirmDialog()?.busy) return;
    this.confirmDialog.set(null);
  }

  confirmDelete(): void {
    const dialog = this.confirmDialog();
    if (!dialog || dialog.busy) return;
    this.confirmDialog.set({ ...dialog, busy: true });

    const request = dialog.type === 'item'
      ? this.api.deleteMenuItem(dialog.id)
      : dialog.type === 'category'
        ? this.api.deleteCategory(dialog.id)
        : dialog.type === 'media'
          ? this.api.deleteMediaImage(dialog.id)
          : this.api.deleteTag(dialog.id);

    request.subscribe({
      next: () => {
        if (dialog.type === 'item' && this.editingItemId() === dialog.id) {
          this.resetItemForm();
        }
        if (dialog.type === 'category' && this.editingCategoryId() === dialog.id) {
          this.resetCategoryForm();
        }
        if (dialog.type === 'media') {
          this.mediaImages.update((images) => images.filter((image) => image.id !== dialog.id));
          if (this.itemForm.controls.imageAssetId.value === dialog.id) this.removeImage();
        }
        if (dialog.type === 'tag' && this.editingTagId() === dialog.id) {
          this.resetTagForm();
        }
        this.confirmDialog.set(null);
        if (dialog.type !== 'media') this.reload('Elemento eliminado, pero no se pudo refrescar la lista.');
        this.showToast('success', dialog.type === 'item' ? 'Plato eliminado correctamente.' : dialog.type === 'category' ? 'Categoria eliminada correctamente.' : dialog.type === 'media' ? 'Imagen eliminada correctamente.' : 'Tag eliminado correctamente.');
      },
      error: (error) => {
        this.confirmDialog.set(null);
        this.showToast('error', dialog.type === 'item' ? 'No se pudo eliminar el plato.' : dialog.type === 'category' ? this.categoryDeleteErrorMessage() : dialog.type === 'media' ? this.mediaDeleteErrorMessage(error) : (error?.error?.message || 'No se pudo eliminar el tag.'));
      },
    });
  }

  selectedTagLabels(): string[] {
    const selected = new Set(this.itemForm.controls.tagCodes.value);
    return this.tags().filter((tag) => selected.has(tag.code)).map((tag) => tag.label);
  }

  toggleTag(code: string, checked: boolean): void {
    const current = this.itemForm.controls.tagCodes.value;
    this.itemForm.controls.tagCodes.setValue(checked ? [...current, code] : current.filter((tag) => tag !== code));
  }

  selectedImageUrl(): string {
    return this.api.imageSrc(this.itemForm.controls.imageUrl.value);
  }

  mediaImageUrl(image: MediaAsset): string {
    return this.api.imageSrc(image.url);
  }

  selectImage(image: MediaAsset): void {
    this.itemForm.controls.imageUrl.setValue(image.url);
    this.itemForm.controls.imageAssetId.setValue(image.id);
    this.imageUploadError.set('');
  }

  removeImage(): void {
    this.itemForm.controls.imageUrl.setValue('');
    this.itemForm.controls.imageAssetId.setValue(null);
    this.imageUploadError.set('');
  }

  uploadDishImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const validationError = this.validateImageFile(file);
    if (validationError) {
      this.imageUploadError.set(validationError);
      this.showToast('error', validationError);
      return;
    }

    this.uploadingImage.set(true);
    this.imageUploadError.set('');
    this.api.uploadMediaImage(file).subscribe({
      next: (image) => {
        this.mediaImages.update((images) => [image, ...images.filter((current) => current.id !== image.id)]);
        this.selectImage(image);
        this.uploadingImage.set(false);
        this.showToast('success', 'Imagen subida correctamente.');
      },
      error: (error) => {
        const message = error?.error?.message || 'No se pudo subir la imagen.';
        this.imageUploadError.set(message);
        this.uploadingImage.set(false);
        this.showToast('error', message);
      },
    });
  }

  cancelEdit(): void {
    this.resetItemForm();
  }

  newItem(): void {
    this.resetItemForm();
    this.scrollToItemEditor();
  }

  resetItemFilters(): void {
    this.itemSearch.set('');
    this.itemCategoryFilter.set('');
    this.itemStatusFilter.set('all');
    this.itemFeaturedFilter.set('all');
  }

  setItemStatusFilter(value: string): void {
    this.itemStatusFilter.set(this.isItemStatusFilter(value) ? value : 'all');
  }

  setItemFeaturedFilter(value: string): void {
    this.itemFeaturedFilter.set(this.isFeaturedFilter(value) ? value : 'all');
  }

  scrollTags(event: WheelEvent): void {
    const tags = event.currentTarget as HTMLElement;
    const maxScroll = tags.scrollWidth - tags.clientWidth;
    if (maxScroll <= 0) return;

    const delta = event.deltaX || event.deltaY;
    const nextScroll = Math.min(Math.max(tags.scrollLeft + delta, 0), maxScroll);
    if (nextScroll === tags.scrollLeft) return;
    event.preventDefault();
    tags.scrollLeft = nextScroll;
  }

  private isItemStatusFilter(value: string): value is ItemStatusFilter {
    return value === 'all' || value === 'active' || value === 'inactive';
  }

  private isFeaturedFilter(value: string): value is FeaturedFilter {
    return value === 'all' || value === 'featured' || value === 'normal';
  }

  private normalize(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private scrollToItemEditor(): void {
    this.scrollToEditor(this.itemEditor?.nativeElement);
  }

  private scrollToCategoryEditor(): void {
    this.scrollToEditor(this.categoryEditor?.nativeElement);
  }

  private scrollToTagEditor(): void {
    this.scrollToEditor(this.tagEditor?.nativeElement);
  }

  private scrollToEditor(editor?: HTMLElement): void {
    if (!editor) return;

    const header = document.querySelector<HTMLElement>('app-site-header .site-header');
    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const targetPosition = editor.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
    window.scrollTo({ top: Math.max(targetPosition, 0), behavior: 'smooth' });
  }

  private handleItemSaveSuccess(wasEditing: boolean): void {
    this.showToast('success', wasEditing ? 'Cambios guardados correctamente.' : 'Plato creado correctamente.');
    this.resetItemForm();
    this.reload('Operacion correcta, pero no se pudo refrescar la lista.');
    this.savingItem.set(false);
  }

  private verifySavedAfterUpdateError(id: number, payload: MenuItemRequest): void {
    this.api.getAdminMenuItems().subscribe({
      next: (items) => {
        const saved = items.find((item) => item.id === id);
        if (saved && this.savedItemMatchesPayload(saved, payload)) {
          this.handleItemSaveSuccess(true);
          return;
        }
        this.savingItem.set(false);
        this.showToast('error', 'No se pudieron guardar los cambios.');
      },
      error: () => {
        this.savingItem.set(false);
        this.showToast('error', 'No se pudieron guardar los cambios.');
      },
    });
  }

  private savedItemMatchesPayload(saved: MenuItem, payload: MenuItemRequest): boolean {
    const sameTags = this.sameStringSet(saved.tags.map((tag) => tag.code), payload.tagCodes || []);
    return saved.name === payload.name
      && saved.description === payload.description
      && Number(saved.price) === Number(payload.price)
      && (saved.imageUrl || '') === (payload.imageUrl || '')
      && (saved.imageAssetId || null) === (payload.imageAssetId || null)
      && Boolean(saved.highlighted) === Boolean(payload.highlighted)
      && Boolean(saved.active) === Boolean(payload.active)
      && Number(saved.displayOrder) === Number(payload.displayOrder)
      && saved.category.id === Number(payload.categoryId)
      && sameTags;
  }

  private sameStringSet(left: string[], right: string[]): boolean {
    if (left.length !== right.length) return false;
    const values = new Set(left);
    return right.every((value) => values.has(value));
  }

  private categoryDeleteErrorMessage(): string {
    return 'No se puede eliminar una categoria que tiene platos. Desactivala o mueve/elimina esos platos primero.';
  }

  private mediaDeleteErrorMessage(error: any): string {
    const message = error?.error?.message || 'No se pudo eliminar la imagen.';
    const dishes = error?.error?.fields?.platos;
    return dishes ? `${message} Platos: ${dishes}.` : message;
  }

  private resetItemForm(): void {
    this.editingItemId.set(null);
    this.itemTranslations.set(this.emptyTranslations());
    this.activeItemLanguage.set('es');
    this.itemForm.reset({
      name: '',
      slug: '',
      description: '',
      price: 0,
      imageUrl: '',
      imageAssetId: null,
      highlighted: false,
      active: true,
      displayOrder: 0,
      categoryId: this.categories()[0]?.id || 0,
      tagCodes: [],
    });
  }

  private resetCategoryForm(): void {
    this.editingCategoryId.set(null);
    this.categoryTranslations.set(this.emptyTranslations(true));
    this.activeCategoryLanguage.set('es');
    this.categoryForm.reset({
      name: '',
      slug: '',
      description: '',
      displayOrder: 0,
      active: true,
    });
  }

  private resetTagForm(): void {
    this.editingTagId.set(null);
    this.tagTranslations.set(this.emptyTranslations(false));
    this.activeTagLanguage.set('es');
    this.tagForm.reset({
      name: '',
      icon: '',
      type: 'ALLERGEN',
    });
  }

  private showToast(type: ToastType, message: string): void {
    this.toast.set({ type, message });
    if (this.toastTimeout) {
      window.clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = window.setTimeout(() => this.toast.set(null), 4200);
  }

  private validateImageFile(file: File): string {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Formato no permitido. Usa JPG, JPEG, PNG o WEBP.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'La imagen no puede superar 5 MB.';
    }
    return '';
  }

  private emptyTranslations(withDescription = true): TranslationMap {
    return Object.fromEntries(this.languages.map((language) => [language.code, { name: '', description: withDescription ? '' : '' }]));
  }

  private translationsFromEntity(existing: TranslationMap | undefined, fallbackName: string, fallbackDescription: string, withDescription: boolean): TranslationMap {
    return Object.fromEntries(this.languages.map((language) => {
      const translation = existing?.[language.code];
      return [language.code, {
        name: translation?.name || fallbackName || '',
        description: withDescription ? (translation?.description || fallbackDescription || '') : '',
      }];
    }));
  }

  private withTranslationValue(translations: TranslationMap, language: string, field: 'name' | 'description', value: string): TranslationMap {
    return {
      ...translations,
      [language]: {
        name: translations[language]?.name || '',
        description: translations[language]?.description || '',
        [field]: value,
      },
    };
  }

  private setActiveTranslationLanguage(kind: 'category' | 'item' | 'tag', language: LanguageCode): void {
    if (kind === 'category') this.activeCategoryLanguage.set(language);
    if (kind === 'item') this.activeItemLanguage.set(language);
    if (kind === 'tag') this.activeTagLanguage.set(language);
  }

  private syncCategoryPrimaryFields(): void {
    const primary = this.categoryTranslations()['es'];
    this.categoryForm.controls.name.setValue(primary?.name || '');
    this.categoryForm.controls.description.setValue(primary?.description || '');
  }

  private syncItemPrimaryFields(): void {
    const primary = this.itemTranslations()['es'];
    this.itemForm.controls.name.setValue(primary?.name || '');
    this.itemForm.controls.description.setValue(primary?.description || '');
  }

  private syncTagPrimaryFields(): void {
    const primary = this.tagTranslations()['es'];
    this.tagForm.controls.name.setValue(primary?.name || '');
  }
}
