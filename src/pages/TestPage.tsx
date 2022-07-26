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

const TestPage = (): JSX.Element => {
  useEffect(() => {
    const unlisten = listen<number>('update_score', (event) => {
      console.log(event);
      setScore(event.payload);
    });
  }, []);

  const [score, setScore] = useState(0);
  const { isOpen, toggle } = useToggle();
  return (
    <div className="animate-backInRight animate-fast">
      <h1 className="text-3xl font-bold underline text-center">Test Page</h1>
      <div>
        <Modal toggle={toggle} isOpen={isOpen} animate position="extraLarge">
          <ModalHeader>Popup</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => toggle(true)}>Modal</Button>
          </ModalFooter>
        </Modal>
        <Button onClick={() => toggle(false)}>Modal</Button>
        <Button onClick={() => invoke('get_score')}>Trigger Event</Button>
        <p>{score}</p>
      </div>
    </div>
  );
};

export default TestPage;
