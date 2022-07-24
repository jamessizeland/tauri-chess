import React from 'react';
import { useToggle } from './context';

const style = {
  overlay: `fixed h-screen left-0 backdrop-blur-sm top-0 w-screen z-30 lg:hidden`,
};

// The overlay will only be visible on small screens to emphasize the focus on the side navigation when it is open.
const Overlay = () => {
  const { open } = useToggle();
  return <div className={open ? style.overlay : ''} />;
};

export default Overlay;
