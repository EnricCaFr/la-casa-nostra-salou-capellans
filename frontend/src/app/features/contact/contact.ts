import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { I18nService } from '../../core/i18n.service';
import { RestaurantInfo } from '../../core/models';
import { GOOGLE_MAPS_URL, RESTAURANT_NAME } from '../../core/site-content';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
  private readonly api = inject(ApiService);
  readonly i18n = inject(I18nService);
  readonly restaurantName = RESTAURANT_NAME;
  readonly googleMapsUrl = GOOGLE_MAPS_URL;
  info?: RestaurantInfo;

  ngOnInit(): void {
    this.api.getRestaurantInfo().subscribe((info) => (this.info = info));
  }
}
