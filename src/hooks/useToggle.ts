import { useState } from 'react';

// const useToggle = () => {
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   const toggle = (isOpen?: boolean) => {
//     setIsOpen(!isOpen);
//   };
//   return { toggle, isOpen };
// };

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggleValue = (state?: boolean) => setValue(state ? state : !value);
  return [value, toggleValue] as const;
};

export default useToggle;
