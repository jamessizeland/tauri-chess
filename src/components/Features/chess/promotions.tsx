import { Button, Modal, ModalBody, ModalHeader } from 'components/Elements';
import { invoke } from '@tauri-apps/api/tauri';

type PromotionProps = {
  toggle: (isOpen?: boolean | undefined) => void;
  isOpen: boolean;
};

export default function Promotions({ toggle, isOpen }: PromotionProps) {
  const promotions = ['Queen', 'Knight', 'Rook', 'Bishop'];
  return (
    <Modal toggle={toggle} isOpen={isOpen} position="extraLarge">
      <ModalHeader>Pick Promotion</ModalHeader>
      <ModalBody>
        <div className="flex justify-evenly">
          {promotions.map((promotion) => (
            <div className="hover:animate-heartBeat">
              <Button
                color="primary"
                key={promotion}
                onClick={() => {
                  // tell Rust that we want this choice of promotion piece
                  invoke('promote', { choice: promotion[0] }); // just first letter
                  toggle();
                }}
              >
                {promotion}
              </Button>
            </div>
          ))}
        </div>
      </ModalBody>
    </Modal>
  );
}
