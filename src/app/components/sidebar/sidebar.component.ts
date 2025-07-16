import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles?: string[]; 
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '', roles: ['Admin', 'Formateur'] },
  { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '', roles: ['Admin', 'Formateur'] },
  { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '', roles: ['Admin', 'Formateur'] }, 
  { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '', roles: ['Admin', 'Formateur'] },
  { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '', roles: ['Admin'] }
 /* { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '' },
  { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' }*/
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    this.menuItems = ROUTES.filter(menuItem => {
      // ✅ If no roles specified, show to everyone
      if (!menuItem.roles) return true;

      return currentUser && menuItem.roles.includes(currentUser.role);
    });

    this.router.events.subscribe(() => {
      this.isCollapsed = true;
    });
  }
}