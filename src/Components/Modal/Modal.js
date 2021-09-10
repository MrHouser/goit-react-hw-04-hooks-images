import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import s from './Modal.module.css';

const modalRef = document.querySelector('#modal-root');

function Modal({ url, closeModal }) {
  useEffect(() => {
    window.addEventListener('keydown', onEscapePress);
    return () => {
      window.removeEventListener('keydown', onEscapePress);
    };
  });

  const onEscapePress = event => {
    if (event.code === 'Escape') {
      closeModal();
    }
  };

  const onOverlayClick = event => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return createPortal(
    <div className={s.Overlay} onClick={onOverlayClick}>
      <div className={s.Modal}>
        <img src={url} alt="" />
      </div>
    </div>,
    modalRef,
  );
}

export default Modal;

Modal.propTypes = {
  url: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
