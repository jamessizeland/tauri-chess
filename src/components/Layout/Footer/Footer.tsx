import React from 'react';
import clsx from 'clsx';
import Copywrite from './Copywrite';

import pjson from '../../../../package.json';
const { author, repository, version } = pjson;

export default function Footer() {
  return (
    <footer
      className={clsx('text-center lg:text-left bg-gray-100 text-gray-600')}
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
