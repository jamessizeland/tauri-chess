import React from 'react';
import logo from 'assets/tauri.svg';
import clsx from 'clsx';

interface Props {
  className?: string;
  height?: number;
  width?: number;
  altText?: string;
}

const Logo = ({
  className = '',
  height = 30,
  width = 30,
  altText = 'logo',
}: Props): JSX.Element => {
  return (
    <img
      className={clsx(
        'hover:animate-twSpin hover:animate-infinite hover:animate-slow',
        'mx-2',
        className,
      )}
      src={logo}
      height={height}
      width={width}
      placeholder="blur"
      // objectFit="cover"
      alt={altText}
    />
  );
};

export default Logo;
