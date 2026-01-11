import { motion } from 'motion/react';

export function WaterDropletIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Main droplet shape */}
      <motion.path
        d="M12 2C8.5 6 6 9.5 6 13.5C6 17.64 8.86 21 12 21C15.14 21 18 17.64 18 13.5C18 9.5 15.5 6 12 2Z"
        fill="currentColor"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Orange accent line in center */}
      <motion.path
        d="M12 7C10.5 9.5 9.5 11.5 9.5 13.5C9.5 15.4 10.6 17 12 17C13.4 17 14.5 15.4 14.5 13.5C14.5 11.5 13.5 9.5 12 7Z"
        fill="#f97316"
        stroke="#f97316"
        strokeWidth="0.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Highlight for 3D effect */}
      <motion.ellipse
        cx="10.5"
        cy="11"
        rx="1.5"
        ry="2.5"
        fill="white"
        opacity="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      />
      
      {/* Small orange dot for center accent */}
      <motion.circle
        cx="12"
        cy="13.5"
        r="1"
        fill="#f97316"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, duration: 0.3, type: "spring", stiffness: 300 }}
      />
    </motion.svg>
  );
}