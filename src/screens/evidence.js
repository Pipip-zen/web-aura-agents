import { navigate } from '../main.js';

export function renderEvidence() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-md mx-auto flex flex-col gap-8 pb-4';
  
  container.innerHTML = `
    <!-- Progress Tracker -->
    <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <h1 class="font-headline-md text-headline-md text-on-surface">Step 1 of 3</h1>
    <span class="font-label-caps text-label-caps text-secondary uppercase">Evidence Collection</span>
    </div>
    <div class="w-full h-1 bg-surface-variant rounded-full overflow-hidden relative">
    <div class="h-full bg-secondary w-1/3 absolute left-0 top-0 rounded-full shadow-[0_0_10px_rgba(0,110,42,0.3)]"></div>
    </div>
    </div>
    <!-- Claim Type Selector -->
    <div class="flex flex-col gap-4">
    <h2 class="font-title-sm text-title-sm text-on-surface-variant">Select Claim Type</h2>
    <div class="grid grid-cols-1 gap-3" id="claim-type-grid">
    <button class="claim-btn w-full bg-secondary/5 border border-secondary rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group shadow-sm" data-selected="true">
    <div class="flex min-w-0 items-center gap-3 relative z-10">
    <div class="icon-bg w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
    <span class="material-symbols-outlined" data-icon="inventory_2" data-weight="fill" style="font-variation-settings: 'FILL' 1;">inventory_2</span>
    </div>
    <span class="label-text font-body-md text-body-md text-on-surface font-medium">Product Defect</span>
    </div>
    <div class="radio-outer w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center relative z-10 bg-secondary/10">
    <div class="radio-inner w-2.5 h-2.5 rounded-full bg-secondary"></div>
    </div>
    </button>
    <button class="claim-btn w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group hover:border-outline hover:shadow-sm transition-all" data-selected="false">
    <div class="flex min-w-0 items-center gap-3 relative z-10">
    <div class="icon-bg w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/30">
    <span class="material-symbols-outlined" data-icon="local_shipping">local_shipping</span>
    </div>
    <span class="label-text font-body-md text-body-md text-on-surface-variant">Shipping Damage</span>
    </div>
    <div class="radio-outer w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center relative z-10">
        <div class="radio-inner hidden w-2.5 h-2.5 rounded-full bg-secondary"></div>
    </div>
    </button>
    <button class="claim-btn w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group hover:border-outline hover:shadow-sm transition-all" data-selected="false">
    <div class="flex min-w-0 items-center gap-3 relative z-10">
    <div class="icon-bg w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/30">
    <span class="material-symbols-outlined" data-icon="search_off">search_off</span>
    </div>
    <span class="label-text font-body-md text-body-md text-on-surface-variant">Missing Item</span>
    </div>
    <div class="radio-outer w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center relative z-10">
        <div class="radio-inner hidden w-2.5 h-2.5 rounded-full bg-secondary"></div>
    </div>
    </button>
    </div>
    </div>
    <!-- File Upload Zone -->
    <div class="flex flex-col gap-4">
    <h2 class="font-title-sm text-title-sm text-on-surface-variant">Upload Evidence</h2>
    <div class="w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-sm cursor-pointer hover:bg-primary/10 transition-colors">
    <div class="w-16 h-16 rounded-full bg-surface/80 backdrop-blur-md border border-primary/20 flex items-center justify-center mb-4 relative z-10 shadow-md">
    <span class="material-symbols-outlined text-primary text-3xl" data-icon="cloud_upload">cloud_upload</span>
    <div class="absolute inset-0 rounded-full border border-primary/30 animate-pulse"></div>
    </div>
    <h3 class="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">Drop Photo or Video</h3>
    <p class="font-body-sm text-body-sm text-on-surface-variant relative z-10 max-w-[200px] mb-4">Max 500MB, 2 minute duration limit.</p>
    <button class="bg-surface border border-outline-variant rounded-full px-6 py-2 font-label-caps text-label-caps text-primary uppercase tracking-wider relative z-10 hover:bg-surface-variant transition-colors shadow-sm">
                            Browse Files
                        </button>
    </div>
    </div>
    <!-- Voice Description -->
    <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
    <h2 class="font-title-sm text-title-sm text-on-surface-variant">Voice Context (Optional)</h2>
    <span class="material-symbols-outlined text-on-surface-variant text-sm" data-icon="info">info</span>
    </div>
    <div class="bg-surface-container border border-outline-variant/50 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden shadow-sm">
    <button class="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm flex-shrink-0 hover:bg-primary/20 transition-colors">
    <span class="material-symbols-outlined" data-icon="mic" data-weight="fill" style="font-variation-settings: 'FILL' 1;">mic</span>
    </button>
    <div class="flex-1 h-8 flex items-center gap-1 opacity-60 overflow-hidden">
    <!-- Waveform Placeholder Bars -->
    <div class="w-1 h-3 bg-primary rounded-full"></div>
    <div class="w-1 h-6 bg-primary rounded-full"></div>
    <div class="w-1 h-4 bg-primary rounded-full"></div>
    <div class="w-1 h-8 bg-primary rounded-full"></div>
    <div class="w-1 h-5 bg-primary rounded-full"></div>
    <div class="w-1 h-2 bg-primary rounded-full"></div>
    <div class="w-1 h-4 bg-primary rounded-full"></div>
    <div class="w-1 h-7 bg-primary rounded-full"></div>
    <div class="w-1 h-3 bg-primary rounded-full"></div>
    <div class="w-1 h-5 bg-primary rounded-full"></div>
    <div class="w-1 h-2 bg-primary rounded-full"></div>
    <div class="w-1 h-4 bg-primary rounded-full"></div>
    <div class="w-1 h-6 bg-primary rounded-full"></div>
    <div class="w-1 h-3 bg-primary rounded-full"></div>
    <div class="w-1 h-5 bg-primary rounded-full"></div>
    <div class="w-1 h-2 bg-primary rounded-full"></div>
    <div class="w-1 h-4 bg-primary rounded-full"></div>
    </div>
    <span class="font-label-caps text-label-caps text-on-surface-variant flex-shrink-0">00:00</span>
    </div>
    </div>

    <!-- Bottom Action Area -->
    <div class="sticky bottom-4 z-20 mt-2 pb-1">
    <div class="rounded-[1.5rem] border border-white/50 bg-white/70 p-3 shadow-[0_18px_48px_rgba(70,72,212,0.18)] backdrop-blur-xl">
    <button id="evidence-analyze-btn" class="pointer-events-auto w-full bg-primary text-on-primary rounded-xl py-4 px-6 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all group">
    <span class="material-symbols-outlined text-on-primary" data-icon="psychiatry">psychiatry</span>
    <span class="font-title-sm text-title-sm text-on-primary font-semibold">Analyze with AURA AI</span>
    </button>
    </div>
    </div>
  `;

  // Setup click handler for claim type
  const btns = container.querySelectorAll('.claim-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // reset all
      btns.forEach(b => {
        b.className = 'claim-btn w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group hover:border-outline hover:shadow-sm transition-all';
        const iconBg = b.querySelector('.icon-bg');
        iconBg.className = 'icon-bg w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant border border-outline-variant/30';
        iconBg.querySelector('span').style.fontVariationSettings = "'FILL' 0";
        b.querySelector('.label-text').className = 'label-text font-body-md text-body-md text-on-surface-variant';
        const rOut = b.querySelector('.radio-outer');
        rOut.className = 'radio-outer w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center relative z-10';
        rOut.querySelector('.radio-inner').classList.add('hidden');
      });

      // active
      btn.className = 'claim-btn w-full bg-secondary/5 border border-secondary rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group shadow-sm';
      const iconBg = btn.querySelector('.icon-bg');
      iconBg.className = 'icon-bg w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20';
      iconBg.querySelector('span').style.fontVariationSettings = "'FILL' 1";
      btn.querySelector('.label-text').className = 'label-text font-body-md text-body-md text-on-surface font-medium';
      const rOut = btn.querySelector('.radio-outer');
      rOut.className = 'radio-outer w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center relative z-10 bg-secondary/10';
      rOut.querySelector('.radio-inner').classList.remove('hidden');
    });
  });

  const analyzeBtn = container.querySelector('#evidence-analyze-btn');
  if(analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      navigate('analysis');
    });
  }

  return container;
}
