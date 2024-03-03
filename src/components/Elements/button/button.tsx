import React from 'react';
import { cn } from 'utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BtnPropsWithChildren {}

interface BtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BtnPropsWithChildren {
  block?: boolean;
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'indigo' | 'dark';
  disabled?: boolean;
  outline?: boolean;
  rounded?: boolean;
  size?: 'sm' | 'md' | 'lg';
  submit?: boolean;
}

type ButtonRef = React.ForwardedRef<HTMLButtonElement>;

const ngClass = {
  rounded: `rounded-full`,
  block: `flex justify-center w-full`,
  default: `text-white focus:outline-none shadow font-medium transition ease-in duration-200`,
  disabled: `opacity-60 cursor-not-allowed`,
  sizes: {
    sm: 'px-6 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-6 py-3 text-lg',
  },
  color: {
    primary: {
      bg: `bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:ring-offset-blue-200`,
      outline: `border-blue-700 border-2 text-blue-700 active:bg-blue-700 active:text-white`,
    },
    success: {
      bg: `bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-200`,
      outline: `border-green-700 border-2 text-green-700 active:bg-green-700 active:text-white`,
    },
    danger: {
      bg: `bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-600 focus:ring-offset-red-200`,
      outline: `border-red-600 border-2 text-red-600 active:bg-red-600 active:text-white`,
    },
    dark: {
      bg: `bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 focus:ring-offset-gray-200`,
      outline: `border-black border-2 text-gray-900 active:bg-black active:text-white`,
    },
    warning: {
      bg: `bg-yellow-500 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-yellow-200`,
      outline: `border-yellow-500 border-2 text-yellow-500 active:bg-yellow-500 active:text-white`,
    },
    indigo: {
      bg: `bg-indigo-900 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 focus:ring-offset-indigo-200`,
      outline: `border-indigo-900 border-2 text-indigo-900 active:bg-indigo-900 active:text-white`,
    },
  },
};

const colors = (outline: boolean) => ({
  primary: outline ? ngClass.color.primary.outline : ngClass.color.primary.bg,
  success: outline ? ngClass.color.success.outline : ngClass.color.success.bg,
  danger: outline ? ngClass.color.danger.outline : ngClass.color.danger.bg,
  dark: outline ? ngClass.color.dark.outline : ngClass.color.dark.bg,
  warning: outline ? ngClass.color.warning.outline : ngClass.color.warning.bg,
  indigo: outline ? ngClass.color.indigo.outline : ngClass.color.indigo.bg,
});

const Button = React.forwardRef(
  (
    {
      block = false,
      children,
      className,
      color,
      disabled = false,
      outline = false,
      rounded,
      size = 'md',
      submit,
      ...props
    }: BtnProps,
    ref: ButtonRef,
  ) => (
    <button
      ref={ref}
      {...props}
      type={submit ? 'submit' : 'button'}
      disabled={disabled}
      className={cn(
        className,
        block ? ngClass.block : '',
        disabled ? ngClass.disabled : '',
        ngClass.sizes[size],
        ngClass.default,
        rounded ? ngClass.rounded : 'rounded',
        color ? colors(outline)[color] : colors(outline).dark,
      )}
    >
      {children}
    </button>
  ),
);

Button.displayName = 'Button';

export { Button };
