import clsx from 'clsx';
import React from 'react';

interface User {
  name: string;
  email?: string;
  url?: string;
}

interface CopywriteProps {
  className?: string;
  version?: string;
  author?: User;
  title?: string;
  owner?: string;
  repo?: string;
}

export default function Copywrite({
  className,
  version,
  author,
  title,
  owner,
  repo = '/',
}: CopywriteProps) {
  return (
    <div className={clsx('p-6 bg-gray-200 flex justify-between', className)}>
      <span>2021, {owner ? owner : author?.name}</span>
      <a className="text-gray-600 font-semibold" href={repo}>
        Sourcecode
      </a>
      <span>version: {version}</span>
    </div>
  );
}
