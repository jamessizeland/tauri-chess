import React, {
  useEffect,
  useRef,
  useContext,
  useState,
  useCallback,
  createContext,
  ReactNode,
} from 'react';

interface ContextProps {
  open: boolean;
  ref: any;
  toggle: () => void;
}
// create new context
const Context = createContext<ContextProps>({
  open: false,
  ref: null,
  toggle: () => null,
});

function LayoutProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>();
  // const router = useRouter();

  const toggle = useCallback(() => {
    console.log('sidebar toggle');

    setOpen(!open);
  }, [open]);

  // close side navigation when you click on a sidenav item. it's triggered when viewport is less than 1024px
  const closeSidenav = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  // close side navigation on click outside when viewport is less than 1024px
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (window.innerWidth < 1024) {
        if (!ref.current?.contains(event.target as Node)) {
          if (!open) return;
          setOpen(false);
        }
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [open, ref]);

  return (
    <Context.Provider value={{ open, ref, toggle }}>
      {children}
    </Context.Provider>
  );
}

// custom hook to consume all context values { open, ref, toggle }
function useToggle() {
  return useContext(Context);
}

export default LayoutProvider;

export { useToggle };
