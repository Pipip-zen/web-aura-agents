import { navigate, setupNavigation, state } from '../main.js';
import { completeRegistration } from '../services/api_service.js';

export function renderOnboarding() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-[calc(100dvh-120px)] flex items-center justify-center py-8';

  container.innerHTML = `
    <section class="w-full max-w-2xl rounded-2xl border border-outline-variant/50 bg-white/80 p-6 shadow-[0_18px_48px_rgba(70,72,212,0.14)] backdrop-blur-xl sm:p-10 flex flex-col gap-8">
      <div class="text-center flex flex-col gap-2">
        <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person_check</span>
        </div>
        <h2 class="font-display-lg text-display-lg text-on-surface">What best describes you?</h2>
        <p class="text-body-md text-on-surface-variant">
          Select your role to personalize your Aura AI experience.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Buyer Card -->
        <button id="role-buyer" class="group flex flex-col text-left gap-3 rounded-2xl border-2 border-outline-variant/50 bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">shopping_cart</span>
          </div>
          <div>
            <h3 class="font-title-lg text-title-lg text-on-surface">I'm a Buyer</h3>
            <p class="mt-1 text-body-sm text-on-surface-variant">I want to file claims for products I purchased</p>
          </div>
        </button>

        <!-- Seller Card -->
        <button id="role-seller" class="group flex flex-col text-left gap-3 rounded-2xl border-2 border-outline-variant/50 bg-surface p-6 transition-all hover:-translate-y-1 hover:border-secondary/50 hover:bg-secondary/5 hover:shadow-lg hover:shadow-secondary/10 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
            <span class="material-symbols-outlined text-[28px]" style="font-variation-settings: 'FILL' 1;">storefront</span>
          </div>
          <div>
            <h3 class="font-title-lg text-title-lg text-on-surface">I'm a Seller</h3>
            <p class="mt-1 text-body-sm text-on-surface-variant">I manage my store and review customer claims</p>
          </div>
        </button>
      </div>
      
      <p id="onboarding-error" class="hidden text-center text-body-sm text-error"></p>
    </section>
  `;

  const buyerBtn = container.querySelector('#role-buyer');
  const sellerBtn = container.querySelector('#role-seller');
  const errorText = container.querySelector('#onboarding-error');

  const selectRole = async (role) => {
    buyerBtn.disabled = true;
    sellerBtn.disabled = true;
    errorText.classList.add('hidden');
    
    // UI feedback
    const btn = role === 'buyer' ? buyerBtn : sellerBtn;
    btn.classList.add('ring-2', role === 'buyer' ? 'ring-primary' : 'ring-secondary');

    try {
      try {
        await completeRegistration(role);
      } catch (e) {
        console.warn('API update failed, continuing locally', e);
      }

      localStorage.setItem('aura_user_role', role);
      if (state.currentUserId) {
        localStorage.setItem('aura_user_id', state.currentUserId);
      }
      sessionStorage.removeItem('is_new_user');
      
      setupNavigation();

      if (role === 'seller') {
        navigate('seller_dashboard');
      } else {
        navigate('hub');
      }
    } catch (error) {
      errorText.textContent = error.message || 'Failed to set role. Please try again.';
      errorText.classList.remove('hidden');
      buyerBtn.disabled = false;
      sellerBtn.disabled = false;
      btn.classList.remove('ring-2', 'ring-primary', 'ring-secondary');
    }
  };

  buyerBtn.addEventListener('click', () => selectRole('buyer'));
  sellerBtn.addEventListener('click', () => selectRole('seller'));

  return container;
}
