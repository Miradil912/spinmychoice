// ===== Life Spin – Monetization Module =====

const Monetization = {
  spinsSincePrompt: 0,
  PROMPT_EVERY: 10,

  init() {
    this.initAds();
    this.initDonation();
    this.initPro();
  },

  initAds() {
    // AdSense placeholder — replace data-ad-client and data-ad-slot with real values
    // The containers exist in HTML. This function activates them if AdSense is present.
    if (typeof adsbygoogle !== 'undefined') {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) { /* adsense not configured */ }
    }
  },

  initDonation() {
    // Ko-fi or BMC widget (replace with real link)
    const btn = document.getElementById('donateBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        window.open('https://ko-fi.com', '_blank', 'noopener');
      });
    }
  },

  initPro() {
    const btn = document.getElementById('proBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        // Stripe/PayPal hook — replace URL with real checkout
        window.showToast?.('Pro coming soon! Join the waitlist.');
      });
    }
  },

  onSpin() {
    this.spinsSincePrompt++;
    if (this.spinsSincePrompt >= this.PROMPT_EVERY) {
      this.spinsSincePrompt = 0;
      setTimeout(() => this.showSupportModal(), 1500);
    }
  },

  showSupportModal() {
    const modal = document.getElementById('supportModal');
    modal?.classList.add('open');
  }
};
