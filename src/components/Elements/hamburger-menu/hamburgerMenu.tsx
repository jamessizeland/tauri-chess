import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from 'utils';

interface Props {
  children: React.ReactNode;
}

interface LinkProps extends Props {
  href: string;
}

interface HamburgerMenuProps extends React.HTMLAttributes<HTMLElement> {
  textColor?: string;
  bgColor?: string;
  children: React.ReactNode;
}

interface HamburgerCollapseProps extends Props {
  open: boolean;
}

interface HamburgerTogglerProps {
  toggle: () => void;
}

const ngClass = {
  nav: `block pl-0 mb-0`,
  hamburger: `font-light shadow py-2 px-4`,
  collapse: `transition-height ease duration-300`,
  toggler: `float-right pt-1.5 text-3xl focus:outline-none focus:shadow`,
  link: `block cursor-pointer py-1.5 px-4  hover:text-gray-300 font-medium`,
  brand: `inline-block pt-1.5 pb-1.5 mr-4 cursor-pointer text-2xl font-bold whitespace-nowrap hover:text-gray-400`,
};

function HamburgerMenu({ children, bgColor, textColor }: HamburgerMenuProps) {
  return (
    <nav className={cn(bgColor, textColor, ngClass.hamburger)}>{children}</nav>
  );
}

/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
function HamburgerMenuBrand({ children, href }: LinkProps) {
  return (
    <a href={href} className={ngClass.brand}>
      <strong>{children}</strong>
    </a>
  );
}

function HamburgerMenuToggler({ toggle }: HamburgerTogglerProps) {
  return (
    <button
      type="button"
      aria-expanded="false"
      aria-label="Toggle navigation"
      className={ngClass.toggler}
      onClick={toggle}
    >
      &#8801;
    </button>
  );
}

function HamburgerMenuCollapse({ open, children }: HamburgerCollapseProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const inlineStyle: React.CSSProperties = open
    ? { height: ref.current?.scrollHeight }
    : { height: 0, visibility: 'hidden', opacity: 0 };

  return (
    <div className={ngClass.collapse} style={inlineStyle} ref={ref}>
      {children}
    </div>
  );
}

function HamburgerMenuNav({ children }: Props) {
  return <ul className={ngClass.nav}>{children}</ul>;
}

function HamburgerMenuItem({ children }: Props) {
  return <li>{children}</li>;
}

/* You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby */
function HamburgerMenuLink({ children, href }: LinkProps) {
  return (
    <Link to={href} className={ngClass.link}>
      {children}
    </Link>
  );
}

export {
  HamburgerMenu,
  HamburgerMenuBrand,
  HamburgerMenuToggler,
  HamburgerMenuCollapse,
  HamburgerMenuNav,
  HamburgerMenuItem,
  HamburgerMenuLink,
};
