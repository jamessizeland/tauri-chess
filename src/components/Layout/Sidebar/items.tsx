import { routes } from 'routes';
import { NavbarLink, NavbarItem } from 'components/Elements';
import { useLocation } from 'react-router-dom';

const SidenavItems = () => {
  const { pathname } = useLocation();
  return (
    <ul className="md:pl-6 flex flex-col">
      {routes.map(({ title, path }) => {
        return (
          <NavbarItem key={title + path}>
            <NavbarLink
              href={path}
              className={`btn mb-4 ${pathname === path ? 'btn-primary' : 'btn-outline'}`}
            >
              <span className="pl-1 text-black">{title}</span>
            </NavbarLink>
          </NavbarItem>
        );
      })}
    </ul>
  );
};

export default SidenavItems;
