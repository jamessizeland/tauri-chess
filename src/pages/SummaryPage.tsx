import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'components/Elements';
import { useToggle } from 'hooks';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

const SummaryPage = (): JSX.Element => {
  const [score, setScore] = useState(0);
  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Summary Page</h1>
      <div>
        <p>{score}</p>
      </div>
    </div>
  );
};

export default SummaryPage;
