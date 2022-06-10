/**
 *  Inspired by code from https://github.com/bchiang7/v4 converted to typeScript and tidied up.
 * This hook will observe the direction the page is being scrolled, to (i.e.) show or hide a Navbar.
 * */

import { useState, useEffect } from 'react';

type ScrollDir = 'up' | 'down';

interface IScrollDir {
  initialDirection?: ScrollDir;
  thresholdPixels?: number;
  watchScroll?: boolean;
}

const useScrollDirection = ({
  initialDirection = 'down',
  thresholdPixels = 0,
  watchScroll = true,
}: IScrollDir) => {
  const [scrollDir, setScrollDir] = useState<ScrollDir>(initialDirection);

  useEffect(() => {
    let lastScrollY: number = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < thresholdPixels) {
        // We haven't exceeded the threshold
        ticking = false;
        return;
      }

      setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    if (watchScroll) {
      // Bind the scroll handler if `watchScroll` is set to true.
      window.addEventListener('scroll', onScroll);
    } else {
      // If `watchScroll` is set to false reset the scroll direction.
      setScrollDir(initialDirection);
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, [initialDirection, thresholdPixels, watchScroll]);

  return scrollDir;
};

export default useScrollDirection;
