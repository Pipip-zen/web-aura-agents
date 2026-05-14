export function renderNotifications() {
  const container = document.createElement('div');
  container.className = 'w-full pb-10';
  
  container.innerHTML = `
    <!-- Page Title -->
    <section class="mb-lg">
    <h2 class="font-display-lg text-display-lg text-on-surface">Notifications</h2>
    <p class="font-body-md text-on-surface-variant mt-xs">Stay updated with your claim status and AI insights.</p>
    </section>
    <!-- Segmented Control (Tabs) -->
    <nav class="flex p-1 bg-surface-container rounded-full mb-lg max-w-md mx-auto md:mx-0">
    <button class="flex-1 py-2 px-4 rounded-full bg-primary-container text-on-primary-container font-title-sm text-center shadow-md">All</button>
    <button class="flex-1 py-2 px-4 rounded-full text-on-surface-variant font-title-sm text-center hover:bg-surface-container-high transition-colors">Approved</button>
    <button class="flex-1 py-2 px-4 rounded-full text-on-surface-variant font-title-sm text-center hover:bg-surface-container-high transition-colors">Processing</button>
    </nav>
    <!-- Notifications Feed -->
    <div class="grid gap-md">
    <!-- Notification Card: Approved -->
    <div class="glass-panel p-md rounded-xl flex items-start gap-md hover:shadow-lg transition-all cursor-pointer relative overflow-hidden bg-white/70 backdrop-blur-md border border-outline-variant">
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-secondary shadow-[0_0_10px_#006e2a]"></div>
    <div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
    <span class="material-symbols-outlined text-on-secondary-container" data-icon="check_circle" style="font-variation-settings: 'FILL' 1;">check_circle</span>
    </div>
    <div class="flex-1">
    <div class="flex justify-between items-center mb-base">
    <h3 class="font-title-sm text-on-surface">Claim Approved!</h3>
    <span class="font-label-caps text-on-surface-variant">2m ago</span>
    </div>
    <p class="font-body-sm text-on-surface-variant">Your claim #8821 for vehicle repair has been successfully verified and approved for payout.</p>
    </div>
    <div class="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
    </div>
    <!-- Notification Card: Analysis (Insight) -->
    <div class="glass-panel p-md rounded-xl flex items-start gap-md hover:shadow-lg transition-all cursor-pointer relative bg-white/70 backdrop-blur-md border border-outline-variant">
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
    <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
    <span class="material-symbols-outlined text-primary" data-icon="notifications">notifications</span>
    </div>
    <div class="flex-1">
    <div class="flex justify-between items-center mb-base">
    <h3 class="font-title-sm text-on-surface">AI Analysis Complete</h3>
    <span class="font-label-caps text-on-surface-variant">1h ago</span>
    </div>
    <p class="font-body-sm text-on-surface-variant">AURA has finished scanning your uploaded documents for the property damage claim.</p>
    </div>
    </div>
    <!-- Notification Card: Processing -->
    <div class="glass-panel p-md rounded-xl flex items-start gap-md hover:shadow-lg transition-all cursor-pointer relative opacity-80 bg-white/70 backdrop-blur-md border border-outline-variant">
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container"></div>
    <div class="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center shrink-0">
    <span class="material-symbols-outlined text-tertiary" data-icon="schedule">schedule</span>
    </div>
    <div class="flex-1">
    <div class="flex justify-between items-center mb-base">
    <h3 class="font-title-sm text-on-surface">Claim Processing</h3>
    <span class="font-label-caps text-on-surface-variant">5h ago</span>
    </div>
    <p class="font-body-sm text-on-surface-variant">Your medical reimbursement request is currently being reviewed by our neural engine.</p>
    </div>
    </div>
    <!-- AI Insight Feature Card -->
    <div class="p-md rounded-xl bg-gradient-to-br from-primary-container to-indigo-700 text-white shadow-xl flex items-center justify-between mt-md">
    <div class="flex-1">
    <div class="flex items-center gap-2 mb-xs">
    <span class="material-symbols-outlined text-white" data-icon="auto_awesome">auto_awesome</span>
    <span class="font-label-caps uppercase tracking-widest opacity-90">Intelligence Layer</span>
    </div>
    <h4 class="font-title-sm mb-base">Real-time claim updates</h4>
    <p class="font-body-sm opacity-80">AURA AI is monitoring 3 claims in the background to ensure lightning-fast processing.</p>
    </div>
    <div class="w-16 h-16 relative shrink-0">
    <svg class="w-full h-full transform -rotate-90">
    <circle class="text-white/20" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-width="4"></circle>
    <circle class="text-secondary-fixed" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-dasharray="176" stroke-dashoffset="44" stroke-width="4"></circle>
    </svg>
    <span class="absolute inset-0 flex items-center justify-center font-label-caps">75%</span>
    </div>
    </div>
    </div>
  `;

  return container;
}
