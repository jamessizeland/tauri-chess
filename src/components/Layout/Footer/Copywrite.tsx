import { cn } from 'utils';

interface User {
  name: string;
  email?: string;
  url?: string;
}

interface CopywriteProps {
  className?: string;
  version?: string;
  author?: User;
  owner?: string;
  repo?: string;
}

export default function Copywrite({
  className,
  version,
  author,
  owner,
  repo = '/',
}: CopywriteProps) {
  return (
    <div className={cn('p-6 bg-gray-200 flex justify-between', className)}>
      <span>2024, {owner ? owner : author?.name}</span>
      <a className="text-gray-600 font-semibold" href={repo}>
        Sourcecode
      </a>
      <span>version: {version}</span>
    </div>
  );
}
