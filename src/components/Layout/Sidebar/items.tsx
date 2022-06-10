import React from 'react';
import { routes } from 'routes';
import { NavbarLink, NavbarItem } from 'components/Elements';

// const style = {
//   link: `flex font-medium items-center justify-start my-1 p-3 text-sm w-full lg:hover:text-purple-800`,
//   active: `text-purple-800 lg:hover:text-purple-800`,
//   inactive: `text-gray-900 lg:hover:text-black`,
//   section: `font-bold pl-6 pb-3 text-gray-500 uppercase`,
// };

const SidenavItems = () => {
  // const { asPath } = useRouter();
  return (
    <ul>
      {/* {routes.map(({ title, path }) => (
        <a href={path} key={title} className={style.link}>
          <span className="mx-4">{title}</span>
        </a>
      ))} */}
      {routes.map(({ title, path }) => {
        return (
          <NavbarItem key={title + path}>
            <NavbarLink href={path}>
              <span className="pl-1">{title}</span>
            </NavbarLink>
          </NavbarItem>
        );
      })}
    </ul>
  );
};

export default SidenavItems;
