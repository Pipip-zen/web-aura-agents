import './style.css';
import { renderHub } from './screens/hub.js';
import { renderEvidence } from './screens/evidence.js';
import { renderAiAnalysis } from './screens/ai_analysis.js';
import { renderDecision } from './screens/decision.js';
import { renderNotifications } from './screens/notifications.js';

// App State
const state = {
  currentRoute: 'hub'
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
  navigate(state.currentRoute);
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

export function navigate(route) {
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
  const navContainer = document.getElementById('bottom-nav');
  if (routes[route].showNav) {
    navContainer.style.display = 'flex';
  } else {
    navContainer.style.display = 'none';
  }
  
  // Update content
  const appContent = document.getElementById('app-content');
  appContent.innerHTML = ''; // Clear current content
  
  // Render new content
  const screenContent = routes[route].render();
  appContent.appendChild(screenContent);
}

// Start app
document.addEventListener('DOMContentLoaded', initApp);
