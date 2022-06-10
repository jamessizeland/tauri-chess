import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarItem,
  NavbarLink,
  NavbarToggler,
} from '../..';

const NavbarVariantThree = (): JSX.Element => (
  <div className="mb-8">
    <Navbar className="text-gray-600 bg-white">
      <NavbarBrand href="#">
        <img
          src="https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png"
          alt="Next.js"
          className="w-9 h-9"
        />
      </NavbarBrand>
      <NavbarToggler toggle={() => console.log('toggled')} />
      <NavbarNav position="left">
        <NavbarItem>
          <NavbarLink href="#">Documentation</NavbarLink>
        </NavbarItem>
      </NavbarNav>
      <NavbarNav position="right">
        <NavbarItem>
          <NavbarLink href="#">Deployment</NavbarLink>
        </NavbarItem>
        <NavbarItem>
          <NavbarLink href="#">Basic Features</NavbarLink>
        </NavbarItem>
        <NavbarItem>
          <NavbarLink href="#">Advanced Features</NavbarLink>
        </NavbarItem>
      </NavbarNav>
    </Navbar>
  </div>
);

export default NavbarVariantThree;
