import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

/**
 * Root application component
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class App {
  title = 'Employee Management System';
}
