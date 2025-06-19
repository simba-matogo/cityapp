import { Component } from '@angular/core';

@Component({
  selector: 'app-tailwind-showcase',
  standalone: true,
  template: `
    <div class="p-8 space-y-6">
      <!-- Latest Tailwind v4 Features Demo -->
      <h2 class="text-2xl font-bold mb-6 text-center">Tailwind CSS v4.1.10 Latest Features</h2>
      
      <!-- Container Queries -->
      <div class="container mx-auto max-w-4xl">
        <div class="grid grid-cols-1 @lg:grid-cols-2 gap-6 @container">
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">Container Queries Support</h3>
            <p class="text-gray-600">This layout adapts based on its container size, not just the viewport.</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-2">Responsive Design</h3>
            <p class="text-gray-600">Traditional responsive breakpoints still work perfectly.</p>
          </div>
        </div>
      </div>

      <!-- Modern Color Palette -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="h-24 bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
          <span class="text-white font-medium">Slate</span>
        </div>
        <div class="h-24 bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-lg flex items-center justify-center">
          <span class="text-white font-medium">Zinc</span>
        </div>
        <div class="h-24 bg-gradient-to-r from-stone-900 to-stone-700 rounded-lg flex items-center justify-center">
          <span class="text-white font-medium">Stone</span>
        </div>
        <div class="h-24 bg-gradient-to-r from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center">
          <span class="text-white font-medium">Neutral</span>
        </div>
      </div>

      <!-- Advanced Typography -->
      <div class="prose prose-lg max-w-none">
        <h3 class="text-3xl font-bold tracking-tight">Enhanced Typography</h3>
        <p class="text-lg leading-relaxed text-gray-700">
          Tailwind CSS v4.1.10 includes improved typography utilities with better line heights, 
          letter spacing, and text decoration options for modern web applications.
        </p>
      </div>

      <!-- Interactive Elements -->
      <div class="flex flex-wrap gap-4">
        <button class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 active:scale-95">
          Primary Action
        </button>
        <button class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200">
          Secondary Action
        </button>
        <button class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-lg hover:shadow-xl">
          Gradient Button
        </button>
      </div>
    </div>
  `,
})
export class TailwindShowcaseComponent {}
