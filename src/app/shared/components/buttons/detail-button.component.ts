import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <button
      [routerLink]="['/movies/details', movieId]"
      class="absolute top-0 right-0 w-6 h-6 flex items-center justify-center text-white bg-gray-300 rounded-bl rounded-tr hover:bg-gray-500 transition group"
      aria-label="Voir la page de détail"
    >
      i
      <!-- Tooltip -->
      <span
        class="absolute -top-8 left-4 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap"
      >
        Voir les détails
      </span>
    </button>
  `,
})
export class DetailButtonComponent {
  @Input() movieId!: number;
}
