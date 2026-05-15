import { navigate, resetDraftClaim, setCurrentClaim, setCurrentClaimStatus, state } from '../main.js';

export function renderDecision() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-md mx-auto md:max-w-4xl flex flex-col pb-8';
  const claim = state.currentClaim;
  const status = claim?.status || 'review';
  const decision = claim?.ai_decision || 'NEEDS_REVIEW';
  const confidence = Math.round((claim?.confidence_score || 0) * 100);
  const refundValue = Number(claim?.refund_value || 0);
  const damageType = claim?.damage_type || 'Unknown';
  const aiExplanation = claim?.ai_explanation || 'Backend analysis result is not available.';
  const decisionLabel = decision.replaceAll('_', ' ');
  const claimTypeLabel = claim?.claim_type ? claim.claim_type.replaceAll('_', ' ') : 'Unknown';
  const submittedDescription = claim?.text_description || state.draftClaim?.textDescription || 'No written description was provided.';
  const evidenceSummary = claim?.file_ids?.[0] || state.draftClaim?.evidencePreviewName || 'Single evidence file attached';
  const updatedAtLabel = claim?.updated_at ? new Date(claim.updated_at).toLocaleString('id-ID') : 'Live backend response';
  const decisionTone = decision === 'AUTO_APPROVE'
    ? 'text-[#00C853] border-[#00C853]/40 bg-[#00C853]/10'
    : decision === 'REJECT'
      ? 'text-error border-error/40 bg-error/10'
      : 'text-amber-600 border-amber-400/40 bg-amber-100/60';
  const decisionIcon = decision === 'AUTO_APPROVE' ? 'verified' : decision === 'REJECT' ? 'block' : 'shield';
  const coverageLabel = status === 'approved' ? 'Full' : status === 'review' ? 'Manual Review' : 'Unavailable';
  const coverageTone = status === 'approved' ? 'text-[#00C853]' : status === 'review' ? 'text-amber-600' : 'text-error';
  const ctaLabel = status === 'approved' ? 'Back To Dashboard' : status === 'review' ? 'Return To Dashboard' : 'Create Another Claim';
  
  container.innerHTML = `
    <!-- Progress Indicator -->
    <div class="flex flex-col gap-base w-full max-w-md mx-auto md:max-w-full">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
    <span class="font-label-caps text-label-caps text-on-surface-variant tracking-wider">Step 3 of 3</span>
    <span class="font-label-caps text-label-caps text-primary tracking-wider">Final Decision</span>
    </div>
    <div class="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden relative">
    <div class="h-full w-full bg-primary relative" data-alt="A vivid horizontal light streak filling a progress bar, representing continuous technological processing against a dark glassmorphic interface, conveying speed and precision in a high-tech environment.">
    <div class="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
    </div>
    </div>
    <!-- Central Confidence Score Ring & Decision Badge -->
    <div class="relative flex flex-col items-center justify-center p-6 sm:p-xl bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm mx-auto w-full max-w-lg mt-8">
    <!-- Luminous Glow Level 2 -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div class="w-[250px] h-[250px] bg-[#00C853]/5 blur-[50px] rounded-full"></div>
    </div>
    <!-- Segmented Ring System -->
    <div class="relative h-48 w-48 sm:h-56 sm:w-56 flex items-center justify-center mb-md">
    <!-- Background track -->
    <svg class="absolute inset-0 w-full h-full -rotate-90" viewbox="0 0 100 100">
    <circle class="text-outline-variant" cx="50" cy="50" fill="none" r="46" stroke="currentColor" stroke-dasharray="2 4" stroke-width="1.5"></circle>
    </svg>
    <!-- Glowing foreground track (94% fill) -->
    <svg class="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(0,200,83,0.3)]" viewbox="0 0 100 100">
    <circle class="text-[#00C853] transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="46" stroke="currentColor" stroke-dasharray="0 289" stroke-linecap="round" stroke-width="3" id="confidence-ring"></circle>
    </svg>
    <div class="flex flex-col items-center justify-center z-10 text-center">
    <span class="font-display-lg text-display-lg text-on-surface tracking-tight">${confidence}<span class="text-headline-md text-on-surface-variant">%</span></span>
    <span class="font-label-caps text-label-caps text-outline tracking-widest mt-base">Confidence</span>
    </div>
    </div>
    <!-- Decision Badge -->
    <div class="flex flex-wrap items-center justify-center gap-sm px-6 py-3 rounded-full border shadow-[0_0_24px_rgba(0,200,83,0.1)] z-10 opacity-0 transition-opacity duration-1000 ${decisionTone}" id="decision-badge">
    <span class="material-symbols-outlined text-lg" style="font-variation-settings: 'FILL' 1;">${decisionIcon}</span>
    <span class="font-title-sm text-title-sm !text-[20px] tracking-widest font-bold uppercase">${decisionLabel}</span>
    </div>
    </div>
    <!-- AI Explanation Card -->
    <div class="flex items-start gap-md p-lg bg-surface-container-low border border-outline-variant/40 rounded-xl relative overflow-hidden mx-auto w-full max-w-lg mt-8">
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
    <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
    <span class="material-symbols-outlined text-primary text-sm">memory</span>
    </div>
    <div class="flex flex-col gap-xs">
    <h3 class="font-label-caps text-label-caps text-primary tracking-widest uppercase">Neural Analysis</h3>
    <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">${aiExplanation}</p>
    </div>
    </div>
    <div class="mx-auto mt-6 grid w-full max-w-lg grid-cols-1 gap-md rounded-2xl border border-outline-variant/40 bg-surface-container-low p-lg shadow-sm">
      <div class="flex items-center gap-sm text-outline">
        <span class="material-symbols-outlined text-sm">description</span>
        <span class="font-label-caps text-label-caps tracking-wider uppercase">Submitted Context</span>
      </div>
      <div class="grid grid-cols-1 gap-md sm:grid-cols-2">
        <div class="rounded-xl bg-surface p-4">
          <p class="text-label-caps text-outline uppercase">Claim Type</p>
          <p class="mt-2 text-body-md text-on-surface">${claimTypeLabel}</p>
        </div>
        <div class="rounded-xl bg-surface p-4">
          <p class="text-label-caps text-outline uppercase">Evidence</p>
          <p class="mt-2 break-words text-body-md text-on-surface">${evidenceSummary}</p>
        </div>
      </div>
      <div class="rounded-xl bg-surface p-4">
        <p class="text-label-caps text-outline uppercase">Problem Description</p>
        <p class="mt-2 text-body-md leading-relaxed text-on-surface-variant">${submittedDescription}</p>
      </div>
      <div class="grid grid-cols-1 gap-md sm:grid-cols-3">
        <div class="rounded-xl bg-surface p-4">
          <p class="text-label-caps text-outline uppercase">Backend Status</p>
          <p class="mt-2 text-body-md text-on-surface">${status}</p>
        </div>
        <div class="rounded-xl bg-surface p-4">
          <p class="text-label-caps text-outline uppercase">AI Decision</p>
          <p class="mt-2 text-body-md text-on-surface">${decisionLabel}</p>
        </div>
        <div class="rounded-xl bg-surface p-4">
          <p class="text-label-caps text-outline uppercase">Updated At</p>
          <p class="mt-2 text-body-md text-on-surface">${updatedAtLabel}</p>
        </div>
      </div>
    </div>
    <!-- Summary Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-md mx-auto w-full max-w-lg md:max-w-full mt-sm">
    <!-- Damage Type -->
    <div class="flex flex-col p-lg bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-sm">
    <div class="flex items-center gap-sm mb-sm text-outline">
    <span class="material-symbols-outlined text-sm">broken_image</span>
    <span class="font-label-caps text-label-caps tracking-wider uppercase">Damage Type</span>
    </div>
    <span class="font-headline-md text-headline-md text-on-surface">${damageType}</span>
    </div>
    <!-- Coverage -->
    <div class="flex flex-col p-lg bg-surface-container-low border border-outline-variant/30 rounded-xl shadow-sm">
    <div class="flex items-center gap-sm mb-sm text-outline">
    <span class="material-symbols-outlined text-sm">shield</span>
    <span class="font-label-caps text-label-caps tracking-wider uppercase">Coverage</span>
    </div>
    <span class="font-headline-md text-headline-md ${coverageTone}">${coverageLabel}</span>
    </div>
    <!-- Refund Value -->
    <div class="flex flex-col p-lg bg-surface-container-high border border-primary/20 rounded-xl relative overflow-hidden shadow-sm">
    <div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 blur-2xl rounded-full pointer-events-none"></div>
    <div class="flex items-center gap-sm mb-sm text-primary/80 z-10">
    <span class="material-symbols-outlined text-sm">payments</span>
    <span class="font-label-caps text-label-caps tracking-wider uppercase">Refund Value</span>
    </div>
    <span class="font-display-lg text-display-lg !text-[36px] text-primary z-10 tracking-tight">Rp${refundValue.toLocaleString('id-ID')}</span>
    </div>
    </div>
    <!-- CTA Button -->
    <div class="mt-8 pt-lg pb-md flex w-full max-w-lg mx-auto">
    <button id="finish-btn" class="w-full relative group flex justify-center items-center py-4 px-8 rounded-full overflow-hidden transition-all duration-300 shadow-md">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-primary to-[#00C853] transition-transform duration-500 group-hover:scale-105"></div>
    <!-- Hover bloom -->
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 transition-opacity duration-300"></div>
    <!-- Content -->
    <span class="relative z-10 font-label-caps text-label-caps text-white tracking-widest font-bold flex items-center gap-sm uppercase">
                        ${ctaLabel}
                        <span class="material-symbols-outlined text-sm">arrow_forward</span>
    </span>
    </button>
    </div>
  `;

  // Animation mock
  setTimeout(() => {
    const ring = container.querySelector('#confidence-ring');
    if(ring) ring.style.strokeDasharray = `${Math.round((289 * Math.max(0, Math.min(confidence, 100))) / 100)} 289`;
  }, 100);

  setTimeout(() => {
    const badge = container.querySelector('#decision-badge');
    if(badge) badge.classList.remove('opacity-0');
  }, 800);

  const btn = container.querySelector('#finish-btn');
  if(btn) {
    btn.addEventListener('click', () => {
      setCurrentClaim(null);
      setCurrentClaimStatus(null);
      resetDraftClaim();
      navigate('hub');
    });
  }

  return container;
}
