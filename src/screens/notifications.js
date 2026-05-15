const notifications = [
  {
    id: 'approved-1',
    type: 'approved',
    title: 'Claim Approved!',
    time: '2m ago',
    body: 'Your claim #8821 for vehicle repair has been successfully verified and approved for payout.',
    accent: 'bg-secondary shadow-[0_0_10px_#006e2a]',
    iconWrap: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
    icon: 'check_circle',
    unread: true
  },
  {
    id: 'analysis-1',
    type: 'processing',
    title: 'AI Analysis Complete',
    time: '1h ago',
    body: 'AURA has finished scanning your uploaded documents for the property damage claim.',
    accent: 'bg-primary',
    iconWrap: 'bg-primary-fixed',
    iconColor: 'text-primary',
    icon: 'notifications',
    unread: false
  },
  {
    id: 'processing-1',
    type: 'processing',
    title: 'Claim Processing',
    time: '5h ago',
    body: 'Your medical reimbursement request is currently being reviewed by our neural engine.',
    accent: 'bg-tertiary-container',
    iconWrap: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
    icon: 'schedule',
    unread: false
  }
];

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'approved', label: 'Approved' },
  { key: 'processing', label: 'Processing' }
];

function renderNotificationCard(item) {
  return `
    <div class="glass-panel p-md rounded-xl flex items-start gap-md hover:shadow-lg transition-all cursor-pointer relative overflow-hidden ${item.unread ? 'bg-white/70' : 'bg-white/65 opacity-90'} backdrop-blur-md border border-outline-variant">
      <div class="absolute left-0 top-0 bottom-0 w-1 ${item.accent}"></div>
      <div class="w-12 h-12 rounded-full ${item.iconWrap} flex items-center justify-center shrink-0">
        <span class="material-symbols-outlined ${item.iconColor}" data-icon="${item.icon}" ${item.icon === 'check_circle' ? `style="font-variation-settings: 'FILL' 1;"` : ''}>${item.icon}</span>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-base">
          <h3 class="font-title-sm text-on-surface">${item.title}</h3>
          <span class="font-label-caps text-on-surface-variant">${item.time}</span>
        </div>
        <p class="font-body-sm text-on-surface-variant">${item.body}</p>
      </div>
      ${item.unread ? '<div class="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>' : ''}
    </div>
  `;
}

function renderTabButton(tab, activeTab) {
  const isActive = tab.key === activeTab;
  return `
    <button
      type="button"
      data-tab="${tab.key}"
      class="notification-tab flex-1 py-2 px-4 rounded-full font-title-sm text-center transition-colors ${isActive ? 'bg-primary-container text-on-primary-container shadow-md' : 'text-on-surface-variant hover:bg-surface-container-high'}"
    >
      ${tab.label}
    </button>
  `;
}

export function renderNotifications() {
  const container = document.createElement('div');
  container.className = 'w-full pb-6';

  let activeTab = 'all';

  container.innerHTML = `
    <section class="mb-lg">
      <h2 class="font-display-lg text-display-lg text-on-surface">Notifications</h2>
      <p class="font-body-md text-on-surface-variant mt-xs">Stay updated with your claim status and AI insights.</p>
    </section>
    <nav id="notification-tabs" class="flex flex-wrap gap-2 p-1 bg-surface-container rounded-[1.25rem] mb-lg max-w-md mx-auto md:mx-0"></nav>
    <div id="notifications-feed" class="grid gap-md"></div>
    <div class="p-md rounded-xl bg-gradient-to-br from-primary-container to-indigo-700 text-white shadow-xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-md">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-xs">
          <span class="material-symbols-outlined text-white" data-icon="auto_awesome">auto_awesome</span>
          <span class="font-label-caps uppercase tracking-widest opacity-90">Intelligence Layer</span>
        </div>
        <h4 class="font-title-sm mb-base">Real-time claim updates</h4>
        <p class="font-body-sm opacity-80">AURA AI is monitoring active claims in the background to ensure lightning-fast processing.</p>
      </div>
      <div class="w-16 h-16 relative shrink-0">
        <svg class="w-full h-full transform -rotate-90">
          <circle class="text-white/20" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-width="4"></circle>
          <circle class="text-secondary-fixed" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-dasharray="176" stroke-dashoffset="44" stroke-width="4"></circle>
        </svg>
        <span class="absolute inset-0 flex items-center justify-center font-label-caps">75%</span>
      </div>
    </div>
  `;

  const tabsContainer = container.querySelector('#notification-tabs');
  const feed = container.querySelector('#notifications-feed');

  const render = () => {
    tabsContainer.innerHTML = tabs.map((tab) => renderTabButton(tab, activeTab)).join('');

    const filtered = activeTab === 'all'
      ? notifications
      : notifications.filter((item) => item.type === activeTab);

    feed.innerHTML = filtered.length
      ? filtered.map(renderNotificationCard).join('')
      : `
        <div class="glass-panel rounded-xl border border-outline-variant bg-white/70 p-md text-body-md text-on-surface-variant">
          No ${activeTab} notifications yet.
        </div>
      `;

    tabsContainer.querySelectorAll('.notification-tab').forEach((button) => {
      button.addEventListener('click', () => {
        activeTab = button.dataset.tab;
        render();
      });
    });
  };

  render();
  return container;
}
