import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  className?: string;
}

interface IconProps extends Props {
  viewBox: string;
  children: ReactNode;
}

const Icon = ({ className, viewBox, children }: IconProps) => (
  <div>
    <svg
      className={clsx(className, 'flex-no-shrink fill-current')}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  </div>
);

export { Icon };
