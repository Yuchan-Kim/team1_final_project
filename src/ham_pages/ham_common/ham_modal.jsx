// src/ham_pages/ham_common/ham_modal.js

/**
 * Modal 컴포넌트
 * 공통 모달 구조를 구성합니다.
 * - 모달 타입에 따라 클래스명이 변경됩니다.
 * - ESC 키를 누르면 모달이 닫힙니다.
 * - 모달 외부 클릭 시 닫기 기능 추가 가능
 * 
 * Props:
 * - type: 모달 타입 (예: 'profile', 'nickname', 'address', 'password', 'cargo_detail')
 * - isOpen: 모달 열림 여부 (boolean)
 * - onClose: 모달 닫기 함수
 * - children: 모달 내부의 내용
 */

// src/ham_common/ham_modal.jsx

import React, { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';

const Modal = ({ type, isOpen, onClose, children }) => {
    const modalRef = useRef(null); // 모달 컨테이너 참조

    // 키보드 이벤트를 처리하는 useEffect 훅
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') { // ESC 키를 누르면 모달 닫기
                onClose();
            }
        };

        if (isOpen) {
            // 모달이 열려있을 때 키보드 이벤트 리스너 추가
            document.addEventListener('keydown', handleKeyDown); 
        } else {
            // 모달이 닫히면 키보드 이벤트 리스너 제거
            document.removeEventListener('keydown', handleKeyDown); 
        }

        // 컴포넌트 언마운트 시 키보드 이벤트 리스너 정리
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
                    <button className="hmk_close-modal" onClick={onClose} aria-label="Close Modal">×</button>
                    {children} {/* 모달 내부의 내용 */}
                </div>
            </div>
        </FocusTrap>
    );
};

export default Modal;
