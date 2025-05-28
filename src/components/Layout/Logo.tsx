import { cn } from 'utils';
import logo from 'assets/tauri.svg';

interface Props {
  className?: string;
  height?: number;
  width?: number;
  altText?: string;
}

const Logo: React.FC<Props> = ({
  className = '',
  height = 30,
  width = 30,
  altText = 'logo',
}) => {
  return (
    <img
      className={cn(
        'hover:animate-twSpin hover:animate-infinite hover:animate-slow',
        'mx-2',
        className,
      )}
      src={logo}
      height={height}
      width={width}
      // objectFit="cover"
      alt={altText}
    />
  );
};

export default Logo;
