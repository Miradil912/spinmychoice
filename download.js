// ===== Life Spin – Download Engine =====
// Requires: html2canvas, jspdf (loaded via CDN)

const Download = {
  currentResult: null,
  currentWheel: null,

  setResult(result, wheel) {
    this.currentResult = result;
    this.currentWheel = wheel;
  },

  // Build a beautiful result card as a canvas
  async buildCard() {
    const result = this.currentResult;
    if (!result) return null;

    const W = 1080, H = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    const catColors = {
      decision: ['#7c4dff', '#4a1fa0'],
      health:   ['#00c897', '#007a5e'],
      personal: ['#ff6b6b', '#a03030'],
      inspire:  ['#ffd166', '#a07a20']
    };

    const [colorA, colorB] = catColors[result.category] || ['#7c4dff', '#4a1fa0'];

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a0a0f');
    bgGrad.addColorStop(0.5, '#16161f');
    bgGrad.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Decorative circles
    const drawCircle = (x, y, r, color, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill();
      ctx.restore();
    };
    drawCircle(200, 200, 400, colorA, 0.12);
    drawCircle(880, 880, 350, colorB, 0.1);
    drawCircle(W / 2, H / 2, 500, colorA, 0.04);

    // Gold border
    const borderGrad = ctx.createLinearGradient(0, 0, W, H);
    borderGrad.addColorStop(0, 'rgba(212,175,55,0.8)');
    borderGrad.addColorStop(0.5, 'rgba(240,208,96,0.4)');
    borderGrad.addColorStop(1, 'rgba(212,175,55,0.8)');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 6;
    const bm = 30;
    this._roundRect(ctx, bm, bm, W - bm * 2, H - bm * 2, 40);
    ctx.stroke();

    // Logo
    ctx.font = 'bold 52px serif';
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.fillText('🌀 Life Spin', W / 2, 140);

    ctx.font = '700 22px sans-serif';
    ctx.fillStyle = 'rgba(212,175,55,0.6)';
    ctx.letterSpacing = '4px';
    ctx.fillText('YOUR DAILY ORACLE', W / 2, 180);

    // Divider
    ctx.beginPath();
    ctx.moveTo(W / 2 - 200, 210); ctx.lineTo(W / 2 + 200, 210);
    ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 1; ctx.stroke();

    // Category badge
    const catIcons = { decision: '💡', health: '🩺', personal: '🌱', inspire: '✨' };
    const catNames = { decision: 'Life Decision', health: 'Health', personal: 'Personal Growth', inspire: 'Inspiration' };

    const badgeY = 270, badgeH = 60, badgeW = 320;
    ctx.save();
    ctx.fillStyle = colorA + '33';
    this._roundRect(ctx, (W - badgeW) / 2, badgeY, badgeW, badgeH, 30);
    ctx.fill();
    ctx.strokeStyle = colorA + '66'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = colorA;
    ctx.textAlign = 'center';
    ctx.fillText(`${catIcons[result.category]}  ${catNames[result.category].toUpperCase()}`, W / 2, badgeY + 38);

    // Main message
    ctx.fillStyle = '#f0ede8';
    ctx.textAlign = 'center';
    const msg = result.text;
    const lines = this._wrapText(ctx, msg, W - 180, 'bold 52px serif');
    const totalH = lines.length * 70;
    const msgY = (H - totalH) / 2 - 20;

    ctx.font = 'bold 52px serif';
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, msgY + i * 70);
    });

    // Decorative quote marks
    ctx.font = '200px serif';
    ctx.fillStyle = 'rgba(212,175,55,0.07)';
    ctx.textAlign = 'left';
    ctx.fillText('"', 40, msgY + 80);
    ctx.textAlign = 'right';
    ctx.fillText('"', W - 40, msgY + totalH + 60);

    // Bottom divider
    ctx.beginPath();
    ctx.moveTo(W / 2 - 200, H - 200); ctx.lineTo(W / 2 + 200, H - 200);
    ctx.strokeStyle = 'rgba(212,175,55,0.3)'; ctx.lineWidth = 1; ctx.stroke();

    // Timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    ctx.font = '24px sans-serif';
    ctx.fillStyle = 'rgba(150,145,140,0.8)';
    ctx.textAlign = 'center';
    ctx.fillText(dateStr, W / 2, H - 150);

    // lifespin URL
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = 'rgba(212,175,55,0.5)';
    ctx.fillText('lifespin.app', W / 2, H - 80);

    return canvas;
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  _wrapText(ctx, text, maxWidth, font) {
    ctx.font = font;
    const words = text.split(' ');
    const lines = [];
    let current = '';
    words.forEach(word => {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth) {
        if (current) lines.push(current);
        current = word;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);
    return lines;
  },

  async downloadPng() {
    const toast = window.showToast;
    if (toast) toast('Generating image…');
    try {
      const card = await this.buildCard();
      if (!card) return;
      const ts = Date.now();
      const link = document.createElement('a');
      link.download = `life-spin-result-${ts}.png`;
      link.href = card.toDataURL('image/png');
      link.click();
      if (toast) toast('✅ Image downloaded!');
    } catch (e) {
      console.error(e);
      if (toast) toast('❌ Could not generate image.');
    }
  },

  async downloadPdf() {
    if (!window.jspdf) {
      window.showToast?.('jsPDF not loaded yet. Try again.');
      return;
    }
    window.showToast?.('Generating PDF…');
    try {
      const card = await this.buildCard();
      if (!card) return;
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [card.width, card.height] });
      pdf.addImage(card.toDataURL('image/png'), 'PNG', 0, 0, card.width, card.height);
      pdf.save(`life-spin-result-${Date.now()}.pdf`);
      window.showToast?.('✅ PDF downloaded!');
    } catch (e) {
      console.error(e);
      window.showToast?.('❌ Could not generate PDF.');
    }
  },

  async share() {
    const result = this.currentResult;
    if (!result) return;
    const text = `🌀 Life Spin says: "${result.text}" — Get your daily oracle at lifespin.app`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Life Spin Result', text });
      } catch (e) { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      window.showToast?.('✅ Copied to clipboard!');
    }
  },

  speak(text, lang) {
    if (!('speechSynthesis' in window)) {
      window.showToast?.('Voice not supported on this device.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang || 'en-US';
    utter.rate = 0.9;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }
};
