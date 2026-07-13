import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { I18nService } from '../../core/i18n.service';
import { Category, MenuItem } from '../../core/models';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit, AfterViewInit, OnDestroy {
  private static readonly RETURN_DISH_KEY = 'menuReturnDishSlug';
  private static readonly RETURN_SCROLL_KEY = 'menuReturnScrollY';
  private static readonly RETURN_CATEGORY_KEY = 'menuReturnCategory';
  private static readonly RETURN_HISTORY_STATE_KEY = 'menuReturnState';

  @ViewChild('menuFiltersAnchor') private readonly filtersAnchor?: ElementRef<HTMLElement>;
  @ViewChild('menuFilters') private readonly menuFilters?: ElementRef<HTMLElement>;

  categories = signal<Category[]>([]);
  items = signal<MenuItem[]>([]);
  selectedCategory = signal('');
  loading = signal(true);
  error = signal('');
  showFiltersButton = signal(false);
  highlightedSlug = signal('');
  private initialized = false;
  private filtersFabFrame = 0;
  private returnScrollY: number | null = null;
  private targetDish = '';
  private targetDishFromQuery = false;
  private readonly scheduleFiltersFabViewportOffset = (): void => {
    if (this.filtersFabFrame) return;
    this.filtersFabFrame = window.requestAnimationFrame(() => {
      this.filtersFabFrame = 0;
      this.updateFiltersFabViewportOffset();
    });
  };

  filtered = computed(() => {
    const category = this.selectedCategory();
    return this.items().filter((item) => {
      const categoryOk = !category || item.category.slug === category;
      return categoryOk;
    });
  });

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    readonly i18n: I18nService) {
    effect(() => {
      this.i18n.language();
      if (this.initialized) this.loadMenu(false);
    });
  }

  ngOnInit(): void {
    const routeCategory = this.route.snapshot.queryParamMap.get('categoria') || '';
    const queryDish = this.route.snapshot.queryParamMap.get('plato') || '';
    this.targetDishFromQuery = Boolean(queryDish);
    const returnState = this.targetDishFromQuery ? null : this.consumeReturnHistoryState();

    if (!returnState || this.targetDishFromQuery) {
      this.clearReturnState();
    }

    const returnDish = returnState?.slug || '';
    const returnCategory = returnState?.category || '';
    this.returnScrollY = returnState?.scrollY ?? null;
    this.targetDish = queryDish || returnDish;
    this.selectedCategory.set(routeCategory || returnCategory);
    this.initialized = true;
    this.loadMenu(true);
  }

  ngAfterViewInit(): void {
    this.updateFiltersFabViewportOffset();
    window.visualViewport?.addEventListener('resize', this.scheduleFiltersFabViewportOffset, { passive: true });
    window.visualViewport?.addEventListener('scroll', this.scheduleFiltersFabViewportOffset, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.filtersFabFrame) window.cancelAnimationFrame(this.filtersFabFrame);
    window.visualViewport?.removeEventListener('resize', this.scheduleFiltersFabViewportOffset);
    window.visualViewport?.removeEventListener('scroll', this.scheduleFiltersFabViewportOffset);
    document.documentElement.style.removeProperty('--filters-fab-viewport-offset');
  }

  private loadMenu(allowDishScroll: boolean): void {
    this.loading.set(true);
    forkJoin({ categories: this.api.getCategories(), items: this.api.getMenuItems() }).subscribe({
      next: ({ categories, items }) => {
        this.categories.set(categories);
        this.items.set(items);
        this.loading.set(false);
        if (allowDishScroll && this.targetDish && !this.targetDishFromQuery) {
          this.restoreReturnedDish(this.targetDish, this.returnScrollY);
          return;
        }
        if (allowDishScroll && this.targetDish) {
          window.setTimeout(() => this.scrollToDish(this.targetDish), 80);
        }
      },
      error: () => {
        this.error.set(this.i18n.t('menu.loadingError'));
        this.loading.set(false);
      },
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const filters = this.menuFilters?.nativeElement;
    if (!filters) {
      this.showFiltersButton.set(false);
      return;
    }

    this.showFiltersButton.set(filters.getBoundingClientRect().bottom <= 0);
  }

  dishImage(item: MenuItem): string {
    return this.api.imageSrc(item.imageUrl);
  }

  rememberDishForBackNavigation(slug: string): void {
    const state = {
      slug,
      scrollY: window.scrollY,
      category: this.selectedCategory(),
    };
    sessionStorage.setItem(Menu.RETURN_DISH_KEY, slug);
    sessionStorage.setItem(Menu.RETURN_SCROLL_KEY, String(state.scrollY));
    sessionStorage.setItem(Menu.RETURN_CATEGORY_KEY, state.category);
    this.markCurrentHistoryEntryForReturn(state);
  }

  groupedItems(): { category: Category; items: MenuItem[] }[] {
    return this.categories()
      .map((category) => ({ category, items: this.filtered().filter((item) => item.category.id === category.id) }))
      .filter((group) => group.items.length);
  }

  scrollToFilters(): void {
    const anchor = this.filtersAnchor?.nativeElement;
    if (!anchor) return;

    const targetPosition = anchor.offsetTop - this.headerOffset();
    window.scrollTo({
      top: Math.max(targetPosition, 0),
      behavior: 'smooth',
    });
  }

  private headerOffset(): number {
    return document.querySelector<HTMLElement>('app-site-header .site-header')?.offsetHeight ?? 0;
  }

  private scrollToDish(slug: string): void {
    const card = document.getElementById(`plato-${slug}`);
    if (!card) return;

    const targetPosition = card.getBoundingClientRect().top + window.scrollY - this.headerOffset() - 18;
    this.highlightedSlug.set(slug);
    window.scrollTo({ top: Math.max(targetPosition, 0), behavior: 'smooth' });
    this.repaintFilters();
    if (this.targetDishFromQuery) this.clearDishScrollParam();
    window.setTimeout(() => {
      if (this.highlightedSlug() === slug) this.highlightedSlug.set('');
    }, 3200);
  }

  private restoreReturnedDish(slug: string, fallbackScrollY: number | null, attempt = 0): void {
    window.requestAnimationFrame(() => {
      const card = document.getElementById(`plato-${slug}`);
      if (card) {
        const targetPosition = card.getBoundingClientRect().top + window.scrollY - this.headerOffset() - 18;
        window.scrollTo({ top: Math.max(targetPosition, 0), behavior: 'auto' });
        this.highlightReturnDish(slug);
        this.onWindowScroll();
        return;
      }

      if (attempt < 20) {
        this.restoreReturnedDish(slug, fallbackScrollY, attempt + 1);
        return;
      }

      if (fallbackScrollY !== null) {
        window.scrollTo({ top: Math.max(fallbackScrollY, 0), behavior: 'auto' });
        this.highlightReturnDish(slug);
        this.onWindowScroll();
      }
    });
  }

  private consumeReturnDish(): string {
    const slug = sessionStorage.getItem(Menu.RETURN_DISH_KEY) || '';
    if (slug) sessionStorage.removeItem(Menu.RETURN_DISH_KEY);
    return slug;
  }

  private consumeReturnScroll(): number | null {
    const value = sessionStorage.getItem(Menu.RETURN_SCROLL_KEY);
    if (value) sessionStorage.removeItem(Menu.RETURN_SCROLL_KEY);
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private consumeReturnCategory(): string {
    const category = sessionStorage.getItem(Menu.RETURN_CATEGORY_KEY) || '';
    if (category) sessionStorage.removeItem(Menu.RETURN_CATEGORY_KEY);
    return category;
  }

  private consumeReturnHistoryState(): { slug: string; scrollY: number | null; category: string } | null {
    const historyState = window.history.state || {};
    const state = historyState[Menu.RETURN_HISTORY_STATE_KEY];
    if (!state) return null;

    const slug = typeof state?.slug === 'string' ? state.slug : this.consumeReturnDish();
    const scrollY = Number.isFinite(Number(state?.scrollY)) ? Number(state.scrollY) : this.consumeReturnScroll();
    const category = typeof state?.category === 'string' ? state.category : this.consumeReturnCategory();

    const nextState = { ...historyState };
    delete nextState[Menu.RETURN_HISTORY_STATE_KEY];
    window.history.replaceState(nextState, document.title);

    if (!slug) return null;
    this.clearReturnState();
    return { slug, scrollY, category };
  }

  private markCurrentHistoryEntryForReturn(state: { slug: string; scrollY: number; category: string }): void {
    const currentState = window.history.state || {};
    window.history.replaceState(
      { ...currentState, [Menu.RETURN_HISTORY_STATE_KEY]: state },
      document.title,
    );
  }

  private clearReturnState(): void {
    sessionStorage.removeItem(Menu.RETURN_DISH_KEY);
    sessionStorage.removeItem(Menu.RETURN_SCROLL_KEY);
    sessionStorage.removeItem(Menu.RETURN_CATEGORY_KEY);
    const historyState = window.history.state || {};
    if (historyState[Menu.RETURN_HISTORY_STATE_KEY]) {
      const nextState = { ...historyState };
      delete nextState[Menu.RETURN_HISTORY_STATE_KEY];
      window.history.replaceState(nextState, document.title);
    }
  }

  private highlightReturnDish(slug: string): void {
    if (!slug) return;
    this.highlightedSlug.set(slug);
    this.repaintFilters();
    window.setTimeout(() => {
      if (this.highlightedSlug() === slug) this.highlightedSlug.set('');
    }, 2200);
  }

  private clearDishScrollParam(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { plato: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private repaintFilters(): void {
    window.requestAnimationFrame(() => {
      const filters = document.querySelector<HTMLElement>('.menu-filters');
      if (!filters) return;

      filters.style.transform = 'translateZ(0)';
      window.requestAnimationFrame(() => filters.style.removeProperty('transform'));
    });
  }

  private updateFiltersFabViewportOffset(): void {
    const viewport = window.visualViewport;
    const offset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
    document.documentElement.style.setProperty('--filters-fab-viewport-offset', `${Math.round(offset)}px`);
  }
}
