import React, { useEffect, useRef, useCallback, memo } from 'react';
import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';

const Modal = memo(({ 
    type = '',
    isOpen = false,
    onClose,
    children = null 
}) => {
    const modalRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <FocusTrap>
            <div 
                className={`hmk_${type}-modal hmk_modal-overlay`}
                role="dialog"
                aria-modal="true"
                onClick={handleOverlayClick}
            >
                <div 
                    className={`hmk_${type}-modal-content`}
                    ref={modalRef}
                    role="document"
                >
                    <button 
                        className="hmk_close-modal"
                        onClick={onClose}
                        aria-label="모달 닫기"
                    >
                        ×
                    </button>
                    {children}
                </div>
            </div>
        </FocusTrap>
    );
});

Modal.displayName = 'Modal';

Modal.propTypes = {
    type: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default Modal;