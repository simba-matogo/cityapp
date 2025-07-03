import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.darkModeSubject.asObservable();
  private readonly SESSION_THEME_KEY = 'sessionDarkMode';

  constructor() {
    // Always start in light mode on service initialization
    this.resetToLightMode();
  }

  /**
   * Force reset to light mode and clear saved preferences
   */
  resetToLightMode(): void {
    // Clear any saved theme preferences
    localStorage.removeItem('darkMode');
    sessionStorage.removeItem(this.SESSION_THEME_KEY);
    // Force light mode
    this.setDarkMode(false);
    // Remove dark class from document if it exists
    document.documentElement.classList.remove('dark');
  }

  /**
   * Initialize theme from session (used after auth)
   * Returns to light mode on new login, preserves theme during session
   */
  initializeFromSession(): void {
    const sessionTheme = sessionStorage.getItem(this.SESSION_THEME_KEY);
    if (sessionTheme && JSON.parse(sessionTheme) === true) {
      this.setDarkMode(true);
    } else {
      this.setDarkMode(false);
    }
  }

  toggleDarkMode(): void {
    const currentMode = this.darkModeSubject.value;
    this.setDarkMode(!currentMode);
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    // Store theme preference in session storage only
    sessionStorage.setItem(this.SESSION_THEME_KEY, JSON.stringify(isDark));
    
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
