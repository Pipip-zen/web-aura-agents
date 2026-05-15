import { navigate } from '../main.js';

export function renderAiAnalysis() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-md mx-auto flex flex-col pb-6';
  
  container.innerHTML = `
    <!-- Progress Header -->
    <div class="flex flex-col gap-sm mt-sm">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-1">
    <h2 class="font-headline-md text-headline-md text-on-background m-0">AI Analysis</h2>
    <span class="font-label-caps text-label-caps text-primary uppercase tracking-widest">Step 2 of 3</span>
    </div>
    <!-- Progress Tracker -->
    <div class="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden relative">
    <div id="progress-bar" class="h-full bg-gradient-to-r from-primary-fixed-dim to-primary rounded-full w-[40%] relative overflow-hidden transition-all duration-1000">
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-full -translate-x-1/2"></div>
    </div>
    </div>
    </div>
    <!-- Central Glowing Graphic (Level 1 Depth) -->
    <div class="bg-surface-container-low rounded-xl p-lg flex flex-col items-center justify-center relative min-h-[220px] border border-outline-variant/30 mt-8">
    <!-- Dual Track Rings -->
    <div class="absolute w-[140px] h-[140px] rounded-full border-[3px] border-primary/10"></div>
    <div class="absolute w-[140px] h-[140px] rounded-full border-[3px] border-transparent border-t-primary border-r-primary/50 rotate-[45deg] blur-[1px] animate-[spin_3s_linear_infinite]"></div>
    <!-- Luminous Center -->
    <div class="relative z-10 flex items-center justify-center">
    <div class="absolute inset-0 bg-primary/10 rounded-full blur-[24px] scale-150 animate-pulse"></div>
    <span class="material-symbols-outlined text-[64px] text-primary relative z-20">neurology</span>
    </div>
    </div>
    <!-- Vertical Checklist (Level 2 Depth) -->
    <div class="bg-surface-container rounded-xl p-md flex flex-col gap-md border border-outline-variant/30 mt-8">
    <!-- Complete Step -->
    <div class="flex items-start gap-md sm:items-center">
    <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">check_circle</span>
    <div class="flex-1 flex justify-between items-center border-b border-outline-variant/20 pb-2">
    <span class="font-body-md text-body-md text-on-surface">Uploading Evidence</span>
    <span class="font-label-caps text-label-caps text-secondary">Complete</span>
    </div>
    </div>
    <!-- Active Step -->
    <div class="flex items-start gap-md relative sm:items-center" id="step-2">
    <!-- Outer Bloom -->
    <div class="absolute -left-2 -right-2 top-1 bottom-1 bg-primary/5 rounded-lg blur-md"></div>
    <span class="material-symbols-outlined text-primary relative z-10 animate-spin">sync</span>
    <div class="flex-1 flex justify-between items-center relative z-10 border-b border-outline-variant/20 pb-2">
    <span class="font-body-md text-body-md text-primary font-medium">Analyzing Evidence</span>
    <span class="font-label-caps text-label-caps text-primary">Processing...</span>
    </div>
    </div>
    <!-- Pending Step 1 -->
    <div class="flex items-start gap-md opacity-60 transition-opacity sm:items-center" id="step-3">
    <span class="material-symbols-outlined text-on-surface-variant">radio_button_unchecked</span>
    <div class="flex-1 flex justify-between items-center border-b border-outline-variant/20 pb-2">
    <span class="font-body-md text-body-md text-on-surface-variant">Detecting Damage Patterns</span>
    <span class="font-label-caps text-label-caps text-on-surface-variant">Pending</span>
    </div>
    </div>
    <!-- Pending Step 2 -->
    <div class="flex items-start gap-md opacity-60 transition-opacity sm:items-center" id="step-4">
    <span class="material-symbols-outlined text-on-surface-variant">radio_button_unchecked</span>
    <div class="flex-1 flex justify-between items-center border-b border-outline-variant/20 pb-2">
    <span class="font-body-md text-body-md text-on-surface-variant">Calculating Confidence Score</span>
    <span class="font-label-caps text-label-caps text-on-surface-variant">Pending</span>
    </div>
    </div>
    <!-- Pending Step 3 -->
    <div class="flex items-start gap-md opacity-60 transition-opacity sm:items-center" id="step-5">
    <span class="material-symbols-outlined text-on-surface-variant">radio_button_unchecked</span>
    <div class="flex-1 flex justify-between items-center">
    <span class="font-body-md text-body-md text-on-surface-variant">Generating Report</span>
    <span class="font-label-caps text-label-caps text-on-surface-variant">Pending</span>
    </div>
    </div>
    </div>
    <!-- Live Status Terminal -->
    <div class="bg-surface-container-high border border-outline-variant/30 rounded-lg p-md font-mono text-xs text-on-surface-variant flex flex-col gap-2 overflow-hidden relative shadow-sm mt-8">
    <div class="flex gap-2">
    <span class="text-outline">&gt;</span>
    <span class="text-on-surface-variant">Scanning image pixels for structural anomalies... [OK]</span>
    </div>
    <div class="flex gap-2" id="term-2" style="display:none;">
    <span class="text-outline">&gt;</span>
    <span class="text-on-surface-variant">Consulting Firestore realtime listener... [OK]</span>
    </div>
    <div class="flex gap-2 text-primary">
    <span class="text-primary">&gt;</span>
    <span class="font-medium tracking-wide">Executing predictive model layers...</span>
    <span class="w-1.5 h-3.5 bg-primary inline-block align-middle ml-1 mt-0.5 animate-pulse"></span>
    </div>
    </div>
  `;

  // Mock auto progress
  setTimeout(() => {
    container.querySelector('#progress-bar').style.width = '60%';
    container.querySelector('#step-3').classList.remove('opacity-60');
    container.querySelector('#step-3 span').innerText = 'sync';
    container.querySelector('#step-3 span').classList.add('text-primary', 'animate-spin');
    container.querySelector('#step-3 span').classList.remove('text-on-surface-variant');
    container.querySelector('#step-3 .text-on-surface-variant').classList.replace('text-on-surface-variant', 'text-primary');
    container.querySelector('#step-3 .text-on-surface-variant').classList.replace('text-on-surface-variant', 'text-primary'); // for the pending text
    container.querySelectorAll('#step-3 span')[2].innerText = 'Processing...';
    
    container.querySelector('#term-2').style.display = 'flex';
  }, 1500);

  setTimeout(() => {
    container.querySelector('#progress-bar').style.width = '100%';
    navigate('decision');
  }, 3500);

  return container;
}
