import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-nav',
  imports: [
    NzLayoutModule,
    CommonModule,
    NzMenuModule,
    RouterModule,
    NzIconModule,
    NzBadgeModule
],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  isCollapsed = false;

  constructor() {}

  ngOnInit() {}

    onCollapse(collapsed: boolean): void {
    requestAnimationFrame(() => {
      this.isCollapsed = collapsed;
    });
  }
}
