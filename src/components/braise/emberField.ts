/** Shared, tweenable ember parameters (GSAP animates this object, the field reads it every frame). */
export interface EmberState {
  /** Particles spawned per second along the source band. */
  rate: number;
  /** Source band centre and width, as fractions of the canvas size (y measured from the top). */
  x: number;
  y: number;
  spread: number;
  /** Extra upward push, fed by scroll velocity. */
  wind: number;
  /** Fire ring swoosh: 0 → 1 draws the ring, alpha fades it out. */
  ring: number;
  ringAlpha: number;
}

export interface RingGeometry {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
  phase: number;
  alpha: number;
}

const SPRITE_SIZE = 64;
const RING_TILT = -0.18;

const makeSprite = () => {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,248,226,1)');
    g.addColorStop(0.26, 'rgba(255,200,110,0.95)');
    g.addColorStop(0.5, 'rgba(255,108,28,0.42)');
    g.addColorStop(1, 'rgba(200,30,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  }
  return sprite;
};

export class EmberField {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly sprite = makeSprite();
  private readonly particles: Particle[] = [];
  private spawnDebt = 0;
  private width = 0;
  private height = 0;
  private scale = 1;
  private lastTime = 0;
  private ringGeometry: RingGeometry | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly state: EmberState,
    private readonly maxParticles: number,
    private readonly maxDpr: number
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('2D canvas unavailable');
    this.ctx = ctx;
    this.resize();
  }

  resize() {
    this.scale = Math.min(window.devicePixelRatio || 1, this.maxDpr);
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;
    this.canvas.width = Math.max(1, Math.round(this.width * this.scale));
    this.canvas.height = Math.max(1, Math.round(this.height * this.scale));
  }

  setRingGeometry(geometry: RingGeometry | null) {
    this.ringGeometry = geometry;
  }

  /** Throws a fan of sparks from a point given in CSS pixels. */
  burst(count: number, x: number, y: number, spread: number) {
    for (let i = 0; i < count && this.particles.length < this.maxParticles * 1.6; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const speed = 160 + Math.random() * 360;
      this.particles.push({
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: 0.8 + Math.random() * 1.4,
        size: 0.7 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 1,
      });
    }
  }

  private spawn(dt: number) {
    const { state } = this;
    this.spawnDebt += state.rate * dt;
    while (this.spawnDebt >= 1) {
      this.spawnDebt -= 1;
      if (this.particles.length >= this.maxParticles) continue;
      // Mostly crisp sparks, with the odd large out-of-focus ember drifting by.
      const bokeh = Math.random() < 0.07;
      this.particles.push({
        x: (state.x + (Math.random() - 0.5) * state.spread) * this.width,
        y: state.y * this.height + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 40,
        vy: -(70 + Math.random() * 150),
        age: 0,
        life: 1.4 + Math.random() * 2.2,
        size: bokeh ? 3.2 + Math.random() * 2.8 : 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        alpha: bokeh ? 0.3 : 1,
      });
    }
  }

  private ellipsePoint(g: RingGeometry, angle: number) {
    const cos = Math.cos(RING_TILT);
    const sin = Math.sin(RING_TILT);
    const ex = g.rx * Math.cos(angle);
    const ey = g.ry * Math.sin(angle);
    return { x: g.cx + ex * cos - ey * sin, y: g.cy + ex * sin + ey * cos };
  }

  /** A comet of fire sweeping around the fish, stamped with the ember sprite. */
  private drawRing(time: number) {
    const { state, ringGeometry: g, ctx, sprite } = this;
    if (!g || state.ring <= 0.001 || state.ringAlpha <= 0.01) return;

    const sweep = Math.PI * 2.15 * state.ring;
    const start = -Math.PI * 0.85;
    const tail = Math.min(sweep, Math.PI * 1.4);
    const steps = 96;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = this.ellipsePoint(g, start + sweep - tail * (1 - t));
      const flicker = 0.75 + 0.25 * Math.sin(time * 21 + i * 1.7);
      const radius = (6 + 38 * t * t) * flicker;
      const wobble = Math.sin(time * 7 + i * 0.45) * 6 * t;
      ctx.globalAlpha = state.ringAlpha * Math.pow(t, 1.6) * 0.55;
      ctx.drawImage(sprite, point.x - radius, point.y - radius + wobble, radius * 2, radius * 2);
    }
    ctx.globalAlpha = 1;

    if (state.ring < 1) {
      for (let k = 0; k < 3 && this.particles.length < this.maxParticles * 1.6; k++) {
        const along = k === 0 ? 1 : 0.55 + Math.random() * 0.45;
        const point = this.ellipsePoint(g, start + sweep - tail * (1 - along));
        this.particles.push({
          x: point.x,
          y: point.y,
          vx: (Math.random() - 0.5) * 160,
          vy: -(40 + Math.random() * 160),
          age: 0,
          life: 0.5 + Math.random() * 1,
          size: 0.6 + Math.random() * 1.4,
          phase: time + k,
          alpha: 1,
        });
      }
    }
  }

  render(timeSeconds: number) {
    const dt = Math.min(0.05, this.lastTime ? timeSeconds - this.lastTime : 0.016);
    this.lastTime = timeSeconds;
    const { ctx, particles, state } = this;

    this.spawn(dt);

    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    if (particles.length === 0 && state.ring <= 0.001) return;
    ctx.globalCompositeOperation = 'lighter';

    this.drawRing(timeSeconds);

    const lift = 1 + state.wind;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life || p.y < -40) {
        particles[i] = particles[particles.length - 1];
        particles.pop();
        continue;
      }
      const sway = Math.sin(timeSeconds * 2.2 + p.phase) * 26;
      p.vx += (sway - p.vx * 0.6) * dt;
      p.vy -= 18 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt * lift;

      const k = p.age / p.life;
      const fade = k < 0.12 ? k / 0.12 : 1 - (k - 0.12) / 0.88;
      const flicker = 0.75 + 0.25 * Math.sin(timeSeconds * 18 + p.phase * 7);
      const radius = p.size * (1 - k * 0.55) * 3.2;
      ctx.globalAlpha = Math.max(0, fade * flicker * p.alpha);
      ctx.drawImage(this.sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  clear() {
    this.particles.length = 0;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
