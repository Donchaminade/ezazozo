/** Shared, tweenable flame parameters (GSAP animates this object, the renderer reads it every frame). */
export interface FireState {
  intensity: number;
  /** Flame base centre, as a fraction of the canvas width. */
  x: number;
  /** Flame base height, as a fraction of the canvas height measured from the bottom. */
  y: number;
  /** Half width of the burning bed, as a fraction of the canvas width. */
  halfWidth: number;
  /** Nominal flame height, in canvas-height units. */
  height: number;
}

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uIntensity;
uniform vec4 uBase;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy / uRes.y;
  vec2 base = vec2(uBase.x * uRes.x / uRes.y, uBase.y);
  vec2 p = frag - base;
  float nx = p.x / uBase.z;
  float ny = p.y / uBase.w;
  if (abs(nx) > 1.25 || ny < -0.8 || ny > 2.2) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float t = uTime;
  float bed = 1.0 - smoothstep(0.35, 1.15, abs(nx));
  float rise = smoothstep(-0.8, 0.1, ny);

  // Flame columns: their height wanders across the bed and over time.
  float columns = fbm(vec2(p.x * 5.5 + 7.0, t * 0.4));
  float h = (0.3 + 2.4 * columns * columns * columns * 2.2) * bed;

  // Upward-scrolling turbulence, domain-warped and stretched so it reads as licking tongues.
  vec2 q = vec2(p.x * 11.0, p.y * 3.6 - t * 1.9);
  float warp = fbm(q * 0.55 + vec2(3.1, -t * 0.5));
  float n = fbm(q + vec2(warp * 2.2, 0.0));
  float fine = noise(vec2(p.x * 34.0 + warp * 5.0, p.y * 11.0 - t * 5.0));

  float d = 1.0 - max(ny, 0.0) / max(h, 0.06);
  d += (n - 0.5) * 1.5 + (fine - 0.5) * 0.45;
  d *= bed * rise * uIntensity;

  // Emissive colour ramp (the canvas is screen-blended, so black means no light).
  float a = smoothstep(0.12, 0.6, d);
  vec3 col = vec3(0.62, 0.07, 0.0) * smoothstep(0.12, 0.45, d);
  col = mix(col, vec3(1.0, 0.4, 0.05), smoothstep(0.35, 0.85, d));
  col = mix(col, vec3(1.0, 0.8, 0.42), smoothstep(0.95, 1.45, d) * smoothstep(-0.15, 0.35, ny));

  // Warm haze hugging the bed, so the coals glow even between the tongues.
  vec3 haze = vec3(0.55, 0.14, 0.02) * exp(-abs(ny - 0.1) * 2.6) * bed * rise * 0.45 * min(uIntensity, 1.3);
  col = col * a + haze * (1.0 - a);
  // Premultiplied with alpha = brightest channel: equals screen(backdrop, col) once blended.
  gl_FragColor = vec4(col, col.r);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export class FireRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: WebGLRenderingContext;
  private readonly uRes: WebGLUniformLocation | null;
  private readonly uTime: WebGLUniformLocation | null;
  private readonly uIntensity: WebGLUniformLocation | null;
  private readonly uBase: WebGLUniformLocation | null;
  private cleared = false;

  private constructor(
    canvas: HTMLCanvasElement,
    gl: WebGLRenderingContext,
    private readonly program: WebGLProgram,
    private readonly buffer: WebGLBuffer | null,
    private readonly state: FireState,
    private readonly resolution: number
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.uRes = gl.getUniformLocation(program, 'uRes');
    this.uTime = gl.getUniformLocation(program, 'uTime');
    this.uIntensity = gl.getUniformLocation(program, 'uIntensity');
    this.uBase = gl.getUniformLocation(program, 'uBase');
    this.resize();
  }

  /** Returns null when WebGL is unavailable so callers can keep the CSS glow fallback. */
  static create(canvas: HTMLCanvasElement, state: FireState, resolution: number): FireRenderer | null {
    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'low-power',
    });
    if (!gl || gl.isContextLost()) return null;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    return new FireRenderer(canvas, gl, program, buffer, state, resolution);
  }

  resize() {
    const width = Math.max(1, Math.round(this.canvas.clientWidth * this.resolution));
    const height = Math.max(1, Math.round(this.canvas.clientHeight * this.resolution));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
    this.cleared = false;
  }

  render(timeSeconds: number) {
    const { gl, state } = this;
    if (state.intensity <= 0.01) {
      if (!this.cleared) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.cleared = true;
      }
      return;
    }
    this.cleared = false;
    gl.uniform2f(this.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uTime, timeSeconds);
    gl.uniform1f(this.uIntensity, state.intensity);
    const aspect = this.canvas.width / this.canvas.height;
    gl.uniform4f(this.uBase, state.x, state.y, state.halfWidth * aspect, state.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Frees GPU resources but keeps the context: the same canvas may host a new renderer later. */
  destroy() {
    const { gl } = this;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.deleteBuffer(this.buffer);
    gl.deleteProgram(this.program);
  }
}
