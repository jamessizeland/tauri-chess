import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'components/Elements';
import { useToggle } from 'hooks';

const TestPage = (): JSX.Element => {
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
      </div>
    </div>
  );
};

export default TestPage;
