import { Location } from '@angular/common';
import { Component, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { I18nService } from '../../core/i18n.service';
import { MenuItem } from '../../core/models';

@Component({
  selector: 'app-dish-detail',
  imports: [],
  templateUrl: './dish-detail.html',
  styleUrl: './dish-detail.scss',
})
export class DishDetail implements OnInit {
  private static readonly RETURN_DISH_KEY = 'menuReturnDishSlug';

  item?: MenuItem;
  error = '';
  private initialized = false;
  private slug = '';

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
    private readonly router: Router,
    readonly i18n: I18nService) {
    effect(() => {
      this.i18n.language();
      if (this.initialized) this.loadDish();
    });
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.initialized = true;
    this.loadDish();
  }

  private loadDish(): void {
    this.api.getMenuItemBySlug(this.slug).subscribe({
      next: (item) => (this.item = item),
      error: () => (this.error = this.i18n.t('detail.error')),
    });
  }

  dishImage(item: MenuItem): string {
    return this.api.imageSrc(item.imageUrl);
  }

  goBackToMenu(): void {
    if (sessionStorage.getItem(DishDetail.RETURN_DISH_KEY)) {
      this.location.back();
      return;
    }

    this.router.navigate(['/carta']);
  }
}
