import React, { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';
import PropTypes from 'prop-types';

const Modal = ({ 
    type = '', // 기본값 추가
    isOpen = false,
    onClose = () => {},
    children = null 
}) => {
    const modalRef = useRef(null);

    // 키보드 이벤트 처리 (ESC 키로 모달 닫기)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
    if (!isOpen) return null;

    return (
        <FocusTrap>
            <div className={`hmk_${type}-modal`} role="dialog" aria-modal="true">
                <div className={`hmk_${type}-modal-content`} ref={modalRef}>
                    {/* 모달 닫기 버튼 */}
                    <button className="hmk_close-modal" onClick={onClose} aria-label="모달 닫기">×</button>
                    {children} {/* 모달 내부의 내용 */}
                </div>
            </div>
        </FocusTrap>
    );
};

Modal.propTypes = {
    type: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    children: PropTypes.node
};

export default Modal;