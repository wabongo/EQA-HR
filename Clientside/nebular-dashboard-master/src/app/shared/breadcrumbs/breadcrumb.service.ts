import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MENU_ITEMS } from '../../pages/pages-menu';
// Adjust the import path as needed

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const breadcrumbs = this.buildBreadcrumbs(this.router.url);
      this.breadcrumbsSubject.next(breadcrumbs);
    });
  }

  private buildBreadcrumbs(url: string): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Home', url: '/pages/home' } // Always add Home as the first breadcrumb
    ];
    
    if (url === '/pages/home') {
      return breadcrumbs; // If we're on the home page, just return Home
    }

    const urlParts = url.split('/').filter(part => part);
    let currentUrl = '';

    urlParts.forEach((part, index) => {
      currentUrl += `/${part}`;
      const menuItem = this.findMenuItem(MENU_ITEMS, currentUrl);
      if (menuItem) {
        breadcrumbs.push({
          label: menuItem.title,
          url: currentUrl
        });
      }
    });

    return breadcrumbs;
  }

  private findMenuItem(items: any[], url: string): any {
    for (const item of items) {
      if (item.link === url) {
        return item;
      }
      if (item.children) {
        const found = this.findMenuItem(item.children, url);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}