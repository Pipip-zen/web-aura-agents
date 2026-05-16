const INSTALL_DISMISSED_KEY = 'aura-install-dismissed-v1';

let installPromptEvent = null;
let installed = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

export function isInstallDismissed() {
  return localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true';
}

export function dismissInstallPrompt() {
  localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
}

export function isInstalled() {
  return installed;
}

export function hasInstallPrompt() {
  return Boolean(installPromptEvent);
}

export function consumeInstallPromptEvent() {
  const event = installPromptEvent;
  installPromptEvent = null;
  return event;
}

export function setupInstallPromptListeners(onChange) {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPromptEvent = event;
    onChange?.();
  });

  window.addEventListener('appinstalled', () => {
    installed = true;
    installPromptEvent = null;
    dismissInstallPrompt();
    onChange?.();
  });
}
