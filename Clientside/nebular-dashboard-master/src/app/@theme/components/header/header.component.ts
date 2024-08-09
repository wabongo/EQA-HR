import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils.ts';
import { map, filter, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { AuthService } from '../../../@auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user$: Observable<any>; // Declare user$ Observable
  isUserLoaded = false;

  themes = [
    { value: 'default', name: 'Light' },
    { value: 'dark', name: 'Dark' },
    { value: 'cosmic', name: 'Cosmic' },
    { value: 'corporate', name: 'Corporate' },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe(isLessThanXl => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    // Initialize the user$ Observable
    this.user$ = this.authService.getCurrentUser();

    // Subscribe to user$ to get the user profile data
    this.user$.pipe(
      filter(user => user !== null), // Only react to non-null values
      takeUntil(this.destroy$)
    ).subscribe(
      user => {
        console.log('Fetched user in HeaderComponent:', user);
        this.isUserLoaded = true;
      },
      error => {
        // this.router.navigate(['/login']);
        console.error('Error fetching user:', error);
      }
    );

    // Ensure user profile is fetched if an access token exists
    if (this.authService.getAccessToken()) {
      this.authService.updateUserProfile();
    }else
    {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}