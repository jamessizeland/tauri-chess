import { cn } from 'utils';
import Copywrite from './Copywrite';

import pjson from '../../../../package.json';
const { author, repository } = pjson;

export default function Footer({ version }: { version: string }) {
  return (
    <footer
      className={cn('text-center lg:text-left bg-gray-100 text-gray-600')}
    >
      <Copywrite
        className="bg-secondary"
        repo={repository}
        author={author}
        version={version}
      />
    </footer>
  );
}
