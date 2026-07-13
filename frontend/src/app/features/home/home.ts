import { Component, OnInit, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { I18nService } from '../../core/i18n.service';
import { Category, MenuItem, RestaurantInfo } from '../../core/models';
import { GALLERY_IMAGES, GOOGLE_MAPS_URL, HERO_IMAGE_URL, RESTAURANT_NAME } from '../../core/site-content';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  info?: RestaurantInfo;
  categories: Category[] = [];
  highlighted: MenuItem[] = [];
  loading = true;
  readonly restaurantName = RESTAURANT_NAME;
  readonly googleMapsUrl = GOOGLE_MAPS_URL;
  readonly heroImageUrl = `url('${HERO_IMAGE_URL}')`;
  readonly gallery = GALLERY_IMAGES;
  private initialized = false;

  constructor(private readonly api: ApiService, readonly i18n: I18nService) {
    effect(() => {
      this.i18n.language();
      if (this.initialized) this.loadHome();
    });
  }

  ngOnInit(): void {
    this.initialized = true;
    this.loadHome();
  }

  private loadHome(): void {
    this.loading = true;
    forkJoin({
      info: this.api.getRestaurantInfo(),
      categories: this.api.getCategories(),
      items: this.api.getMenuItems(),
    }).subscribe({
      next: ({ info, categories, items }) => {
        this.info = info;
        this.categories = categories;
        this.highlighted = items.filter((item) => item.highlighted).slice(0, 3);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openingHoursLines(): string[] {
    const hours = this.i18n.openingHours(this.info?.openingHours);
    return hours
      .split(/[,;|]/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  dishImage(item: MenuItem): string {
    return this.api.imageSrc(item.imageUrl);
  }
}
