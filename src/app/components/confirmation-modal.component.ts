import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]" 
         [@fadeIn]>
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-96 max-w-md mx-4 border border-slate-200 dark:border-slate-700"
           [@slideIn]>
        <!-- Header -->
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
            </div>
          </div>
        </div>
        
        <!-- Body -->
        <div class="p-6">
          <p class="text-slate-600 dark:text-slate-300 leading-relaxed" [innerHTML]="getFormattedMessage()"></p>
        </div>
        
        <!-- Footer -->
        <div class="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button (click)="onCancel()" 
                  class="px-4 py-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors font-medium">
            {{ cancelText }}
          </button>
          <button (click)="onConfirm()" 
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ConfirmationModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    console.log('ConfirmationModal: onConfirm called - custom modal confirming action');
    this.confirmed.emit();
    this.isVisible = false;
  }

  onCancel(): void {
    console.log('ConfirmationModal: onCancel called - custom modal cancelling action');
    this.cancelled.emit();
    this.isVisible = false;
  }

  getFormattedMessage(): string {
    return this.message
      .replace(/\n/g, '<br>')
      .replace(/\\n/g, '<br>')
      // Add some spacing around emojis
      .replace(/([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu, ' $1 ')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  }
}
