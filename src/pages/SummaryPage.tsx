import { useState } from 'react';

const SummaryPage: React.FC = () => {
  const [score] = useState(0);
  return (
    <div className="animate-backInRight">
      <h1 className="text-3xl font-bold underline text-center">Summary Page</h1>
      <div>
        <p>{score}</p>
      </div>
    </div>
  );
};

export default SummaryPage;
