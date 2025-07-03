import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <h2 class="text-xl font-semibold text-slate-700">Loading...</h2>
        <p class="text-sm text-slate-500 mt-2">Please wait while we verify your session</p>
      </div>
    </div>
  `
})
export class LoadingComponent {}
