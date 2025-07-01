import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkMode.asObservable();
  private renderer: Renderer2;
  private THEME_KEY = 'city_app_theme';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadSavedTheme();
  }

  /**
   * Load the saved theme preference from localStorage
   */
  private loadSavedTheme(): void {
    try {
      const savedTheme = localStorage.getItem(this.THEME_KEY);
      if (savedTheme) {
        const isDark = savedTheme === 'dark';
        this.setDarkMode(isDark);
      } else {
        // Check if user prefers dark mode based on system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setDarkMode(prefersDarkMode);
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }
  }

  /**
   * Toggle between dark and light mode
   */
  toggleDarkMode(): void {
    const newMode = !this.isDarkMode.value;
    this.setDarkMode(newMode);
  }

  /**
   * Set the dark mode state
   * @param isDark Whether to enable dark mode
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkMode.next(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }

  /**
   * Get the current theme mode
   * @returns Observable of boolean indicating if dark mode is enabled
   */
  isDarkModeEnabled(): Observable<boolean> {
    return this.isDarkMode$;
  }
}
