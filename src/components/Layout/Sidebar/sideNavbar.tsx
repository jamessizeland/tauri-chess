// https://dev.to/fayaz/making-a-navigation-drawer-sliding-sidebar-with-tailwindcss-blueprint-581l
import SidenavItems from './items';
import { useToggle } from '../helpers/context';
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from 'components/Elements';
import Logo from '../Logo';

const SideNavigation = ({ version }: { version: string }) => {
  const { open, toggle } = useToggle();

  return (
    <Drawer isOpen={open} toggle={toggle} position="right">
      <DrawerHeader>
        <Logo className="inline mr-3" />
        <p className="inline">Chess</p>
      </DrawerHeader>
      <DrawerBody>
        <ul className="md:pl-6">
          <SidenavItems />
        </ul>
      </DrawerBody>
      <DrawerFooter>Version: {version}</DrawerFooter>
    </Drawer>
  );
};

export default SideNavigation;
