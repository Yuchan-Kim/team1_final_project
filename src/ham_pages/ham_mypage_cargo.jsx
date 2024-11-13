// src/ham_pages/ham_mypage_cargo.jsx

import React, { useState } from 'react';

// Header, Sidebar, Topbar, Modal, ProfileOptions 컴포넌트 import
import Header from '../pages/include/DH_Header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import Modal from './ham_common/ham_modal';

// GiftCard 컴포넌트 import
import GiftCard from './ham_common/ham_giftcard';

// 보관함 페이지 스타일
import '../ham_asset/css/ham_mypage_cargo.css';

// 기프티콘 이미지 데이터 import 
import { giftItems } from '../ham_data/ham_giftData';

const Cargo = () => {
    // 기프티콘 상세 모달 관련 state
    const [modalDetailState, setModalDetailState] = useState(false); // 기프티콘 상세 모달 열림 여부
    const [selectedGift, setSelectedGift] = useState(null); // 선택된 기프티콘 정보

    // 기프티콘 상세 모달을 여는 함수
    const openDetailModal = (gift) => {
        setSelectedGift(gift); // 선택된 기프티콘 정보를 state에 저장
        setModalDetailState(true); // 상세 모달 열림
    };

    // 기프티콘 상세 모달을 닫는 함수
    const closeDetailModal = () => {
        setModalDetailState(false); // 상세 모달 닫힘
        setSelectedGift(null); // 선택된 기프티콘 정보 초기화
    };

    const handleLogout = () => {
        // 로그아웃 로직 추가
        console.log("로그아웃");
    };

    return (
        <>{/* Header 컴포넌트 */}
            <Header onLogout={handleLogout} />
            <div className="wrap ham_wrap">


                {/* 메인 컨테이너 */}
                <div className="hmk_main-container">
                    {/* Sidebar 컴포넌트 */}
                    <Sidebar />

                    {/* 메인 콘텐츠 영역 */}
                    <div className="hmk_main">
                        {/* Topbar 컴포넌트 */}
                        <Topbar />

                        {/* 보관함(기프티콘) 영역 */}
                        <div className="hmk_cargobox">
                            <h1>보관함</h1>
                            <div className="hmk_gift-gallery">
                                {/* 기프티콘 목록을 반복하여 표시 */}
                                {giftItems.map(gift => (
                                    <GiftCard key={gift.id} gift={gift} onClick={() => openDetailModal(gift)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 기프티콘 상세 모달 */}
                <Modal type="cargo_detail" isOpen={modalDetailState} onClose={closeDetailModal}>
                    {selectedGift && (
                        <>
                            {/* 선택된 기프티콘의 이름 표시 */}
                            <h2 className="hmk_cargo_detail-content">{selectedGift.name}</h2>
                            {/* 선택된 기프티콘의 이미지 표시 */}
                            <img src={selectedGift.image} alt={selectedGift.name} className="hmk_cargo_detail-image" />
                            {/* 기프티콘 상세 설명 (추가 정보 필요 시 수정) */}
                            <p className="hmk_cargo_detail-content">상세 설명이 여기에 표시됩니다.</p>
                            <div className="hmk_cargo_detail-actions">
                                {/* 상세 모달 닫기 버튼 */}
                                <button className="hmk_cargo_btnmodal" onClick={closeDetailModal}>확인</button>
                            </div>
                        </>
                    )}
                </Modal>
            </div>
        </>
    );

};
export default Cargo;