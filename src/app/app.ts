import { Component } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { PwaPromptComponent } from './shared/components/pwa-prompt/pwa-prompt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, PwaPromptComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto p-4">
      <router-outlet> </router-outlet>
    </main>
    <app-pwa-prompt></app-pwa-prompt>
  `,
  styles: [],
})
export class App {
  title = 'projet-angular-m2';
}
