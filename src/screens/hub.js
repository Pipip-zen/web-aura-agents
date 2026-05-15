import { navigate, state } from '../main.js';
import { fetchClaims } from '../services/api_service.js';

export function renderHub() {
  const container = document.createElement('div');
  container.className = 'w-full pb-4 sm:pb-6';
  
  container.innerHTML = `
    <!-- Greeting Header -->
    <section class="flex flex-col gap-base">
    <p class="text-primary font-label-caps uppercase tracking-wider">Dashboard Overview</p>
    <h2 class="font-display-lg text-[clamp(2rem,8vw,3rem)] leading-tight text-on-background">Good morning, Alex</h2>
    </section>
    <!-- Bento Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-gutter mt-lg">
    <!-- Total Claims Value Card -->
    <div class="md:col-span-8 glass-card rounded-xl p-md flex flex-col justify-between min-h-[220px] shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
    <div class="flex flex-col items-start justify-between gap-4 sm:flex-row">
    <div>
    <p class="font-title-sm text-on-surface-variant mb-xs">Total Claims Value</p>
    <h3 class="text-[clamp(2.25rem,10vw,3rem)] font-bold tracking-tight text-on-surface">$1,727</h3>
    </div>
    <div class="flex items-center gap-xs px-sm py-xs bg-secondary-container rounded-full">
    <span class="material-symbols-outlined text-on-secondary-container text-[18px]">trending_up</span>
    <span class="text-on-secondary-container font-label-caps">+12.5%</span>
    </div>
    </div>
    <!-- AI Sparkline Visual -->
    <div class="mt-lg h-20 w-full relative overflow-hidden rounded-lg bg-surface-container-low/50">
    <svg class="w-full h-full" preserveaspectratio="none" viewbox="0 0 400 100">
    <path d="M0 80 Q 50 20, 100 60 T 200 40 T 300 70 T 400 30" fill="none" stroke="#4648d4" stroke-linecap="round" stroke-width="3"></path>
    <path d="M0 80 Q 50 20, 100 60 T 200 40 T 300 70 T 400 30 V 100 H 0 Z" fill="url(#gradient-indigo)" opacity="0.1"></path>
    <defs>
    <lineargradient id="gradient-indigo" x1="0%" x2="0%" y1="0%" y2="100%">
    <stop offset="0%" style="stop-color:#4648d4;stop-opacity:1"></stop>
    <stop offset="100%" style="stop-color:#4648d4;stop-opacity:0"></stop>
    </lineargradient>
    </defs>
    </svg>
    </div>
    </div>
    <!-- Create New Claim Action -->
    <button id="hub-create-claim-btn" class="md:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-md flex flex-col items-center justify-center gap-sm group hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 w-full mt-gutter md:mt-0">
    <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
    <span class="material-symbols-outlined text-[40px] text-white">add_circle</span>
    </div>
    <div class="text-center">
    <p class="font-title-sm text-white">Create New Claim</p>
    <p class="text-white/70 text-body-sm mt-base">AI-assisted filing process</p>
    </div>
    </button>
    <!-- Recent Claims List (Full width below) -->
    <div class="md:col-span-12 flex flex-col gap-md mt-sm">
    <div class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
    <h4 class="font-headline-md text-headline-md text-on-background">Recent Claims</h4>
    <button class="text-primary font-title-sm flex items-center gap-base hover:underline">
                            View All <span class="material-symbols-outlined text-[18px]">chevron_right</span>
    </button>
    </div>
    <div id="hub-claims-list" class="flex flex-col gap-sm">
    <!-- Claim Item 1 -->
    <div class="glass-card p-md rounded-xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group hover:border-primary/30 transition-colors">
    <div class="flex items-start gap-md">
    <div class="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
    <span class="material-symbols-outlined">smartphone</span>
    </div>
    <div>
    <h5 class="font-title-sm text-on-surface">iPhone 14 Screen</h5>
    <p class="text-body-sm text-on-surface-variant flex items-center gap-base">
    <span class="w-2 h-2 rounded-full bg-primary-container"></span>
                                        Processing by Aura AI
                                    </p>
    </div>
    </div>
    <div class="text-left sm:text-right">
    <p class="font-title-sm text-on-surface">$349.00</p>
    <p class="text-label-caps text-primary uppercase">Active</p>
    </div>
    </div>
    <!-- Claim Item 2 -->
    <div class="glass-card p-md rounded-xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group border-l-4 border-l-secondary">
    <div class="flex items-start gap-md">
    <div class="w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
    <span class="material-symbols-outlined">headphones</span>
    </div>
    <div>
    <h5 class="font-title-sm text-on-surface">AirPods Water Damage</h5>
    <p class="text-body-sm text-on-secondary-container flex items-center gap-base">
    <span class="material-symbols-outlined text-[16px]">check_circle</span>
                                        Approved • Payment sent
                                    </p>
    </div>
    </div>
    <div class="text-left sm:text-right">
    <p class="font-title-sm text-on-surface">$179.00</p>
    <p class="text-label-caps text-secondary uppercase tracking-tighter">Settled</p>
    </div>
    </div>
    <!-- Claim Item 3 -->
    <div class="glass-card p-md rounded-xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group border-l-4 border-l-error">
    <div class="flex items-start gap-md">
    <div class="w-12 h-12 rounded-lg bg-error-container/20 flex items-center justify-center text-error">
    <span class="material-symbols-outlined">laptop_mac</span>
    </div>
    <div>
    <h5 class="font-title-sm text-on-surface">Dell Laptop</h5>
    <p class="text-body-sm text-error flex items-center gap-base">
    <span class="material-symbols-outlined text-[16px]">info</span>
                                        Rejected • Policy exception
                                    </p>
    </div>
    </div>
    <div class="text-left sm:text-right">
    <p class="font-title-sm text-on-surface">$1,199.00</p>
    <p class="text-label-caps text-error uppercase">Closed</p>
    </div>
    </div>
    </div>
    </div>
    <!-- AI Insight Section -->
    <div class="md:col-span-12 bg-surface-container-high/40 rounded-2xl p-lg border border-primary/10 flex flex-col md:flex-row items-center gap-lg mt-sm">
    <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
    <span class="material-symbols-outlined text-white text-[32px]">auto_awesome</span>
    </div>
    <div class="flex-1 text-center md:text-left">
    <h4 class="font-title-sm text-primary mb-xs">Aura AI Tip</h4>
    <p class="text-body-md text-on-surface-variant max-w-2xl">
                            Based on your current device inventory, adding <span class="font-semibold text-on-surface">Loss Protection</span> would only increase your premium by $2.40/mo. Would you like to see the coverage?
                        </p>
    </div>
    <button class="w-full sm:w-auto px-lg py-sm bg-primary text-white rounded-full font-title-sm hover:bg-primary/90 transition-colors shrink-0">
                        Explore
                    </button>
    </div>
    </div>
  `;

  // Attach event
  const btn = container.querySelector('#hub-create-claim-btn');
  if(btn) {
    btn.addEventListener('click', () => {
      navigate('evidence');
    });
  }

  const claimsList = container.querySelector('#hub-claims-list');
  const currency = new Intl.NumberFormat('id-ID');
  const labelMap = {
    approved: 'Settled',
    rejected: 'Rejected',
    review: 'In Review',
    processing: 'Processing',
    pending: 'Pending'
  };

  fetchClaims(state.currentUserId)
    .then((claims) => {
      if (!claims.length) return;

      claimsList.innerHTML = claims
        .slice(0, 3)
        .map((claim) => {
          const amount = Number(claim.refund_value || claim.refund_amount || 0);
          const status = claim.status || 'pending';
          const iconTextClass = status === 'approved'
            ? 'text-secondary'
            : status === 'rejected'
              ? 'text-error'
              : 'text-primary';
          const iconBgClass = status === 'approved'
            ? 'bg-secondary-container/20'
            : status === 'rejected'
              ? 'bg-error-container/20'
              : 'bg-surface-container-highest';

          return `
            <div class="glass-card p-md rounded-xl flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between group border-l-4 ${status === 'approved' ? 'border-l-secondary' : status === 'rejected' ? 'border-l-error' : 'border-l-primary'}">
              <div class="flex items-start gap-md">
                <div class="w-12 h-12 rounded-lg ${iconBgClass} flex items-center justify-center ${iconTextClass}">
                  <span class="material-symbols-outlined">${status === 'approved' ? 'check_circle' : status === 'rejected' ? 'block' : 'hourglass_top'}</span>
                </div>
                <div>
                  <h5 class="font-title-sm text-on-surface">${claim.claim_type.replaceAll('_', ' ')}</h5>
                  <p class="text-body-sm text-on-surface-variant flex items-center gap-base">
                    <span class="w-2 h-2 rounded-full ${status === 'approved' ? 'bg-secondary' : status === 'rejected' ? 'bg-error' : 'bg-primary'}"></span>
                    ${claim.current_step || status}
                  </p>
                </div>
              </div>
              <div class="text-left sm:text-right">
                <p class="font-title-sm text-on-surface">Rp${currency.format(amount)}</p>
                <p class="text-label-caps uppercase ${status === 'approved' ? 'text-secondary' : status === 'rejected' ? 'text-error' : 'text-primary'}">${labelMap[status] || status}</p>
              </div>
            </div>
          `;
        })
        .join('');
    })
    .catch(() => {});

  return container;
}
