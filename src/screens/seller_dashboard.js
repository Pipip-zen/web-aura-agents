import { navigate } from '../main.js';
import { fetchSellerClaims } from '../services/api_service.js';

export function renderSellerDashboard() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[calc(100dvh-120px)] p-6 md:p-8 flex flex-col gap-6';

  container.innerHTML = `
    <div class="flex flex-col gap-2">
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary mb-2">
        <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">storefront</span>
      </div>
      <h2 class="font-display-md text-display-md text-on-surface">Seller Dashboard</h2>
      <p class="text-body-md text-on-surface-variant">Review and manage customer claims.</p>
    </div>
    
    <div id="seller-claims-container" class="flex flex-col gap-4">
      <div class="flex items-center justify-center py-12 text-on-surface-variant text-body-md">
        <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span> Loading claims...
      </div>
    </div>
  `;

  // Fetch claims and render
  setTimeout(async () => {
    const claimsContainer = container.querySelector('#seller-claims-container');
    try {
      const claims = await fetchSellerClaims();
      
      if (claims.length === 0) {
        claimsContainer.innerHTML = `
          <div class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-outline-variant/60 rounded-2xl bg-surface">
            <span class="material-symbols-outlined text-4xl text-outline mb-4">inbox</span>
            <p class="text-body-lg font-medium text-on-surface">No claims yet</p>
            <p class="text-body-sm text-on-surface-variant mt-1 max-w-sm">You don't have any incoming customer claims to review.</p>
          </div>
        `;
        return;
      }
      
      claimsContainer.innerHTML = '';
      
      claims.forEach(claim => {
        const card = document.createElement('div');
        card.className = 'flex flex-col gap-3 rounded-2xl border border-outline-variant/50 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group';
        
        // Click listener
        card.addEventListener('click', () => {
          navigate('seller_claim_detail', claim.claim_id);
        });
        
        // Status formatting
        let statusColor = 'bg-surface-variant text-on-surface-variant';
        let statusText = claim.status || 'unknown';
        
        if (claim.status === 'pending') {
          statusColor = 'bg-primary/10 text-primary';
          statusText = 'Pending';
        } else if (claim.status === 'processing') {
          statusColor = 'bg-tertiary/10 text-tertiary';
          statusText = 'Analyzing AI';
        } else if (claim.status === 'under_review') {
          statusColor = 'bg-[#FFD700]/20 text-[#B8860B]';
          statusText = 'Needs Review';
        } else if (claim.status === 'complete') {
          statusColor = 'bg-[#FFD700]/20 text-[#B8860B]';
          statusText = 'Awaiting Decision';
        } else if (claim.status === 'refund_approved' || claim.status === 'approved') {
          statusColor = 'bg-secondary/10 text-secondary';
          statusText = 'Approved ✓';
        } else if (claim.status === 'rejected') {
          statusColor = 'bg-error/10 text-error';
          statusText = 'Rejected';
        }

        card.innerHTML = `
          <div class="flex justify-between items-start">
            <div class="flex flex-col">
              <span class="text-label-sm uppercase tracking-wider text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Claim ID: ${claim.claim_id.substring(0, 8)}...</span>
              <h3 class="font-title-md text-on-surface">${claim.damage_type || 'Product Claim'}</h3>
            </div>
            <span class="px-2.5 py-1 rounded-full text-label-sm font-medium ${statusColor}">${statusText}</span>
          </div>
          
          <div class="flex items-center gap-4 mt-2">
            <div class="flex flex-col">
              <span class="text-label-sm text-on-surface-variant">Date</span>
              <span class="text-body-sm text-on-surface">${new Date(claim.created_at).toLocaleDateString()}</span>
            </div>
            ${claim.ai_verdict ? `
              <div class="flex flex-col">
                <span class="text-label-sm text-on-surface-variant">AI Verdict</span>
                <span class="text-body-sm font-medium ${claim.ai_verdict === 'APPROVE' ? 'text-secondary' : 'text-error'}">${claim.ai_verdict}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-label-sm text-on-surface-variant">Confidence</span>
                <span class="text-body-sm text-on-surface">${Math.round((claim.confidence_score || 0) * 100)}%</span>
              </div>
            ` : ''}
          </div>
        `;
        
        claimsContainer.appendChild(card);
      });
      
    } catch (error) {
      claimsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-center text-error border border-error/20 rounded-2xl bg-error/5">
          <span class="material-symbols-outlined text-4xl mb-2">error</span>
          <p class="text-body-md">Failed to load claims</p>
          <p class="text-body-sm opacity-80 mt-1">${error.message}</p>
        </div>
      `;
    }
  }, 0);

  return container;
}
