// ===== Life Spin – Wheel Engine =====

const CATEGORIES = [
  { key: 'decision', label: '💡 Decision', color: '#7c4dff', light: 'rgba(124,77,255,0.85)' },
  { key: 'health',   label: '🩺 Health',   color: '#00c897', light: 'rgba(0,200,150,0.85)' },
  { key: 'personal', label: '🌱 Personal', color: '#ff6b6b', light: 'rgba(255,107,107,0.85)' },
  { key: 'inspire',  label: '✨ Inspire',  color: '#ffd166', light: 'rgba(255,209,102,0.85)' }
];

const SEGMENT_COUNT = CATEGORIES.length; // 4 main segments
const SEG_ANGLE = (2 * Math.PI) / SEGMENT_COUNT;

class LifeSpinWheel {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.currentAngle = 0;
    this.spinning = false;
    this.messages = {};
    this.spinCount = parseInt(localStorage.getItem('lifespin_count') || '0');
    this.history = JSON.parse(localStorage.getItem('lifespin_history') || '[]');
    this.useCryptoRng = false;
    this.winResult = null;
    this.onResultCallback = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const size = Math.min(this.canvas.parentElement.offsetWidth, 460);
    this.canvas.width = size;
    this.canvas.height = size;
    this.draw(this.currentAngle);
  }

  setMessages(msgs) {
    this.messages = msgs;
  }

  onResult(cb) {
    this.onResultCallback = cb;
  }

  random() {
    if (this.useCryptoRng) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return arr[0] / (0xFFFFFFFF + 1);
    }
    return Math.random();
  }

  getRandomMessage(category) {
    const pool = this.messages[category] || [];
    if (!pool.length) return { text: '✨ Keep going!', category };
    const idx = Math.floor(this.random() * pool.length);
    return { text: pool[idx], category };
  }

  draw(angle) {
    const { ctx, canvas } = this;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = cx - 4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    CATEGORIES.forEach((cat, i) => {
      const startAngle = angle + i * SEG_ANGLE;
      const endAngle = startAngle + SEG_ANGLE;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();

      // Gradient per segment
      const gx = cx + Math.cos(startAngle + SEG_ANGLE / 2) * r * 0.6;
      const gy = cy + Math.sin(startAngle + SEG_ANGLE / 2) * r * 0.6;
      const grad = ctx.createRadialGradient(gx, gy, 0, cx, cy, r);
      grad.addColorStop(0, cat.light);
      grad.addColorStop(1, this._darken(cat.color, 0.55));
      ctx.fillStyle = grad;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + SEG_ANGLE / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 6;

      const labelR = r * 0.7;
      // Emoji
      ctx.font = `${Math.max(20, r * 0.1)}px serif`;
      const emoji = cat.label.split(' ')[0];
      ctx.fillText(emoji, labelR - 4, 6);

      // Text
      ctx.font = `600 ${Math.max(11, r * 0.055)}px 'DM Sans', sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      const txt = cat.label.split(' ').slice(1).join(' ');
      ctx.fillText(txt, labelR - 4, 22);
      ctx.restore();
    });

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(212,175,55,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner decorative ring
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.18, 0, 2 * Math.PI);
    ctx.fillStyle = '#111118';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,175,55,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tick marks
    for (let i = 0; i < 40; i++) {
      const a = angle + (i / 40) * 2 * Math.PI;
      const isMain = i % 10 === 0;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r - (isMain ? 14 : 8)), cy + Math.sin(a) * (r - (isMain ? 14 : 8)));
      ctx.lineTo(cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1));
      ctx.strokeStyle = isMain ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = isMain ? 2 : 1;
      ctx.stroke();
    }

    // Winning highlight
    if (this.winResult !== null && !this.spinning) {
      const i = this.winResult;
      const startAngle = angle + i * SEG_ANGLE;
      const endAngle = startAngle + SEG_ANGLE;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r - 2, startAngle, endAngle);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 4;
      ctx.stroke();
    }
  }

  _darken(hex, factor) {
    // Simple darkening
    const r = parseInt(hex.slice(1, 3), 16) * factor;
    const g = parseInt(hex.slice(3, 5), 16) * factor;
    const b = parseInt(hex.slice(5, 7), 16) * factor;
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  }

  spin() {
    if (this.spinning) return;
    this.spinning = true;
    this.winResult = null;

    // Determine winning segment with true randomness
    const winIndex = Math.floor(this.random() * SEGMENT_COUNT);
    const winCategory = CATEGORIES[winIndex].key;

    // Calculate exact landing angle
    // Pointer is at right (angle 0). We want the center of winIndex segment to land at angle 0 (right side).
    // Center of segment winIndex is at: currentAngle + winIndex * SEG_ANGLE + SEG_ANGLE/2
    // We want that to be -PI/2 (top) ... actually pointer is at right = 0 rad
    // Let's target angle = 0 for the pointer (3 o'clock / right side)
    
    const baseRotations = 5 + Math.floor(this.random() * 5); // 5–9 full spins
    const targetSeg = -(winIndex * SEG_ANGLE + SEG_ANGLE / 2 - 0.05 + this.random() * 0.1);
    const totalRotation = baseRotations * 2 * Math.PI + targetSeg;

    const startAngle = this.currentAngle;
    const duration = 4000 + this.random() * 2000; // 4–6s
    const startTime = performance.now();

    // Click sounds simulation via visual feedback
    let lastSeg = -1;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease: cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3.5);
      this.currentAngle = startAngle + totalRotation * eased;

      this.draw(this.currentAngle);

      // Tick detection
      const normAngle = ((this.currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const seg = Math.floor(normAngle / SEG_ANGLE);
      if (seg !== lastSeg) {
        lastSeg = seg;
        this._onTick();
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Landed
        this.currentAngle = startAngle + totalRotation;
        this.winResult = winIndex;
        this.spinning = false;
        this.draw(this.currentAngle);

        const result = this.getRandomMessage(winCategory);
        result.categoryIndex = winIndex;
        result.categoryData = CATEGORIES[winIndex];

        // Save to history
        this._saveResult(result);
        this._onTick(); // final tick

        if (this.onResultCallback) {
          this.onResultCallback(result);
        }

        // Win animation
        const wrapper = this.canvas.closest('.wheel-wrapper');
        wrapper?.classList.add('won');
        setTimeout(() => wrapper?.classList.remove('won'), 1000);
      }
    };

    requestAnimationFrame(animate);
  }

  _onTick() {
    // Visual tick: briefly flash the canvas border
    const canvas = this.canvas;
    canvas.style.transition = 'box-shadow 0.05s';
    canvas.style.boxShadow = '0 0 20px rgba(212,175,55,0.4)';
    setTimeout(() => { canvas.style.boxShadow = ''; }, 80);
  }

  _saveResult(result) {
    this.spinCount++;
    localStorage.setItem('lifespin_count', this.spinCount);

    const entry = {
      id: Date.now(),
      category: result.category,
      text: result.text,
      timestamp: new Date().toISOString()
    };

    this.history.unshift(entry);
    if (this.history.length > 50) this.history = this.history.slice(0, 50);
    localStorage.setItem('lifespin_history', JSON.stringify(this.history));
  }
}

// Exported singleton
let wheelInstance = null;
function getWheel(canvasId = 'spinWheel') {
  if (!wheelInstance) wheelInstance = new LifeSpinWheel(canvasId);
  return wheelInstance;
}
