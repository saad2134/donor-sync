//@ts-nocheck

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface ShaderPlaneProps {
  vertexShader: string;
  fragmentShader: string;
  uniforms: { [key: string]: { value: unknown } };
}

const ShaderPlane = ({
  vertexShader,
  fragmentShader,
  uniforms,
}: ShaderPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetPos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetPos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime * 0.5;
      material.uniforms.u_resolution.value.set(size.width, size.height, 1.0);

      const lerpFactor = 0.025;
      mousePos.current.x +=
        (targetPos.current.x - mousePos.current.x) * lerpFactor;
      mousePos.current.y +=
        (targetPos.current.y - mousePos.current.y) * lerpFactor;
      material.uniforms.u_mouse.value.set(
        mousePos.current.x,
        mousePos.current.y,
        0.0,
        0.0,
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.FrontSide}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

interface ShaderBackgroundProps {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: { [key: string]: { value: unknown } };
  className?: string;
  color?: string;
}

const Shader3 = ({
  vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
    gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader = `
    precision highp float;
    const float CIRCLE_SCALE = 1.0;

    varying vec2 vUv;
    uniform float u_time;
    uniform vec3 u_resolution;
    uniform vec4 u_mouse;
    uniform vec3 u_color;
    uniform float u_theme_dark;
    uniform sampler2D u_channel0;

    #define R u_resolution
    #define PI 3.141528

    const float refractIndex = 0.3;

    vec3 hsv(float h,float s,float v){return ((clamp(abs(fract(h+vec3(0.,.666,.333))*6.-3.)-1.,0.,1.)-1.)*s+1.)*v;}
    vec3 rgb2hsv(vec3 c){
      vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0*d + e)), d / (q.x + e), q.x);
    }

    float map(float val, float inA, float inB, float outA, float outB) {
      return (val - inA) / (inB - inA) * (outB - outA) + outA;
    }

    float fresnel(vec3 direction, vec3 normal, float power, bool invert) {
        vec3 halfDirection = normalize( normal + direction );
        float cosine = dot( halfDirection, direction );
        float product = max( cosine, 0.0 );
        float factor = invert ? 1.0 - pow( product, power ) : pow( product, power );
        return factor;
    }
    vec4 remapShadows(vec4 color) {
      float factor = 10.;
      return vec4(
        pow(color.x, factor),
        pow(color.y, factor),
        pow(color.z, factor),
        color.w
      );
    }
    float specular(vec3 eyeVector, vec3 worldNormal, vec3 light, float shininess, float diffuseness) {
      vec3 normal = worldNormal;
      vec3 lightVector = normalize(-light);
      vec3 halfVector = normalize(eyeVector + lightVector);
      float NdotL = dot(normal, lightVector);
      float NdotH =  dot(normal, halfVector);
      float kDiffuse = max(0.0, NdotL);
      float NdotH2 = NdotH * NdotH;
      float kSpecular = pow(NdotH2, shininess);
      return kSpecular + kDiffuse * diffuseness;
    }

    vec4 sampleBackground(vec3 normal, sampler2D bg) {
      float phi = acos(normal.y);
      float sinPhi = sin(phi);
      float theta =
        abs(sinPhi) > 0.0001
          ? acos(normal.x / sinPhi)
          : 0.;
      vec2 coord = vec2(
        map(theta, 0., PI, 0., 1.),
        map(phi, 0., PI, 1., 0.)
      );

      return texture(bg, coord);
    }

    float lambert(vec3 normal, vec3 lightPos){
      return max(dot(normal, lightPos), 0.05);
    }

    float hash12(vec2 p)
    {
      vec3 p3  = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    vec2 globalPos(vec2 pos){
        vec2 mover = u_mouse.xy * 0.25;
        return pos-mover + hash12(gl_FragCoord.xy + u_time * 0.1)*.0125;
    }

    float circle(vec2 pos,float lo, float hi){
        return smoothstep(lo,hi,length(globalPos(pos)));
    }

    vec3 gradient(float d){
        float a = smoothstep(0.0, 1.0, d);
        vec3 colA = mix(vec3(0.05,0.05,0.05),vec3(.4,.6,.6),smoothstep(0.05,0.05,0.05) * d);
        vec3 colB = mix(u_color * 0.06, u_color * 0.9, a);
        return mix(colA, colB, d);
    }

    vec3 coloredRim(vec2 pos, float lamVal) {
        float rimRadius = 0.035 * CIRCLE_SCALE + lamVal * 0.05 * CIRCLE_SCALE;
        float innerRadius = 0.03 * CIRCLE_SCALE + lamVal * 0.025 * CIRCLE_SCALE;
        float dist = length(globalPos(pos));

        float rimMask = smoothstep(innerRadius, rimRadius, dist) * (1.0 - smoothstep(rimRadius, rimRadius + 0.05, dist));

        vec3 hsvColor = rgb2hsv(u_color);
        float baseHue = hsvColor.x;
        float sat = hsvColor.y;
        float hue = baseHue + dist * 2.0;
        vec3 rimColor = hsv(hue, sat, 1.0);

        return rimColor * rimMask;
    }

    float sdfCircle(vec2 pos, float r) {
        return length(globalPos(pos)) - r;
    }
    vec2 sdfNormal(vec2 pos, float r) {
        vec2 e = vec2(1.0/R.x, 1.0/R.y) * 1.5;
        float dx = sdfCircle(pos + vec2(e.x, 0.0), r) - sdfCircle(pos - vec2(e.x, 0.0), r);
        float dy = sdfCircle(pos + vec2(0.0, e.y), r) - sdfCircle(pos - vec2(0.0, e.y), r);
        vec2 n = normalize(vec2(dx, dy));
        return n;
    }
    vec3 shadeAt(vec2 pos, float lamVal) {
        float dLocal = 1. - circle(pos, 0.05 * CIRCLE_SCALE, .3 * CIRCLE_SCALE + lamVal * 0.025 * CIRCLE_SCALE);
        return gradient(dLocal);
    }
    vec3 refractSDFColor(vec2 pos, float lamVal) {
    float shiftPxR = 2.0;
    float shiftPxG = 0.0;
    float shiftPxB = -2.0;

    float r = 0.175 * CIRCLE_SCALE + lamVal * 0.6125 * CIRCLE_SCALE;
    vec2 n2 = normalize(sdfNormal(pos, r));

    vec2 px = 1.0 / R.xy;
    vec3 cR = shadeAt(pos + n2 * px * shiftPxR, lamVal);
    vec3 cG = shadeAt(pos + n2 * px * shiftPxG, lamVal);
    vec3 cB = shadeAt(pos + n2 * px * shiftPxB, lamVal);
    return vec3(cR.r, cG.g, cB.b);
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2 uv = fragCoord / R.xy;
        vec2 p = (fragCoord/R.xy-.5)*vec2(R.x/R.y,1.)*2.;

        float angle = PI / 4.0;
        float cosA = cos(angle);
        float sinA = sin(angle);
        vec2 rotatedP = vec2(
            p.x * cosA - p.y * sinA,
            p.x * sinA + p.y * cosA
        );

        vec3 rd = vec3(0.0, 0.0, -1.0);
        float rod_x = fract(rotatedP.x * 2.) * 2.0 - 1.0;
        float rod_z = sqrt(1.0 - rod_x*rod_x);
        vec3 n = vec3(rod_x, 0.0, -rod_z);

        vec3 refracted_ray = mix(n, rd, refractIndex);
        float dist = 0.8;
        float z_dist = dist / (refracted_ray.z  - 0.8);
        vec3 pos = vec3(p, 0.0) + z_dist*refracted_ray;
        vec2 subPos = vec2(pos.xy * pos.z);

        vec3 lpos = normalize(vec3(0., 0., -1.0));
        vec3 lcol = vec3(1.);
        float lambert = pow(lambert(n,lpos),2.);
        vec3 reflectedDir = normalize(reflect(rd, n));
        float fresnel = fresnel(rd, n, 8.,true);
        float fresnelStrength = 0.595;

        float d = 1.-circle(subPos,0.05 * CIRCLE_SCALE,.3 * CIRCLE_SCALE + lambert * 0.0125 *CIRCLE_SCALE);
        vec3 color = gradient(d);

        vec3 rimColor = coloredRim(subPos, lambert);
        color += rimColor * 0.65;

        float g = 1.0 - abs(n.z);
        g = g * 0.8 / (g * 0.8 - g + 1.0);
        float glass = 1.-((1.0 - 0.3 * g) - g * hash12(gl_FragCoord.xy + d));
        vec3 refrCol = refractSDFColor(subPos, lambert);
        color = mix(color, refrCol, 0.65);
        color += lambert * color * 0.05 * d;
        color += color * glass * d * 0.05;
        color = clamp(color,0.,1.);

        color = pow(color,vec3(1./1.222));

        fragColor = vec4(vec3(color),1.0);
    }

    void main() {
      vec4 fragColor;
      vec2 fragCoord = vUv * u_resolution.xy;
      mainImage(fragColor, fragCoord);
      gl_FragColor = fragColor;
    }
  `,
  uniforms = {},
  className,
  color = "#bbffcc",
}: ShaderBackgroundProps) => {
  const { resolvedTheme } = useTheme();
  const uniformsRef = useRef(uniforms);
  
  const getPrimaryColor = () => {
    const root = document.documentElement;
    const hsl = getComputedStyle(root).getPropertyValue('--primary').trim();
    if (hsl) {
      const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
      return new THREE.Color().setHSL(h / 360, s / 100, l / 100);
    }
    return new THREE.Color(color);
  };

  const shaderUniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector3(1, 1, 1) },
      u_mouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      u_color: { value: getPrimaryColor() },
      u_theme_dark: { value: resolvedTheme === 'dark' ? 1.0 : 0.0 },
      ...uniforms,
    }),
    [uniforms, color, resolvedTheme],
  );

  uniformsRef.current = shaderUniforms;

  useEffect(() => {
    const themeColor = getPrimaryColor();
    uniformsRef.current.u_color.value = themeColor;
    uniformsRef.current.u_theme_dark.value = resolvedTheme === 'dark' ? 1.0 : 0.0;
  }, [resolvedTheme]);

  return (
    <section className={cn(className, "absolute inset-0 w-full h-screen")}>
      <Canvas>
        <ShaderPlane
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={shaderUniforms}
        />
      </Canvas>
    </section>
  );
};

export { Shader3 };
