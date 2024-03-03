import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from 'utils';

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
  className?: string;
}

const ngClass = {
  navbar: 'font-light h-16 relative flex items-center flex-row justify-start',
  brand: `inline-block cursor-pointer pl-1`,
  active: `text-purple-800`,
  toggler: `ml-auto flex lg:hidden px-3 py-3 text-5xl focus:outline-none focus:shadow rounded transition-colors hover:text-black border border-white hover:border-black`,
  link: `cursor-pointer px-4 text-gray-900 hover:text-black font-medium`,
  position: {
    center: `flex pl-0 mb-0 mx-auto pr-8 lg:hidden`,
    left: `hidden lg:pl-0 lg:mb-0 lg:mr-auto md:flex`,
    right: `hidden lg:pl-0 lg:mb-0 lg:ml-auto lg:flex`,
  },
};

function Navbar({ children, className }: INavbarProps) {
  return <nav className={cn(className, ngClass.navbar)}>{children}</nav>;
}

// ! You can wrap the a tag with Link and pass href to Link if you are using either Create-React-App, Next.js or Gatsby
function NavbarBrand({ children, href }: INavbarBrandProps) {
  return (
    <Link to={href} className={ngClass.brand}>
      <strong>{children}</strong>
    </Link>
  );
}

function NavbarToggler({ toggle }: { toggle: () => void }) {
  return (
    <button className={ngClass.toggler} onClick={toggle}>
      <svg
        className="h-3 w-3 fill-current"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
      </svg>
    </button>
  );
}

function NavbarNav({ children, position = 'right' }: INavbarNavProps) {
  return <ul className={ngClass.position[position]}>{children}</ul>;
}

function NavbarItem({ children }: Props) {
  return <li>{children}</li>;
}

function NavbarLink({
  children,
  href,
  active,
  external,
  className,
  ...props
}: INavbarLinkProps) {
  return (
    <div className={ngClass.link}>
      {external ? (
        <a className="flex" {...props} href={href}>
          {children}
        </a>
      ) : (
        <Link to={href} className={cn('flex', className)} {...props}>
          {children}
        </Link>
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
