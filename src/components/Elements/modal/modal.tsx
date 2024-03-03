import { useEffect, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from 'utils';

interface Props {
  children: ReactNode;
}

interface ModalProps extends Props {
  isOpen: boolean;
  position?: 'default' | 'large' | 'extraLarge';
  toggle: (isOpen?: boolean) => void;
  closeOnClickOutside?: boolean;
  animate?: boolean;
}

const ngClass = {
  animate: 'animate-backInDown',
  body: `flex-shrink flex-grow p-4`,
  headerTitle: `text-2xl md:text-3xl font-light`,
  header: `items-start justify-between p-4 border-b border-gray-300`,
  container: `fixed top-0 left-0 z-40 w-full h-full m-0 overflow-y-auto`,
  overlay: `fixed top-0 left-0 z-30 w-screen h-screen backdrop-blur-sm`,
  footer: `flex flex-wrap items-center justify-end p-3 border-t border-gray-300`,
  content: {
    default: `relative flex flex-col bg-white pointer-events-auto shadow-primary shadow-md`,
  },
  orientation: {
    default:
      'mt-5 mx-8 pb-0 md:m-auto md:w-6/12 lg:w-4/12 md:pt-0 focus:outline-none rounded-lg',
    large:
      'mt-5 mx-8 pb-0 md:m-auto md:w-8/12 lg:w-8/12 md:pt-0 focus:outline-none rounded-lg',
    extraLarge:
      'mt-5 mx-8 pb-0 md:w-12/12 md:pt-0 focus:outline-none rounded-lg',
  },
};

function Modal({
  isOpen,
  toggle,
  children,
  animate = false,
  closeOnClickOutside = false,
  position = 'default',
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  // close modal when you click outside the modal dialogue
  useEffect(() => {
    const handleOutsideClick = (event: globalThis.MouseEvent) => {
      if (closeOnClickOutside && !ref.current?.contains(event.target as Node)) {
        if (!isOpen) return;
        toggle(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [closeOnClickOutside, isOpen, ref, toggle]);

  // close modal when you click on "ESC" key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        toggle(false);
      }
    };
    document.addEventListener('keyup', handleEscape);
    return () => document.removeEventListener('keyup', handleEscape);
  }, [isOpen, toggle]);

  // Put focus on modal dialogue, hide scrollbar and prevent body from moving when modal is open
  useEffect(() => {
    if (!isOpen) return;

    ref.current?.focus();

    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    html.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, [isOpen]);

  return (
    <>
      {createPortal(
        isOpen && (
          <>
            <div className={ngClass.overlay} />
            <div className={cn(ngClass.container)}>
              <div
                className={ngClass.orientation[position]}
                ref={closeOnClickOutside ? ref : null}
                role="alertdialog"
                aria-modal={true}
              >
                <div
                  className={cn(
                    ngClass.orientation[position],
                    ngClass.content.default,
                    animate ? ngClass.animate : '',
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
          </>
        ),
        document.body,
      )}
    </>
  );
}

function ModalHeader({ children }: Props) {
  return (
    <div className={ngClass.header}>
      <h4 className={ngClass.headerTitle}>{children}</h4>
    </div>
  );
}

function ModalBody({ children }: Props) {
  return <div className={ngClass.body}>{children}</div>;
}

function ModalFooter({ children }: Props) {
  return <div className={ngClass.footer}>{children}</div>;
}

export { Modal, ModalHeader, ModalBody, ModalFooter };
