import React, { useEffect } from 'react';
import clsx from 'clsx';
import debounce from 'debounce';
import {
  Navbar,
  NavbarBrand,
  NavbarItem,
  NavbarToggler,
  NavbarLink,
  NavbarNav,
} from 'components/Elements';
import { useToggle } from '../helpers/context';
import Logo from '../Logo';
import { routes } from 'routes';
import { useScrollDirection } from 'hooks';

function Header(): JSX.Element {
  const { toggle } = useToggle();
  const scrollDirection = useScrollDirection({
    initialDirection: 'up', // this is so the navbar is present on page load
    thresholdPixels: 50, // this means we need to move a certain speed before the nav displays
  });

  useEffect(() => {
    console.log(scrollDirection);
  }, [scrollDirection]);

  return (
    <header
      className={clsx(
        scrollDirection === 'up' ? 'translate-y-0' : '-translate-y-20',
        'transition ease-in-out duration-500',
        'z fixed z-10 top-0 w-full font-inter bg-white lg:fixed lg:px-container',
        'shadow-sm shadow-slate-500',
      )}
    >
      <Navbar className={clsx('bg-gradient-to-r from-blue-500 to-primary')}>
        <NavbarBrand href="/">
          <Logo />
        </NavbarBrand>
        <NavbarNav position="right">
          {routes.map(({ title, path }) => {
            return (
              <NavbarItem key={title + path}>
                <NavbarLink href={path}>
                  <span className="pl-1">{title}</span>
                </NavbarLink>
              </NavbarItem>
            );
          })}
        </NavbarNav>
        <NavbarToggler toggle={debounce(toggle, 10)} />
      </Navbar>
    </header>
  );
}

export default Header;
