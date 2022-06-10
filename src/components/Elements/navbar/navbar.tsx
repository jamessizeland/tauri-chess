import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  children: ReactNode;
}

interface INavbarProps extends Props {
  className?: string;
}

interface INavbarBrandProps extends Props {
  href: string;
}

interface INavbarNavProps extends Props {
  position?: 'left' | 'center' | 'right';
}

interface INavbarLinkProps extends INavbarBrandProps {
  active?: boolean;
  activeClass?: string;
  external?: boolean;
}

const style = {
  navbar: 'font-light h-16 relative flex items-center flex-row justify-start',
  brand: `inline-block cursor-pointer pl-1`,
  active: `text-purple-800`,
  toggler: `ml-auto flex lg:hidden pr-3 text-5xl focus:outline-none focus:shadow px-2`,
  link: `cursor-pointer px-4 text-gray-900 hover:text-black font-medium`,
  position: {
    center: `flex pl-0 mb-0 mx-auto pr-8 lg:hidden`,
    left: `hidden lg:pl-0 lg:mb-0 lg:mr-auto md:flex`,
    right: `hidden lg:pl-0 lg:mb-0 lg:ml-auto lg:flex`,
  },
};

function Navbar({ children, className }: INavbarProps) {
  return <nav className={clsx(className, style.navbar)}>{children}</nav>;
}

// ! You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby
function NavbarBrand({ children, href }: INavbarBrandProps) {
  return (
    <a href={href} className={style.brand}>
      <strong>{children}</strong>
    </a>
  );
}

function NavbarToggler({ toggle }: { toggle: () => void }) {
  return (
    <button
      // type="button"
      // aria-expanded="false"
      // aria-label="Toggle navigation"
      className={style.toggler}
      onClick={toggle}
    >
      &#8801;
    </button>
  );
}

function NavbarNav({ children, position = 'right' }: INavbarNavProps) {
  return <ul className={style.position[position]}>{children}</ul>;
}

function NavbarItem({ children }: Props) {
  return <li>{children}</li>;
}

//! You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby
function NavbarLink({
  children,
  href,
  active,
  external,
  ...props
}: INavbarLinkProps) {
  return (
    <div className={style.link}>
      {external ? (
        <a className="flex" {...props} href={href}>
          {children}
        </a>
      ) : (
        <a href={href} className="flex" {...props}>
          {children}
        </a>
      )}
    </div>
  );
}

export {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarItem,
  NavbarLink,
  NavbarToggler,
};
