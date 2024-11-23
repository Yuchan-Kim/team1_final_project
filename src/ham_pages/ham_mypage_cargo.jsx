// src/ham_pages/ham_mypage_cargo.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Header, Sidebar, Topbar, Modal 컴포넌트 import
import Header from '../pages/include/DH_Header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import Modal from './ham_common/ham_modal';
import profileStore from './ham_common/profileStore';

// 보관함 페이지 스타일
import '../ham_asset/css/ham_mypage_cargo.css';

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

    // **액티브 탭 상태 추가**
    const [activeTab, setActiveTab] = useState('available'); // 'available' 또는 'completed'

    // 탭 전환 함수
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // **기프티콘 데이터 상태 추가**
    const [giftCards, setGiftCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const userNum = profileStore.getUserNum(); // 현재 사용자 번호 가져오기

    // 기프티콘 데이터 로드
    useEffect(() => {
        if (!userNum) {
            console.log("userNum이 설정되지 않았습니다.");
            return;
        }

        const fetchGiftCards = async () => {
            setLoading(true);
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
                const response = await axios.get(`${apiUrl}/api/my/${userNum}/giftcards`);
                if (response.data.result === 'success') {
                    setGiftCards(response.data.apiData || []);
                }
            } catch (err) {
                console.error("기프티콘 데이터를 불러오는 중 오류 발생:", err);
                setError(err.response?.data?.message || "기프티콘 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchGiftCards();
    }, [userNum]);

    // **profileStore 구독**
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            // 필요 시 상태 업데이트 (예: setUserNum(updatedProfile.userNum);)
            // 현재 예시에서는 userNum이 profileStore에서 직접 가져오기 때문에 필요 없음
        };

        profileStore.subscribe(handleProfileChange);

        // 초기 데이터 설정
        handleProfileChange({
            userNum: profileStore.getUserNum(),
            // 필요한 다른 필드 추가
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // **기프티콘 데이터 필터링**
    const filteredGifts = giftCards.filter(gift => {
        if (activeTab === 'available') {
            return !gift.isUsed;
        } else if (activeTab === 'completed') {
            return gift.isUsed;
        }
        return true;
    });

    // **GiftCard 컴포넌트 정의**
    const GiftCard = ({ gift, onClick }) => {
        return (
            <div
                className="hmk_gift-card"
                onClick={() => onClick(gift)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => { if (e.key === 'Enter') onClick(gift); }}
            >
                <div className="hmk_gift-image_frame">
                    {/* 기프티콘 이미지 표시 */}
                    <img src={gift.image} alt={gift.name} className="hmk_gift-image" />
                </div>
                {/* 기프티콘 이름 버튼 (클릭 시 상세 모달 열림) */}
                <button
                    className="hmk_gift-name-button"
                    onClick={(e) => { e.stopPropagation(); onClick(gift); }}
                >
                    {gift.name}
                </button>
            </div>
        );
    };

    return (
        <>
            {/* Header 컴포넌트 */}
            <Header/>
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

                            {/* **액티브 탭 메뉴 추가** */}
                            <div className="hmk_cargo-tabs">
                                <button
                                    className={`hmk_cargo-tab-button ${activeTab === 'available' ? 'hmk_active-tab' : ''}`}
                                    onClick={() => handleTabClick('available')}
                                    aria-label="사용 가능 기프티콘 탭"
                                >
                                    사용 가능 ({giftCards.filter(gift => !gift.isUsed).length})
                                </button>
                                <button
                                    className={`hmk_cargo-tab-button ${activeTab === 'completed' ? 'hmk_active-tab' : ''}`}
                                    onClick={() => handleTabClick('completed')}
                                    aria-label="사용 완료 기프티콘 탭"
                                >
                                    사용 완료 ({giftCards.filter(gift => gift.isUsed).length})
                                </button>
                            </div>

                            {/* **기프티콘 목록 표시** */}
                            <div className="hmk_gift-gallery">
                                {loading ? (
                                    <p>기프티콘 데이터를 불러오는 중...</p>
                                ) : error ? (
                                    <p className="hmk_error-message">{error}</p>
                                ) : filteredGifts.length > 0 ? (
                                    filteredGifts.map(gift => (
                                        <GiftCard key={gift.id} gift={gift} onClick={() => openDetailModal(gift)} />
                                    ))
                                ) : (
                                    <p className="hmk_no-gifts">해당 탭에 표시할 기프티콘이 없습니다.</p>
                                )}
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
                            {/* 기프티콘 상세 설명 */}
                            <p className="hmk_cargo_detail-content">{selectedGift.description || "상세 설명이 여기에 표시됩니다."}</p>
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
