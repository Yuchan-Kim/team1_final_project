// src/components/GiftCard.js

/**
 * GiftCard 컴포넌트
 * 개별 기프티콘 카드를 구성합니다.
 * - 기프티콘 이미지
 * - 기프티콘 이름 버튼 (클릭 시 상세 모달 열림)
 * 
 * Props:
 * - gift: 기프티콘 객체 (id, name, image)
 * - onClick: 기프티콘 이름 버튼 클릭 시 호출되는 함수
 */

import React from 'react';
// import '../ham_asset/css/ham_giftcard.css'; // 기프티콘 카드 전용 CSS

const GiftCard = ({ gift, onClick }) => {
    return (
        <div className="hmk_gift-card">
            <div className="hmk_gift-image_frame">
                {/* 기프티콘 이미지 표시 */}
                <img src={gift.image} alt={gift.name} className="hmk_gift-image" />
            </div>
            {/* 기프티콘 이름 버튼 (클릭 시 상세 모달 열림) */}
            <button
                className="hmk_gift-name-button"
                onClick={() => onClick(gift)}
            >
                {gift.name}
            </button>
        </div>
    );
};

export default GiftCard;
