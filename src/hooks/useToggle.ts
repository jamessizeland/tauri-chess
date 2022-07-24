import { useState } from 'react';

const useToggle = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = (isOpen?: boolean) => {
    setIsOpen(!isOpen);
  };
  return { toggle, isOpen };
};

export default useToggle;
