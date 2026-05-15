import { getSellerClaimDetail, submitSellerDecision } from '../services/api_service.js';
import { navigate } from '../main.js';

export function renderSellerClaimDetail(claimId) {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[calc(100dvh-120px)] flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto';

  container.innerHTML = `
    <!-- Header -->
    <div class="flex items-center gap-4">
      <button id="back-btn" class="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50 text-on-surface hover:bg-surface-variant transition-colors">
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <h2 class="font-display-md text-display-md text-on-surface">Claim Detail</h2>
    </div>

    <!-- Content Area (Loading state initially) -->
    <div id="detail-content" class="flex flex-col gap-6">
      <div class="flex items-center justify-center py-20 text-on-surface-variant">
        <span class="material-symbols-outlined animate-spin mr-2">progress_activity</span> Loading detail...
      </div>
    </div>
  `;

  // Back button listener
  container.querySelector('#back-btn').addEventListener('click', () => {
    navigate('seller_dashboard');
  });

  // Fetch and render
  setTimeout(async () => {
    const content = container.querySelector('#detail-content');
    try {
      const detail = await getSellerClaimDetail(claimId);
      
      const { status, created_at, customer_reason, ai_analysis, seller_decision, evidence_url } = detail;

      let statusColor = 'bg-surface-variant text-on-surface-variant';
      let statusText = status || 'unknown';
      if (status === 'pending') { statusColor = 'bg-primary/10 text-primary'; statusText = 'Pending'; }
      else if (status === 'processing') { statusColor = 'bg-tertiary/10 text-tertiary'; statusText = 'Analyzing AI'; }
      else if (status === 'under_review') { statusColor = 'bg-[#FFD700]/20 text-[#B8860B]'; statusText = 'Needs Review'; }
      else if (status === 'complete' || status === 'approved') { statusColor = 'bg-secondary/10 text-secondary'; statusText = status === 'approved' ? 'Approved' : 'Complete'; }
      else if (status === 'rejected') { statusColor = 'bg-error/10 text-error'; statusText = 'Rejected'; }

      const hasDecision = !!seller_decision;
      // Any claim without a seller decision is open for review — regardless of status
      const isReviewable = !hasDecision;

      content.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- Left Column: Customer Evidence & Reason -->
          <div class="flex flex-col gap-4">
            <div class="rounded-2xl border border-outline-variant/50 bg-white p-5 shadow-sm">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-title-md text-on-surface">Customer Report</h3>
                <span class="px-2.5 py-1 rounded-full text-label-sm font-medium ${statusColor}">${statusText}</span>
              </div>
              
              <div class="mb-4">
                <p class="text-label-sm text-on-surface-variant mb-1">Date Submitted</p>
                <p class="text-body-md text-on-surface">${new Date(created_at).toLocaleString()}</p>
              </div>

              <div class="mb-4">
                <p class="text-label-sm text-on-surface-variant mb-1">Customer Reason</p>
                <div class="bg-surface-variant/30 p-3 rounded-xl border border-outline-variant/30 text-body-md text-on-surface italic">
                  "${customer_reason || 'No description provided.'}"
                </div>
              </div>

              <div>
                <p class="text-label-sm text-on-surface-variant mb-2">Evidence Attachment</p>
                ${evidence_url ? `
                  <img src="${evidence_url}" alt="Evidence" class="w-full h-auto max-h-64 object-cover rounded-xl border border-outline-variant/50">
                ` : `
                  <div class="flex items-center justify-center h-32 bg-surface-variant/30 rounded-xl border border-dashed border-outline-variant/60 text-on-surface-variant">
                    <span class="material-symbols-outlined mr-2">image</span> Evidence securely stored.
                  </div>
                `}
              </div>
            </div>
          </div>

          <!-- Right Column: AI Analysis & Decision -->
          <div class="flex flex-col gap-4">
            
            <!-- AI Analysis -->
            <div class="rounded-2xl border border-outline-variant/50 bg-white p-5 shadow-sm">
              <div class="flex items-center gap-2 mb-4 text-tertiary">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                <h3 class="font-title-md">Aura AI Analysis</h3>
              </div>
              
              ${ai_analysis && ai_analysis.verdict ? `
                <div class="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant/30">
                  <div class="flex flex-col">
                    <span class="text-label-sm text-on-surface-variant">Recommendation</span>
                    <span class="font-title-lg ${ai_analysis.verdict === 'APPROVE' ? 'text-secondary' : 'text-error'}">${ai_analysis.verdict}</span>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-label-sm text-on-surface-variant">Confidence</span>
                    <span class="font-title-lg text-on-surface">${Math.round((ai_analysis.confidence_score || 0) * 100)}%</span>
                  </div>
                </div>
                
                <div class="mb-3">
                  <p class="text-label-sm text-on-surface-variant mb-1">Detected Damage</p>
                  <p class="text-body-sm text-on-surface bg-error/5 p-2 rounded-lg border border-error/10">${ai_analysis.damage_description || 'None clearly specified.'}</p>
                </div>
                
                <div>
                  <p class="text-label-sm text-on-surface-variant mb-1">AI Reasoning</p>
                  <p class="text-body-sm text-on-surface-variant leading-relaxed">${ai_analysis.recommendation || 'No detailed reasoning provided.'}</p>
                </div>
              ` : `
                <div class="py-4 text-center text-on-surface-variant text-body-sm">
                  <p>AI Analysis is pending or not available for this claim.</p>
                </div>
              `}
            </div>

            <!-- Decision Box -->
            <div class="rounded-2xl border border-outline-variant/50 bg-white p-5 shadow-sm">
              <h3 class="font-title-md text-on-surface mb-4">Your Decision</h3>
              
              ${hasDecision ? `
                <div class="flex items-center p-4 rounded-xl border ${seller_decision.decision === 'approved' ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-error/10 border-error/30 text-error'}">
                  <span class="material-symbols-outlined mr-3" style="font-variation-settings: 'FILL' 1;">${seller_decision.decision === 'approved' ? 'check_circle' : 'cancel'}</span>
                  <div>
                    <p class="font-title-sm capitalize">You ${seller_decision.decision === 'approved' ? 'Approved' : 'Rejected'} this claim.</p>
                    ${seller_decision.seller_note ? `<p class="text-body-sm mt-1 opacity-80">Note: ${seller_decision.seller_note}</p>` : ''}
                  </div>
                </div>
              ` : `
                ${isReviewable ? `
                  <div class="flex flex-col gap-4">
                    <textarea id="seller-note" class="w-full rounded-xl border border-outline-variant/60 bg-surface p-3 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none h-24" placeholder="Optional: Add a note to the buyer explaining your decision..."></textarea>
                    
                    <div class="flex gap-3 mt-2">
                      <button id="btn-reject" data-decision="rejected" class="flex-1 flex items-center justify-center gap-2 rounded-xl border border-error text-error px-4 py-3 font-title-sm hover:bg-error/10 transition">
                        <span class="material-symbols-outlined text-[18px]">close</span> Reject
                      </button>
                      <button id="btn-approve" data-decision="approved" class="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary text-white px-4 py-3 font-title-sm shadow-lg shadow-secondary/25 hover:bg-secondary/90 transition">
                        <span class="material-symbols-outlined text-[18px]">check</span> Approve
                      </button>
                    </div>
                  </div>
                ` : `
                  <div class="p-4 bg-surface-variant/30 rounded-xl text-center text-body-sm text-on-surface-variant">
                    This claim is not currently open for review.
                  </div>
                `}
              `}
            </div>
          </div>
        </div>
      `;

      if (!hasDecision && isReviewable) {
        const btnApprove = content.querySelector('#btn-approve');
        const btnReject = content.querySelector('#btn-reject');
        const noteInput = content.querySelector('#seller-note');

        const handleDecision = async (decision) => {
          btnApprove.disabled = true;
          btnReject.disabled = true;
          const originalText = decision === 'approved' ? btnApprove.innerHTML : btnReject.innerHTML;
          const btn = decision === 'approved' ? btnApprove : btnReject;
          
          btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Processing...`;
          
          try {
            await submitSellerDecision(claimId, decision, noteInput.value.trim());
            // Re-render
            renderSellerClaimDetail(claimId); 
            // In a real app we might just navigate back, but re-rendering shows success
            setTimeout(() => navigate('seller_dashboard'), 1500);
          } catch (e) {
            btn.innerHTML = originalText;
            btnApprove.disabled = false;
            btnReject.disabled = false;
            alert(e.message || 'Failed to submit decision');
          }
        };

        btnApprove.addEventListener('click', () => handleDecision('approved'));
        btnReject.addEventListener('click', () => handleDecision('rejected'));
      }
      
    } catch (error) {
      content.innerHTML = `
        <div class="flex flex-col items-center justify-center py-12 text-center text-error border border-error/20 rounded-2xl bg-error/5">
          <span class="material-symbols-outlined text-4xl mb-2">error</span>
          <p class="text-body-md">Failed to load claim detail</p>
          <p class="text-body-sm opacity-80 mt-1">${error.message}</p>
        </div>
      `;
    }
  }, 0);

  return container;
}
