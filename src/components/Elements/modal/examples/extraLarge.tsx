import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from '../..';
import { useToggle } from 'Hooks';

const ModalExtraLarge = (): JSX.Element => {
  const { toggle, isOpen } = useToggle();
  return (
    <div className="mb-8">
      <h2 className="mb-3 mt-12 text-gray-600 text-lg font-bold md:text-2xl">
        Extra Large
      </h2>
      <Button onClick={toggle} color="primary">
        Click to open me
      </Button>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        position="extraLarge"
        closeOnClickOutside={true}
      >
        <ModalHeader>Modal title</ModalHeader>
        <ModalBody>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </ModalBody>
        <ModalFooter>
          <Button onClick={toggle} color="danger" className="mr-1">
            Close
          </Button>
          <Button onClick={toggle} color="primary">
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalExtraLarge;
