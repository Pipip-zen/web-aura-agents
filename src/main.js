import './style.css';
import { renderHub } from './screens/hub.js';
import { renderEvidence } from './screens/evidence.js';
import { renderAiAnalysis } from './screens/ai_analysis.js';
import { renderDecision } from './screens/decision.js';
import { renderNotifications } from './screens/notifications.js';
import { renderAuthScreen } from './screens/auth.js';
import { logout, subscribeToAuthState } from './services/auth_service.js';
import {
  clearDraftClaimPersistence,
  DEFAULT_DRAFT_CLAIM,
  loadDraftClaim,
  persistDraftClaim
} from './config/demo.js';

// App State
export const state = {
  currentRoute: 'hub',
  currentUser: null,
  currentUserId: null,
  currentUsername: '',
  authReady: false,
  authError: null,
  currentClaim: null,
  currentClaimStatus: null,
  draftClaim: loadDraftClaim()
};

// Routes definition
export const routes = {
  'hub': { label: 'Hub', icon: 'grid_view', render: renderHub, showNav: true },
  'evidence': { label: 'Create Claim', icon: 'add_circle', render: renderEvidence, showNav: true },
  'notifications': { label: 'Notifications', icon: 'notifications', render: renderNotifications, showNav: true },
  'analysis': { label: 'Analysis', icon: 'auto_awesome', render: renderAiAnalysis, showNav: false },
  'decision': { label: 'Result', icon: 'verified', render: renderDecision, showNav: false }
};

function initApp() {
  setupNavigation();
  setupAccountMenu();
  setupDragScroll();
  registerServiceWorker();
  renderAuthLoading();
  subscribeToAuthState((user, error) => {
    state.authReady = true;
    state.authError = error;
    state.currentUser = user;
    state.currentUserId = user?.uid || null;
    state.currentUsername = user?.displayName || '';

    if (!user) {
      state.currentClaim = null;
      state.currentClaimStatus = null;
      state.currentUsername = '';
    }

    setupNavigation();
    updateAccountUi();
    navigate(user ? state.currentRoute : 'auth');
  });
}

function setupNavigation() {
  const navContainer = document.getElementById('bottom-nav');
  const desktopContainer = document.getElementById('desktop-nav');
  navContainer.innerHTML = '';
  desktopContainer.innerHTML = '';
  
  Object.keys(routes).forEach(route => {
    if (!routes[route].showNav) return;

    // Mobile nav
    const item = document.createElement('a');
    item.className = 'nav-item flex flex-col items-center justify-center transition-all group cursor-pointer';
    item.id = `nav-${route}`;
    item.innerHTML = `
      <span class="material-symbols-outlined" data-icon="${routes[route].icon}">${routes[route].icon}</span>
      <span class="font-['Space_Grotesk'] text-[10px] uppercase font-medium tracking-tighter mt-1">${routes[route].label}</span>
    `;
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(route);
    });
    navContainer.appendChild(item);

    // Desktop nav
    const dItem = document.createElement('a');
    dItem.className = 'font-["Space_Grotesk"] py-1 transition-colors cursor-pointer desktop-nav-item';
    dItem.id = `desktop-nav-${route}`;
    dItem.innerText = routes[route].label;
    dItem.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(route);
    });
    desktopContainer.appendChild(dItem);
  });
}

function setupAccountMenu() {
  const accountButton = document.getElementById('account-button');
  const accountMenu = document.getElementById('account-menu');
  const logoutButton = document.getElementById('account-logout-btn');
  if (!accountButton || !accountMenu || !logoutButton) return;

  const closeMenu = () => {
    accountMenu.classList.add('hidden');
    accountButton.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    if (!state.currentUser) return;
    accountMenu.classList.toggle('hidden');
    accountButton.setAttribute('aria-expanded', String(!accountMenu.classList.contains('hidden')));
  };

  accountButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  accountMenu.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  logoutButton.addEventListener('click', async () => {
    if (!state.currentUser) return;

    logoutButton.disabled = true;
    logoutButton.textContent = 'Signing out...';

    try {
      await logout();
      state.currentRoute = 'hub';
      resetDraftClaim();
    } catch (error) {
      logoutButton.textContent = error.message || 'Logout failed';
    } finally {
      logoutButton.disabled = false;
      logoutButton.innerHTML = '<span class="material-symbols-outlined text-[18px]">logout</span> Logout';
      closeMenu();
      updateAccountUi();
    }
  });
}

function setupDragScroll() {
  const appContent = document.getElementById('app-content');
  const interactiveSelector = 'button, a, input, select, textarea, label, [role="button"]';
  let isDragging = false;
  let startY = 0;
  let startScrollY = 0;
  let moved = false;

  appContent.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;
    if (event.target.closest(interactiveSelector)) return;

    isDragging = true;
    moved = false;
    startY = event.clientY;
    startScrollY = window.scrollY;
    appContent.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaY = event.clientY - startY;
    if (Math.abs(deltaY) > 3) {
      moved = true;
    }

    if (moved) {
      event.preventDefault();
      window.scrollTo({ top: startScrollY - deltaY, behavior: 'auto' });
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    appContent.classList.remove('is-dragging');
  });

  appContent.addEventListener('dragstart', (event) => {
    if (!event.target.closest(interactiveSelector)) {
      event.preventDefault();
    }
  });
}

function updateLayoutForRoute(route) {
  const navContainer = document.getElementById('bottom-nav');
  const desktopContainer = document.getElementById('desktop-nav');
  const appContent = document.getElementById('app-content');
  const showNav = Boolean(state.currentUser && routes[route]?.showNav);

  navContainer.classList.toggle('is-hidden', !showNav);
  navContainer.setAttribute('aria-hidden', String(!showNav));
  desktopContainer.classList.toggle('md:hidden', !showNav);
  desktopContainer.classList.toggle('md:flex', showNav);
  desktopContainer.setAttribute('aria-hidden', String(!showNav));
  appContent.classList.toggle('nav-hidden', !showNav);
}

function renderAuthLoading() {
  const appContent = document.getElementById('app-content');
  appContent.innerHTML = `
    <div class="flex min-h-[calc(100dvh-120px)] items-center justify-center text-body-md text-on-surface-variant">
      Checking secure session...
    </div>
  `;
  updateLayoutForRoute('auth');
  updateAccountUi();
}

function updateAccountUi() {
  const accountButton = document.getElementById('account-button');
  const accountLabel = document.getElementById('account-label');
  const accountAvatar = document.getElementById('account-avatar');
  const accountMenu = document.getElementById('account-menu');
  const accountMenuName = document.getElementById('account-menu-name');
  const accountMenuEmail = document.getElementById('account-menu-email');
  if (!accountButton || !accountLabel || !accountAvatar || !accountMenu || !accountMenuName || !accountMenuEmail) return;

  const user = state.currentUser;
  accountButton.classList.toggle('cursor-pointer', Boolean(user));
  accountButton.disabled = !user;
  accountButton.title = user ? 'Account menu' : 'Login required';
  accountLabel.textContent = user ? (state.currentUsername || user.email) : 'Guest';
  accountMenuName.textContent = user ? (state.currentUsername || user.email) : 'Guest';
  accountMenuEmail.textContent = user?.email || 'Guest';

  if (!user) {
    accountMenu.classList.add('hidden');
    accountButton.setAttribute('aria-expanded', 'false');
  }

  const initial = (user?.email || 'A').trim().charAt(0).toUpperCase();
  accountAvatar.textContent = initial;
}

export function updateDraftClaim(patch) {
  state.draftClaim = {
    ...state.draftClaim,
    ...patch
  };
  persistDraftClaim(state.draftClaim);
}

export function setCurrentClaim(claim) {
  state.currentClaim = claim;
}

export function setCurrentClaimStatus(status) {
  state.currentClaimStatus = status;
}

export function resetDraftClaim() {
  state.draftClaim = {
    ...DEFAULT_DRAFT_CLAIM
  };
  clearDraftClaimPersistence();
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

export function navigate(route) {
  if (route === 'auth') {
    updateLayoutForRoute(route);
    const appContent = document.getElementById('app-content');
    appContent.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'auto' });
    appContent.appendChild(renderAuthScreen({ configError: state.authError }));
    return;
  }

  if (!state.authReady) {
    renderAuthLoading();
    return;
  }

  if (!state.currentUser) {
    navigate('auth');
    return;
  }

  if (!routes[route]) return;
  
  state.currentRoute = route;
  
  // Update nav UI (mobile)
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('text-indigo-400', 'drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]');
    el.classList.add('text-white/40', 'hover:text-white');
    const iconSpan = el.querySelector('.material-symbols-outlined');
    if(iconSpan) iconSpan.style.fontVariationSettings = "'FILL' 0";
  });
  const activeNav = document.getElementById(`nav-${route}`);
  if (activeNav) {
    activeNav.classList.remove('text-white/40', 'hover:text-white');
    activeNav.classList.add('text-indigo-400', 'drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]');
    const activeIconSpan = activeNav.querySelector('.material-symbols-outlined');
    if(activeIconSpan) activeIconSpan.style.fontVariationSettings = "'FILL' 1";
  }

  // Update desktop UI
  document.querySelectorAll('.desktop-nav-item').forEach(el => {
    el.classList.remove('text-indigo-400', 'border-b-2', 'border-indigo-500');
    el.classList.add('text-white/60', 'hover:bg-white/5');
  });
  const activeDesktopNav = document.getElementById(`desktop-nav-${route}`);
  if (activeDesktopNav) {
    activeDesktopNav.classList.remove('text-white/60', 'hover:bg-white/5');
    activeDesktopNav.classList.add('text-indigo-400', 'border-b-2', 'border-indigo-500');
  }

  // Hide nav bar if route dictates
  updateLayoutForRoute(route);
  
  // Update content
  const appContent = document.getElementById('app-content');
  appContent.innerHTML = '';
  window.scrollTo({ top: 0, behavior: 'auto' });
  
  // Render new content
  const screenContent = routes[route].render();
  appContent.appendChild(screenContent);
}

// Start app
document.addEventListener('DOMContentLoaded', initApp);
