import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllergenTag, AllergenTagRequest, Category, MediaAsset, MenuItem, MenuItemRequest, RestaurantInfo } from './models';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = '/api';

  constructor(private readonly http: HttpClient, private readonly i18n: I18nService) {}

  getRestaurantInfo(): Observable<RestaurantInfo> {
    return this.http.get<RestaurantInfo>(`${this.baseUrl}/restaurant-info`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`, { params: this.langParams() });
  }

  getTags(): Observable<AllergenTag[]> {
    return this.http.get<AllergenTag[]>(`${this.baseUrl}/tags`, { params: this.langParams() });
  }

  getAdminCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/admin/categories`);
  }

  getMenuItems(filters: { category?: string; search?: string; tags?: string[] } = {}): Observable<MenuItem[]> {
    let params = this.langParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.tags?.length) params = params.set('tags', filters.tags.join(','));
    return this.http.get<MenuItem[]>(`${this.baseUrl}/menu-items`, { params });
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
    return this.http.post<Category>(`${this.baseUrl}/admin/categories`, payload);
  }

  updateCategory(id: number, payload: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/admin/categories/${id}`, payload);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/categories/${id}`);
  }

  getAdminTags(): Observable<AllergenTag[]> {
    return this.http.get<AllergenTag[]>(`${this.baseUrl}/admin/tags`);
  }

  createTag(payload: AllergenTagRequest): Observable<AllergenTag> {
    return this.http.post<AllergenTag>(`${this.baseUrl}/admin/tags`, payload);
  }

  updateTag(id: number, payload: AllergenTagRequest): Observable<AllergenTag> {
    return this.http.put<AllergenTag>(`${this.baseUrl}/admin/tags/${id}`, payload);
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/tags/${id}`);
  }

  createMenuItem(payload: MenuItemRequest): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.baseUrl}/admin/menu-items`, payload);
  }

  updateMenuItem(id: number, payload: MenuItemRequest): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.baseUrl}/admin/menu-items/${id}`, payload);
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/menu-items/${id}`);
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
}
