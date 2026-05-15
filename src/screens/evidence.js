import { navigate, setCurrentClaim, setCurrentClaimStatus, state, updateDraftClaim } from '../main.js';
import { analyzeClaim, createClaim, uploadEvidence } from '../services/api_service.js';

export function renderEvidence() {
  const container = document.createElement('div');
  container.className = 'w-full max-w-md mx-auto flex flex-col gap-8 pb-4';
  const draft = state.draftClaim;
  
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
    <button class="claim-btn w-full border rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group transition-all ${draft.claimType === 'product_defect' ? 'bg-secondary/5 border-secondary shadow-sm' : 'bg-surface-container-lowest border-outline-variant hover:border-outline hover:shadow-sm'}" data-claim-type="product_defect">
    <div class="flex min-w-0 items-center gap-3 relative z-10">
    <div class="icon-bg w-10 h-10 rounded-full flex items-center justify-center border ${draft.claimType === 'product_defect' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/30'}">
    <span class="material-symbols-outlined" data-icon="inventory_2" data-weight="fill" style="font-variation-settings: 'FILL' ${draft.claimType === 'product_defect' ? 1 : 0};">inventory_2</span>
    </div>
    <span class="label-text font-body-md text-body-md ${draft.claimType === 'product_defect' ? 'text-on-surface font-medium' : 'text-on-surface-variant'}">Product Defect</span>
    </div>
    <div class="radio-outer w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${draft.claimType === 'product_defect' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}">
    <div class="radio-inner w-2.5 h-2.5 rounded-full bg-secondary ${draft.claimType === 'product_defect' ? '' : 'hidden'}"></div>
    </div>
    </button>
    <button class="claim-btn w-full border rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group transition-all ${draft.claimType === 'shipping_damage' ? 'bg-secondary/5 border-secondary shadow-sm' : 'bg-surface-container-lowest border-outline-variant hover:border-outline hover:shadow-sm'}" data-claim-type="shipping_damage">
    <div class="flex min-w-0 items-center gap-3 relative z-10">
    <div class="icon-bg w-10 h-10 rounded-full flex items-center justify-center border ${draft.claimType === 'shipping_damage' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/30'}">
    <span class="material-symbols-outlined" data-icon="local_shipping" style="font-variation-settings: 'FILL' ${draft.claimType === 'shipping_damage' ? 1 : 0};">local_shipping</span>
    </div>
    <span class="label-text font-body-md text-body-md ${draft.claimType === 'shipping_damage' ? 'text-on-surface font-medium' : 'text-on-surface-variant'}">Shipping Damage</span>
    </div>
    <div class="radio-outer w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${draft.claimType === 'shipping_damage' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}">
        <div class="radio-inner w-2.5 h-2.5 rounded-full bg-secondary ${draft.claimType === 'shipping_damage' ? '' : 'hidden'}"></div>
    </div>
    </button>
    <button class="claim-btn w-full border rounded-xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group transition-all ${draft.claimType === 'missing_item' ? 'bg-secondary/5 border-secondary shadow-sm' : 'bg-surface-container-lowest border-outline-variant hover:border-outline hover:shadow-sm'}" data-claim-type="missing_item">
    <div class="flex min-w-0 items-center gap-3 relative z-10">
    <div class="icon-bg w-10 h-10 rounded-full flex items-center justify-center border ${draft.claimType === 'missing_item' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-surface-container text-on-surface-variant border-outline-variant/30'}">
    <span class="material-symbols-outlined" data-icon="search_off" style="font-variation-settings: 'FILL' ${draft.claimType === 'missing_item' ? 1 : 0};">search_off</span>
    </div>
    <span class="label-text font-body-md text-body-md ${draft.claimType === 'missing_item' ? 'text-on-surface font-medium' : 'text-on-surface-variant'}">Missing Item</span>
    </div>
    <div class="radio-outer w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${draft.claimType === 'missing_item' ? 'border-secondary bg-secondary/10' : 'border-outline-variant'}">
        <div class="radio-inner w-2.5 h-2.5 rounded-full bg-secondary ${draft.claimType === 'missing_item' ? '' : 'hidden'}"></div>
    </div>
    </button>
    </div>
    </div>
    <!-- File Upload Zone -->
    <div class="flex flex-col gap-4">
    <h2 class="font-title-sm text-title-sm text-on-surface-variant">Upload Evidence</h2>
    <input id="evidence-file-input" type="file" class="hidden" accept="image/*,video/*,audio/*" />
    <div id="evidence-dropzone" class="w-full rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-sm cursor-pointer hover:bg-primary/10 transition-colors">
    <div class="w-16 h-16 rounded-full bg-surface/80 backdrop-blur-md border border-primary/20 flex items-center justify-center mb-4 relative z-10 shadow-md">
    <span class="material-symbols-outlined text-primary text-3xl" data-icon="cloud_upload">cloud_upload</span>
    <div class="absolute inset-0 rounded-full border border-primary/30 animate-pulse"></div>
    </div>
    <h3 class="font-headline-md text-headline-md text-on-surface mb-2 relative z-10">Drop Photo or Video</h3>
    <p class="font-body-sm text-body-sm text-on-surface-variant relative z-10 max-w-[200px] mb-4">Max 500MB, 2 minute duration limit.</p>
    <button id="browse-files-btn" type="button" class="bg-surface border border-outline-variant rounded-full px-6 py-2 font-label-caps text-label-caps text-primary uppercase tracking-wider relative z-10 hover:bg-surface-variant transition-colors shadow-sm">
                            Browse Files
                        </button>
    </div>
    <p id="selected-file-name" class="text-body-sm text-on-surface-variant ${draft.evidencePreviewName ? '' : 'hidden'}">${draft.evidencePreviewName}</p>
    <p id="file-error" class="hidden text-body-sm text-error"></p>
    </div>
    <!-- Written Description -->
    <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
    <div>
    <h2 class="font-title-sm text-title-sm text-on-surface-variant">Problem Description</h2>
    <p class="mt-1 text-body-sm text-on-surface-variant">Write short context so reviewer and AI understand issue faster.</p>
    </div>
    <span class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Recommended</span>
    </div>
    <div class="rounded-2xl border border-outline-variant/50 bg-white/70 p-4 shadow-sm backdrop-blur-md">
    <label class="mb-3 flex items-center gap-2 text-body-sm font-medium text-on-surface" for="claim-description">
    <span class="material-symbols-outlined text-primary text-[18px]">edit_note</span>
    Explain what happened
    </label>
    <textarea id="claim-description" class="min-h-[132px] w-full resize-none rounded-xl border border-outline-variant/60 bg-surface px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Example: Screen cracked after package arrived. Box had visible dent on the lower-right corner and device would not turn on after unboxing.">${draft.textDescription}</textarea>
    <div class="mt-3 flex items-start gap-2 text-body-sm text-on-surface-variant">
    <span class="material-symbols-outlined mt-0.5 text-[16px] text-primary/70">lightbulb</span>
    Include timeline, visible damage, and anything unusual during delivery or usage.
    </div>
    </div>
    </div>
    <!-- Voice Description -->
    <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
    <h2 class="font-title-sm text-title-sm text-on-surface-variant">Voice Context (Optional)</h2>
    <span class="material-symbols-outlined text-on-surface-variant text-sm" data-icon="info">info</span>
    </div>
    <textarea id="voice-description" class="min-h-[96px] w-full resize-none rounded-xl border border-outline-variant/50 bg-surface-container px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Optional: paste transcript or short voice note summary if available.">${draft.voiceDescription}</textarea>
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
    <span id="analyze-btn-label" class="font-title-sm text-title-sm text-on-primary font-semibold">Analyze with AURA AI</span>
    </button>
    <p id="submit-error" class="hidden px-2 pt-3 text-body-sm text-error"></p>
    </div>
    </div>
  `;

  const btns = container.querySelectorAll('.claim-btn');
  const descriptionField = container.querySelector('#claim-description');
  const voiceField = container.querySelector('#voice-description');
  const fileInput = container.querySelector('#evidence-file-input');
  const browseButton = container.querySelector('#browse-files-btn');
  const dropzone = container.querySelector('#evidence-dropzone');
  const selectedFileName = container.querySelector('#selected-file-name');
  const fileError = container.querySelector('#file-error');
  const submitError = container.querySelector('#submit-error');
  const analyzeBtn = container.querySelector('#evidence-analyze-btn');
  const analyzeBtnLabel = container.querySelector('#analyze-btn-label');

  const setFile = (file) => {
    if (!file) return;
    updateDraftClaim({
      evidenceFile: file,
      evidencePreviewName: `${file.name} • ${Math.max(1, Math.round(file.size / 1024))} KB`
    });
    selectedFileName.textContent = state.draftClaim.evidencePreviewName;
    selectedFileName.classList.remove('hidden');
    fileError.classList.add('hidden');
    fileError.textContent = '';
  };

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateDraftClaim({ claimType: btn.dataset.claimType });
      navigate('evidence');
    });
  });

  descriptionField.addEventListener('input', (event) => {
    updateDraftClaim({ textDescription: event.target.value });
  });

  voiceField.addEventListener('input', (event) => {
    updateDraftClaim({ voiceDescription: event.target.value });
  });

  browseButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => setFile(fileInput.files?.[0]));

  dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.classList.add('border-primary', 'bg-primary/10');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-primary', 'bg-primary/10');
  });

  dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.classList.remove('border-primary', 'bg-primary/10');
    setFile(event.dataTransfer?.files?.[0]);
  });

  analyzeBtn.addEventListener('click', async () => {
    const { evidenceFile, claimType, textDescription, voiceDescription, refundAmount } = state.draftClaim;
    const description = textDescription.trim();
    const voice = voiceDescription.trim();

    submitError.classList.add('hidden');
    fileError.classList.add('hidden');

    if (!evidenceFile) {
      fileError.textContent = 'Please choose at least one evidence file before continuing.';
      fileError.classList.remove('hidden');
      return;
    }

    if (!description) {
      submitError.textContent = 'Please write a short problem description before starting analysis.';
      submitError.classList.remove('hidden');
      return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('opacity-70', 'cursor-not-allowed');
    analyzeBtnLabel.textContent = 'Uploading and starting analysis...';

    try {
      const uploaded = await uploadEvidence(evidenceFile);
      const createdClaim = await createClaim({
        user_id: state.currentUserId,
        order_id: `order_${Date.now()}`,
        claim_type: claimType,
        file_ids: [uploaded.file_id],
        text_description: description,
        voice_description: voice || null,
        refund_amount: refundAmount
      });

      setCurrentClaim(createdClaim);
      setCurrentClaimStatus({
        claim_id: createdClaim.id,
        status: createdClaim.status,
        current_step: createdClaim.current_step,
        updated_at: createdClaim.updated_at
      });

      await analyzeClaim(createdClaim.id);
      navigate('analysis');
    } catch (error) {
      submitError.textContent = error.message || 'Failed to submit claim. Make sure backend is running.';
      submitError.classList.remove('hidden');
      analyzeBtn.disabled = false;
      analyzeBtn.classList.remove('opacity-70', 'cursor-not-allowed');
      analyzeBtnLabel.textContent = 'Analyze with AURA AI';
    }
  });

  return container;
}
