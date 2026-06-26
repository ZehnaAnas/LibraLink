// src/lib/focus-manager.ts

/**
 * Traps keyboard Tab focus within a given container (e.g., modals or popups)
 */
export function trapFocus(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  container.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });

  firstElement.focus();
}

/**
 * Automatically targets and refocuses the physical hardware barcode input field
 */
export function returnToScanner(): void {
  const scannerInput = document.getElementById('barcode-scanner-input') as HTMLInputElement | null;
  if (scannerInput) {
    scannerInput.focus();
    const length = scannerInput.value.length;
    scannerInput.setSelectionRange(length, length);
  }
}

/**
 * Injects a message into an assertive aria-live region for accessibility software compliance
 */
export function announceAction(message: string): void {
  let liveRegion = document.getElementById('libralink-live-announcer');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'libralink-live-announcer';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }

  liveRegion.textContent = '';
  setTimeout(() => {
    if (liveRegion) liveRegion.textContent = message;
  }, 50);
}