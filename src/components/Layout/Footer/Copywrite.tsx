import { IoLogoGithub } from 'react-icons/io';
import pjson from '../../../../package.json';
import { useEffect, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';

export default function Copywrite() {
  const [version, setVersion] = useState<string>('');
  useEffect(() => {
    getVersion().then((version) => setVersion(version));
  }, []);
  return (
    <div className="w-full flex justify-center p-2 items-center">
      <a
        target="_blank"
        href={pjson.repository}
        className="flex items-center border border-gray-200 rounded-lg p-2 shadow-md hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 ease-in-out space-x-3"
      >
        <p>v{version}</p>
        <IoLogoGithub className="h-7 w-auto" />
        <p>2025</p>
      </a>
    </div>
  );
}
