declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';

declare module 'motion/react' {
  export const motion: any;
  export const AnimatePresence: any;
  export default motion;
}

declare module 'motion' {
  const m: any;
  export default m;
}

declare module '*.svg';

// Allow importing CSS modules or raw CSS files in TSX without types
declare module '*.css';
