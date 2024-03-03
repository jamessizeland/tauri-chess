import { cn } from 'utils';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import LayoutProvider from './helpers/context';
import Overlay from './helpers/overlay';
import SideNav from './Sidebar/sideNavbar';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';

type LayoutProps = {
  children: JSX.Element;
};

export function Layout({ children }: LayoutProps): JSX.Element {
  useEffect(() => {
    invoke<string>('get_version').then((version) => setVersion(version));
  }, []);

  const [version, setVersion] = useState<string>('');
  return (
    <LayoutProvider>
      <ToastContainer />
      <div className={cn('bg-gray-300', 'flex flex-col font-body items-start')}>
        <Overlay />
        <Header />
        <SideNav version={version} />
        <div className="flex flex-col pl-0 w-full h-screen justify-between">
          <main className="pt-24 pb-1 md:px-4 lg:px-6 lg:pl-2">{children}</main>
          <Footer />
        </div>
      </div>
    </LayoutProvider>
  );
}
