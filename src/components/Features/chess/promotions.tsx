import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'components/Elements';
import React from 'react';
import { PieceType } from './types';

type PromotionProps = {
  toggle: (isOpen?: boolean | undefined) => void;
  isOpen: boolean;
  setPromotion: (promotion: PieceType) => void;
};

export default function Promotions({
  toggle,
  isOpen,
  setPromotion,
}: PromotionProps) {
  const promotions = ['Queen', 'Knight', 'Rook', 'Bishop'];
  return (
    <Modal toggle={toggle} isOpen={isOpen} position="extraLarge">
      <ModalHeader>Pick Promotion</ModalHeader>
      <ModalBody>
        {promotions.map((promotion) => (
          <Button
            key={promotion}
            onClick={() => {
              toggle(true);
              setPromotion(promotion as PieceType);
            }}
          >
            {promotion}
          </Button>
        ))}
      </ModalBody>
    </Modal>
  );
}
