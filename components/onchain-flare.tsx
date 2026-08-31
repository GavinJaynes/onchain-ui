"use client";

import { useEffect, useRef } from "react";
import type { Frame } from "vgpu";

const FLARE_SHADER = /* wgsl */ `
struct FlareParams {
  resolution: vec2f,
  light: vec2f,
  logoCenter: vec2f,
  time: f32,
  pointerStrength: f32,
}

@group(0) @binding(0) var<uniform> params: FlareParams;

fn sdSegment(point: vec2f, start: vec2f, end: vec2f) -> f32 {
  let relative = point - start;
  let segment = end - start;
  let projection = clamp(dot(relative, segment) / dot(segment, segment), 0.0, 1.0);
  return length(relative - segment * projection);
}

fn logoField(uv: vec2f) -> vec3f {
  let safeHeight = max(params.resolution.y, 1.0);
  let aspect = params.resolution.x / safeHeight;
  let logoScale = min(1.0, aspect / 0.95);
  var point = uv - params.logoCenter;
  point.x *= aspect;
  point /= logoScale;

  let top = vec2f(0.0, -0.31);
  let left = vec2f(-0.295, 0.245);
  let right = vec2f(0.295, 0.245);
  let triangleDistance = min(
    sdSegment(point, top, left),
    min(sdSegment(point, left, right), sdSegment(point, right, top))
  );

  let networkStart = vec2f(-0.105, 0.075);
  let networkEnd = vec2f(0.105, 0.075);
  let networkDistance = sdSegment(point, networkStart, networkEnd);
  let nodeDistance = min(distance(point, networkStart), distance(point, networkEnd));

  let pixel = 1.0 / safeHeight;
  let triangle = 1.0 - smoothstep(0.010, 0.010 + pixel * 2.0, triangleDistance);
  let network = 1.0 - smoothstep(0.007, 0.007 + pixel * 2.0, networkDistance);
  let nodes = 1.0 - smoothstep(0.020, 0.020 + pixel * 2.0, nodeDistance);
  let mark = max(triangle, max(network, nodes));

  let innerTriangle = min(
    sdSegment(point, top * 0.94, left * 0.94),
    min(
      sdSegment(point, left * 0.94, right * 0.94),
      sdSegment(point, right * 0.94, top * 0.94)
    )
  );
  let bevel = (1.0 - smoothstep(0.012, 0.042, innerTriangle)) * (1.0 - mark);

  return vec3f(mark, bevel, max(network, nodes));
}

fn hash(point: vec2f) -> f32 {
  return fract(sin(dot(point, vec2f(127.1, 311.7))) * 43758.5453123);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene = logoField(uv);
  let aspect = vec2f(params.resolution.x / max(params.resolution.y, 1.0), 1.0);
  let rayDirection = uv - params.light;
  let rayStep = rayDirection * (0.88 / 38.0);
  let jitter = hash(floor(uv * params.resolution) + vec2f(params.time * 17.0));
  var sampleUv = uv - rayStep * jitter;
  var rays = 0.0;
  var energy = 1.0;
  var energySum = 0.0;

  for (var index = 0; index < 38; index += 1) {
    sampleUv -= rayStep;
    let sampleMask = logoField(sampleUv).x;
    rays += sampleMask * energy;
    energySum += energy;
    energy *= 0.94;
  }
  rays = rays / max(energySum, 0.001) * 2.2;

  let lightDelta = (uv - params.light) * aspect;
  let halo = exp(-dot(lightDelta, lightDelta) / 0.035);
  let centerDelta = (uv - params.logoCenter) * aspect;
  let vignette = smoothstep(1.65, 0.28, length(centerDelta));
  let breath = 0.78 + 0.22 * sin(params.time * 0.72);
  let interaction = mix(breath, 1.12, params.pointerStrength);

  let ultraviolet = vec3f(0.35, 0.22, 1.0);
  let electricBlue = vec3f(0.08, 0.62, 1.0);
  let flareColor = mix(ultraviolet, electricBlue, clamp(uv.y + halo * 0.35, 0.0, 1.0));

  var radiance = flareColor * rays * 1.25 * interaction;
  radiance += flareColor * halo * (scene.x + scene.y * 0.35) * 1.65;
  radiance += mix(vec3f(0.72, 0.82, 1.0), vec3f(1.0), scene.z) * scene.x * 1.7;
  radiance += ultraviolet * scene.y * 0.2;

  let gridUv = abs(fract((uv - 0.5) * params.resolution / 36.0) - 0.5);
  let gridLine = 1.0 - smoothstep(0.47, 0.5, max(gridUv.x, gridUv.y));
  let grid = gridLine * 0.012 * smoothstep(0.8, 0.1, length(centerDelta));
  let grain = (hash(floor(uv * params.resolution) + params.time) - 0.5) * 0.018;
  let background = vec3f(0.006, 0.008, 0.018) + vec3f(0.13, 0.11, 0.32) * grid;
  let color = vec3f(1.0) - exp(-radiance * vignette * 1.3);

  return vec4f(clamp(background + color + grain * smoothstep(0.0, 0.12, rays), vec3f(0.0), vec3f(1.0)), 1.0);
}
`;

export function OnchainFlare() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !("gpu" in navigator)) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const { effect, frame, frameLoop, init, surface } = await import("vgpu");
      if (disposed) return;

      const gpu = await init({ label: "onchain-ui-flare" });
      if (disposed) {
        gpu.dispose();
        return;
      }

      const output = surface(gpu, canvas, {
        alphaMode: "opaque",
        clearColor: [0.006, 0.008, 0.018, 1],
        dpr: [1, 1.5],
        label: "onchain-ui-flare-surface",
      });
      const shader = effect(gpu, FLARE_SHADER, {
        label: "onchain-ui-flare-effect",
      });
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let pointer: readonly [number, number] | undefined;
      const light: [number, number] = [0.28, 0.33];
      let pointerStrength = 0;
      const startedAt = performance.now();

      const handlePointerMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer = [
          Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
          Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
        ];
      };
      const handlePointerLeave = () => {
        pointer = undefined;
      };

      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerleave", handlePointerLeave);
      canvas.addEventListener("pointercancel", handlePointerLeave);

      const render = (renderFrame: Frame) => {
        const time = (performance.now() - startedAt) / 1000;
        const aspect = canvas.width / Math.max(canvas.height, 1);
        const logoCenter: readonly [number, number] =
          aspect > 1.05 ? [0.74, 0.5] : [0.5, 0.22];
        const target: readonly [number, number] = pointer ?? [
          logoCenter[0] + Math.cos(time * 0.34) * 0.27,
          logoCenter[1] + Math.sin(time * 0.27) * 0.22,
        ];
        light[0] += (target[0] - light[0]) * 0.075;
        light[1] += (target[1] - light[1]) * 0.075;
        pointerStrength += ((pointer ? 1 : 0) - pointerStrength) * 0.08;
        shader.set({
          params: {
            resolution: [canvas.width, canvas.height],
            light,
            logoCenter,
            time,
            pointerStrength,
          },
        });
        renderFrame.pass(output, shader);
        container.dataset.ready = "true";
      };

      if (reducedMotion) {
        frame(gpu, render);
      } else {
        const loop = frameLoop(gpu, render, { fps: 30 });
        cleanup = () => loop.stop();
      }

      cleanup = (() => {
        const stopLoop = cleanup;
        return () => {
          stopLoop();
          canvas.removeEventListener("pointermove", handlePointerMove);
          canvas.removeEventListener("pointerleave", handlePointerLeave);
          canvas.removeEventListener("pointercancel", handlePointerLeave);
          gpu.dispose();
        };
      })();
    };

    void start().catch(() => {
      container.dataset.failed = "true";
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="group absolute inset-0 overflow-hidden bg-[#02030a]"
      role="img"
      aria-label="Interactive onchain-ui logo rendered with a WebGPU shader"
    >
      <svg
        viewBox="0 0 640 512"
        aria-hidden="true"
        className="absolute top-[22%] left-1/2 w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-60 transition-opacity duration-700 group-data-[ready=true]:opacity-0 lg:top-1/2 lg:right-[2%] lg:left-auto lg:w-[48%] lg:translate-x-0"
      >
        <defs>
          <filter id="fallback-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="fallback-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#fallback-stroke)" filter="url(#fallback-glow)">
          <path d="M320 56 535 430H105L320 56Z" strokeWidth="14" />
          <path d="M248 316h144" strokeWidth="12" strokeLinecap="round" />
          <circle cx="248" cy="316" r="14" fill="#c4b5fd" stroke="none" />
          <circle cx="392" cy="316" r="14" fill="#7dd3fc" stroke="none" />
        </g>
      </svg>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block size-full touch-none opacity-0 transition-opacity duration-700 group-data-[ready=true]:opacity-100"
      />
    </div>
  );
}
