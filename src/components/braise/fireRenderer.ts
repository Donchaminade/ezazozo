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
  if (abs(nx) > 1.3 || ny < -0.35 || ny > 1.7) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float t = uTime;
  float edge = 1.0 - smoothstep(0.55, 1.2, abs(nx));
  float tongues = fbm(vec2(p.x * 3.2, t * 0.45));
  float warp = fbm(vec2(p.x * 6.5, p.y * 4.5 - t * 2.1));
  float detail = fbm(vec2(p.x * 15.0 + warp * 2.5, p.y * 10.0 - t * 3.9));

  float top = (0.25 + 1.05 * tongues * tongues * 1.6) * edge;
  float f = (top - ny) / max(top, 0.08);
  f += (warp - 0.5) * 0.95 + (detail - 0.5) * 0.55;
  f = clamp(f * uIntensity, 0.0, 1.25);

  float a = smoothstep(0.12, 0.55, f);
  vec3 col = mix(vec3(0.45, 0.03, 0.0), vec3(1.0, 0.33, 0.03), smoothstep(0.15, 0.6, f));
  col = mix(col, vec3(1.0, 0.78, 0.38), smoothstep(0.72, 1.1, f));

  float glow = exp(-max(ny + 0.1, 0.0) * 2.6) * edge * 0.32 * min(uIntensity, 1.2);
  col = col * a + vec3(1.0, 0.27, 0.04) * glow * (1.0 - a);
  a = max(a, glow * 0.75);
  gl_FragColor = vec4(col, a);
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
