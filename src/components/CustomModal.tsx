// src/components/CustomModal.tsx
import React from 'react';
import './CustomModal.css';

interface CustomModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ show, onClose, title, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="custom-modal">
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <h4>{title}</h4>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <div className="custom-modal-body">
          {children}
        </div>
        <div className="custom-modal-footer">
          {/* <button onClick={onClose} className="close-button">Close</button> */}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
