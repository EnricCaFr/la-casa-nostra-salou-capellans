import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { AllergenTag, AllergenTagRequest, Category, MediaAsset, MenuItem, MenuItemRequest, RestaurantInfo } from './models';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = '/api';
  private readonly categoriesCache = new Map<string, Observable<Category[]>>();
  private readonly tagsCache = new Map<string, Observable<AllergenTag[]>>();
  private readonly menuItemsCache = new Map<string, Observable<MenuItem[]>>();

  constructor(private readonly http: HttpClient, private readonly i18n: I18nService) {}

  getRestaurantInfo(): Observable<RestaurantInfo> {
    return this.http.get<RestaurantInfo>(`${this.baseUrl}/restaurant-info`);
  }

  getCategories(): Observable<Category[]> {
    const key = this.i18n.language();
    return this.cached(this.categoriesCache, key, () =>
      this.http.get<Category[]>(`${this.baseUrl}/categories`, { params: this.langParams() }));
  }

  getTags(): Observable<AllergenTag[]> {
    const key = this.i18n.language();
    return this.cached(this.tagsCache, key, () =>
      this.http.get<AllergenTag[]>(`${this.baseUrl}/tags`, { params: this.langParams() }));
  }

  getAdminCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/admin/categories`);
  }

  getMenuItems(filters: { category?: string; search?: string; tags?: string[] } = {}): Observable<MenuItem[]> {
    let params = this.langParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.tags?.length) params = params.set('tags', filters.tags.join(','));
    const key = JSON.stringify({
      lang: this.i18n.language(),
      category: filters.category || '',
      search: filters.search || '',
      tags: filters.tags || [],
    });
    return this.cached(this.menuItemsCache, key, () =>
      this.http.get<MenuItem[]>(`${this.baseUrl}/menu-items`, { params }));
  }

  getAdminMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.baseUrl}/admin/menu-items`);
  }

  getMenuItemBySlug(slug: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/menu-items/slug/${slug}`, { params: this.langParams() });
  }

  getMenuItem(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.baseUrl}/menu-items/${id}`, { params: this.langParams() });
  }

  createCategory(payload: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/admin/categories`, payload).pipe(
      tap(() => this.clearPublicCache()));
  }

  updateCategory(id: number, payload: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/admin/categories/${id}`, payload).pipe(
      tap(() => this.clearPublicCache()));
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/categories/${id}`).pipe(
      tap(() => this.clearPublicCache()));
  }

  getAdminTags(): Observable<AllergenTag[]> {
    return this.http.get<AllergenTag[]>(`${this.baseUrl}/admin/tags`);
  }

  createTag(payload: AllergenTagRequest): Observable<AllergenTag> {
    return this.http.post<AllergenTag>(`${this.baseUrl}/admin/tags`, payload).pipe(
      tap(() => this.clearPublicCache()));
  }

  updateTag(id: number, payload: AllergenTagRequest): Observable<AllergenTag> {
    return this.http.put<AllergenTag>(`${this.baseUrl}/admin/tags/${id}`, payload).pipe(
      tap(() => this.clearPublicCache()));
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/tags/${id}`).pipe(
      tap(() => this.clearPublicCache()));
  }

  createMenuItem(payload: MenuItemRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.baseUrl}/admin/menu-items`, payload).pipe(
      tap(() => this.clearPublicCache()));
  }

  updateMenuItem(id: number, payload: MenuItemRequest): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.baseUrl}/admin/menu-items/${id}`, payload).pipe(
      tap(() => this.clearPublicCache()));
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/menu-items/${id}`).pipe(
      tap(() => this.clearPublicCache()));
  }

  getMediaImages(): Observable<MediaAsset[]> {
    return this.http.get<MediaAsset[]>(`${this.baseUrl}/admin/media/images`);
  }

  uploadMediaImage(file: File): Observable<MediaAsset> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaAsset>(`${this.baseUrl}/admin/media/images`, formData);
  }

  deleteMediaImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/media/images/${id}`);
  }

  imageSrc(url?: string | null): string {
    if (!url) return 'dishes/placeholder.svg';
    return url;
  }

  private langParams(): HttpParams {
    return new HttpParams().set('lang', this.i18n.language());
  }

  private cached<T>(cache: Map<string, Observable<T>>, key: string, request: () => Observable<T>): Observable<T> {
    const cached = cache.get(key);
    if (cached) return cached;

    const value = request().pipe(shareReplay({ bufferSize: 1, refCount: false }));
    cache.set(key, value);
    return value;
  }

  private clearPublicCache(): void {
    this.categoriesCache.clear();
    this.tagsCache.clear();
    this.menuItemsCache.clear();
  }
}
