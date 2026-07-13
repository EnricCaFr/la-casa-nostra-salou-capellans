import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService, LanguageCode } from '../../core/i18n.service';
import { RESTAURANT_NAME } from '../../core/site-content';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly restaurantName = RESTAURANT_NAME;
  readonly logoUrl = 'brand/la-casa-nostra-logo.png';
  readonly languages;
  readonly currentLanguage;
  open = false;
  languageOpen = false;
  hidden = false;
  private lastScrollY = 0;
  private readonly mobileHideStart = 120;

  constructor(private readonly router: Router, readonly i18n: I18nService) {
    this.languages = i18n.languages;
    this.currentLanguage = i18n.language;
  }

  setLanguage(language: LanguageCode): void {
    this.i18n.setLanguage(language);
    this.languageOpen = false;
  }

  languageLabel(language: LanguageCode): string {
    const labels: Record<LanguageCode, string> = {
      es: 'Español',
      ca: 'Català',
      en: 'English',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
      nl: 'Nederlands',
      ru: 'Русский',
    };
    return labels[language];
  }

  goToSchedule(): void {
    this.open = false;
    this.router.navigate(['/']).then(() => window.setTimeout(() => this.scrollToSchedule(), 60));
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    if (!isMobile || this.open || this.languageOpen || currentScrollY <= this.mobileHideStart) {
      this.setHidden(false);
      this.lastScrollY = currentScrollY;
      return;
    }

    const delta = currentScrollY - this.lastScrollY;
    if (Math.abs(delta) < 8) return;

    this.setHidden(delta > 0);
    this.lastScrollY = currentScrollY;
  }

  private setHidden(hidden: boolean): void {
    if (this.hidden !== hidden) this.hidden = hidden;
  }

  private scrollToSchedule(): void {
    const section = document.getElementById('horario');
    if (!section) return;

    const headerHeight = document.querySelector<HTMLElement>('app-site-header .site-header')?.offsetHeight ?? 0;
    const targetPosition = section.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(targetPosition, 0), behavior: 'smooth' });
  }
}
