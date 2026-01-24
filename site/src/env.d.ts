/// <reference types="astro/client" />
/// <reference types="vite/client" />

declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.glsl?raw' {
  const value: string;
  export default value;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mToonNodeMaterial: any;
    }
  }
}