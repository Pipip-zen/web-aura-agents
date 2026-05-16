import { navigate, state } from '../main.js';
import { fetchClaims } from '../services/api_service.js';
import {
  formatCurrency,
  getClaimAmount,
  normalizeClaimStatus,
  renderClaimCard,
  sortClaimsByUpdatedAt
} from './claim_ui.js';

export function renderUserClaims() {
  const container = document.createElement('div');
  container.className = 'w-full pb-4 sm:pb-6';

  container.innerHTML = `
    <section class="flex flex-col gap-4">
      <button
        id="user-claims-back"
        type="button"
        class="inline-flex items-center gap-2 self-start rounded-full border border-outline-variant/50 bg-surface/70 px-4 py-2 text-body-sm text-on-surface transition hover:border-primary/40 hover:text-primary"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        Back
      </button>

      <div class="flex flex-col gap-2">
        <p class="text-primary font-label-caps uppercase tracking-wider">Claim History</p>
        <div>
          <h2 class="font-display-lg text-[clamp(2rem,7vw,2.8rem)] leading-tight text-on-background">All Claims</h2>
          <p class="text-body-md text-on-surface-variant">Track every refund request in one place.</p>
        </div>
      </div>
    </section>

    <section class="mt-lg grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div class="glass-card rounded-xl p-md">
        <p class="text-label-caps uppercase text-outline">Total Claims</p>
        <p id="user-claims-total-count" class="mt-2 text-headline-md text-on-surface">0</p>
      </div>
      <div class="glass-card rounded-xl p-md">
        <p class="text-label-caps uppercase text-outline">Requested Refund</p>
        <p id="user-claims-total-requested" class="mt-2 text-headline-sm text-on-surface">Rp0</p>
      </div>
      <div class="glass-card rounded-xl p-md">
        <p class="text-label-caps uppercase text-outline">Approved Refund</p>
        <p id="user-claims-total-approved" class="mt-2 text-headline-sm text-secondary">Rp0</p>
      </div>
    </section>

    <section class="mt-lg flex flex-col gap-md">
      <div class="flex items-center justify-between gap-3">
        <h3 class="font-headline-md text-headline-md text-on-background">Your Claims</h3>
        <span id="user-claims-caption" class="rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary">Loading</span>
      </div>
      <div id="user-claims-list" class="flex flex-col gap-sm">
        <div class="glass-card rounded-xl p-md text-body-md text-on-surface-variant">
          Loading claims from backend...
        </div>
      </div>
    </section>
  `;

  const backButton = container.querySelector('#user-claims-back');
  const totalCount = container.querySelector('#user-claims-total-count');
  const totalRequested = container.querySelector('#user-claims-total-requested');
  const totalApproved = container.querySelector('#user-claims-total-approved');
  const caption = container.querySelector('#user-claims-caption');
  const claimsList = container.querySelector('#user-claims-list');

  backButton?.addEventListener('click', () => navigate('hub'));

  fetchClaims(state.currentUserId)
    .then((claims) => {
      const sortedClaims = sortClaimsByUpdatedAt(claims);
      const approvedClaims = sortedClaims.filter((claim) => normalizeClaimStatus(claim.status) === 'approved');
      const requestedTotal = sortedClaims.reduce((sum, claim) => sum + getClaimAmount(claim), 0);
      const approvedTotal = approvedClaims.reduce((sum, claim) => sum + getClaimAmount(claim), 0);

      totalCount.textContent = `${sortedClaims.length}`;
      totalRequested.textContent = formatCurrency(requestedTotal);
      totalApproved.textContent = formatCurrency(approvedTotal);
      caption.textContent = `${sortedClaims.length} Claims`;

      if (!sortedClaims.length) {
        claimsList.innerHTML = `
          <div class="glass-card rounded-xl border border-dashed border-outline-variant/60 bg-surface p-lg text-center">
            <span class="material-symbols-outlined text-[34px] text-outline">inbox</span>
            <p class="mt-3 text-body-lg font-medium text-on-surface">No Claims Yet</p>
            <p class="mt-1 text-body-sm text-on-surface-variant">Create your first claim to start tracking refund decisions here.</p>
          </div>
        `;
        return;
      }

      claimsList.innerHTML = sortedClaims.map((claim) => renderClaimCard(claim, { showDate: true })).join('');
    })
    .catch((error) => {
      caption.textContent = 'Offline';
      claimsList.innerHTML = `
        <div class="glass-card rounded-xl border border-error/20 bg-error/5 p-md text-body-md text-on-surface-variant">
          ${error.message || 'Unable to load claims from backend.'}
        </div>
      `;
    });

  return container;
}
