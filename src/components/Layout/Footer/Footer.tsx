import { cn } from 'utils';
import Copywrite from './Copywrite';

export default function Footer() {
  return (
    <footer
      className={cn('text-center lg:text-left bg-gray-100 text-gray-600')}
    >
      <Copywrite />
    </footer>
  );
}
