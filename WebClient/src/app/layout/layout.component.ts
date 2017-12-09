import { Component } from '@angular/core';

@Component({
   moduleId: module.id,
   templateUrl: 'layout.component.html'
})

export class LayoutComponent {

  collapsed = false;

  toggle() {
    this.collapsed = !this.collapsed;
  }
}
