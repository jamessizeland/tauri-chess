import React, { useState } from 'react';
import Chessboard from 'chessboardjsx';

const HomePage = (): JSX.Element => {
  const [position, setPosition] = useState<string>('start');
  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Home Page</h1>
      <div className="m-10 border-black">
        <Chessboard width={400} position={position} />
      </div>
    </div>
  );
};
export default HomePage;
