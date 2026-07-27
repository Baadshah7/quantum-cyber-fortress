export const buttonHoverVariants = {
  hover: (reducedMotion) => 
    reducedMotion 
      ? {} 
      : { y: -2, transition: { duration: 0.12, ease: 'easeOut' } },
  tap: (reducedMotion) => 
    reducedMotion 
      ? {} 
      : { y: 0, scale: 0.98, transition: { duration: 0.05 } }
};

export const cardHoverVariants = {
  hover: {
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
};
