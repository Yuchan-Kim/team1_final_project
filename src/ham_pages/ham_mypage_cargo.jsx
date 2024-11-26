// src/ham_pages/ham_mypage_cargo.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Header, Sidebar, Topbar, Modal 컴포넌트 import
import Header from '../pages/include/DH_Header';
import Footer from '../pages/include/JM-Footer';
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
    // 알림 모달 관련 state
    const [alertModalState, setAlertModalState] = useState(false);
    const [confirmModalState, setConfirmModalState] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [pendingGiftcard, setPendingGiftcard] = useState(null);
    // 기프티콘 데이터 state 
    const [giftCards, setGiftCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 기프티콘 상세 모달을 여는 함수
    const openDetailModal = (gift) => {
        console.log('선택된 기프티콘 정보:', gift); // 디버깅용 로그
        setSelectedGift(gift);
        setModalDetailState(true);
    };

    // 기프티콘 상세 모달을 닫는 함수
    const closeDetailModal = () => {
        setModalDetailState(false); // 상세 모달 닫힘
        setSelectedGift(null); // 선택된 기프티콘 정보 초기화
    };

    // 확인 모달 표시 함수
    const showConfirmModal = (gift) => {
        setPendingGiftcard(gift);
        setModalMessage(`${gift.name} 기프티콘을 사용하시겠습니까?`);
        setConfirmModalState(true);
    };

    // 알림 모달 표시 함수
    const showAlertModal = (message) => {
        setModalMessage(message);
        setAlertModalState(true);
    };

    // **액티브 탭 상태 추가**
    const [activeTab, setActiveTab] = useState('available'); // 'available' 또는 'completed'

    // 탭 전환 함수
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // 사용 가능/완료 기프티콘 개수를 계산하는 함수
    const getCounts = (gifts) => {
        return {
            available: gifts.filter(gift => gift.purchasedStatus === '사용가능').length,
            completed: gifts.filter(gift => gift.purchasedStatus === '사용완료').length
        };
    };

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
        };

        profileStore.subscribe(handleProfileChange);

        // 초기 데이터 설정
        handleProfileChange({
            userNum: profileStore.getUserNum(),
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // 이미지 경로 처리 헬퍼 함수 추가
    const getGiftImagePath = (imagePath) => {
        if (!imagePath) return '/images/gift-default.png'; // 기본 이미지 경로
        if (imagePath.startsWith('http')) {
            // http로 시작하는 경로를 /images 경로로 변환
            const imageName = imagePath.split('/').pop();
            return `/images/${imageName}`;
        }
        // /로 시작하지 않는 경우 /images/ 추가
        if (!imagePath.startsWith('/')) {
            return `/images/${imagePath}`;
        }
        // /로 시작하는 경우 /images 추가
        return `/images${imagePath}`;
    };

    // **기프티콘 데이터 필터링**
    const filteredGifts = giftCards.filter(gift => {
        if (activeTab === 'available') {
            return gift.purchasedStatus !== '사용완료';
        } else if (activeTab === 'completed') {
            return gift.purchasedStatus === '사용완료';
        }
        return true;
    });

    // **GiftCard 컴포넌트 정의**
    const GiftCard = ({ gift, onClick }) => {
        return (
            <div className="hmk_gift-card" tabIndex={0}>
                <div className="hmk_gift-image_frame">
                    <img
                        src={getGiftImagePath(gift.image)}
                        alt={gift.name}
                        className="hmk_gift-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/gift-default.png';
                        }}
                    />
                    {/* 버튼을 이미지 프레임 안으로 이동 */}
                    <button
                        className="hmk_gift-name-button"
                        onClick={() => onClick(gift)}
                    >
                        {gift.name}
                    </button>
                    <div className="hmk_gift-overlay"></div>
                </div>
            </div>
        );
    };

    // 기프티콘 사용 처리 함수 수정
    const handleUseGiftcard = async (selectedGift) => {
        if (!selectedGift || !selectedGift.purchaseNum) {
            showAlertModal('기프티콘 정보가 올바르지 않습니다.');
            return;
        }

        showConfirmModal(selectedGift);
    };

    // 실제 기프티콘 사용 처리 함수
    const processGiftcardUse = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await axios.put(
                `${apiUrl}/api/my/giftcards/use/${pendingGiftcard.purchaseNum}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${profileStore.getToken()}`
                    }
                }
            );

            if (response.data.result === 'success') {
                setGiftCards(prevGiftCards =>
                    prevGiftCards.map(gift =>
                        gift.purchaseNum === pendingGiftcard.purchaseNum
                            ? { ...gift, purchasedStatus: '사용완료', isUsed: true }
                            : gift
                    )
                );

                closeDetailModal();
                showAlertModal('기프티콘이 사용 처리되었습니다.');

                if (activeTab === 'available') {
                    setActiveTab('completed');
                }
            } else {
                showAlertModal(response.data.message || '기프티콘 사용 처리에 실패했습니다.');
            }
        } catch (error) {
            console.error('기프티콘 사용 처리 중 오류 발생:', error);
            showAlertModal('기프티콘 사용 처리 중 오류가 발생했습니다.');
        } finally {
            setConfirmModalState(false);
            setPendingGiftcard(null);
        }
    };



    return (
        <>
            {/* Header 컴포넌트 */}
            <Header />
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
                                    사용 가능 ({getCounts(giftCards).available})
                                </button>
                                <button
                                    className={`hmk_cargo-tab-button ${activeTab === 'completed' ? 'hmk_active-tab' : ''}`}
                                    onClick={() => handleTabClick('completed')}
                                    aria-label="사용 완료 기프티콘 탭"
                                >
                                    사용 완료 ({getCounts(giftCards).completed})
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
                            <h2 className="hmk_cargo_detail-content">{selectedGift.name}</h2>
                            <img
                                src={getGiftImagePath(selectedGift.image)}
                                alt={selectedGift.name}
                                className="hmk_cargo_detail-image"
                            />
                            <p className="hmk_cargo_detail-content">
                                {selectedGift.description || "상세 설명이 여기에 표시됩니다."}
                            </p>
                            <div className="hmk_cargo_detail-actions">
                                {selectedGift.purchasedStatus === '사용가능' ? (
                                    <>
                                        <button
                                            className="hmk_cargo_btnmodal"
                                            onClick={() => handleUseGiftcard(selectedGift)}
                                        >
                                            사용하기
                                        </button>
                                        <button
                                            className="hmk_cargo_btnmodal"
                                            onClick={closeDetailModal}
                                        >
                                            취소
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="hmk_cargo_btnmodal"
                                        onClick={closeDetailModal}
                                    >
                                        확인
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </Modal>
                {/* 확인 모달 */}
                <Modal type="confirm" isOpen={confirmModalState} onClose={() => setConfirmModalState(false)}>
                    <div className="hmk_modal_content">
                        <p className="hmk_modal_message">{modalMessage}</p>
                        <div className="hmk_modal_buttons">
                            <button
                                className="hmk_cargo_btnmodal hmk_confirm_btn"
                                onClick={processGiftcardUse}
                            >
                                확인
                            </button>
                            <button
                                className="hmk_cargo_btnmodal hmk_cancel_btn"
                                onClick={() => setConfirmModalState(false)}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* 알림 모달 */}
                <Modal type="alert" isOpen={alertModalState} onClose={() => setAlertModalState(false)}>
                    <div className="hmk_modal_content">
                        <p className="hmk_modal_message">{modalMessage}</p>
                        <div className="hmk_modal_buttons">
                            <button
                                className="hmk_cargo_btnmodal"
                                onClick={() => setAlertModalState(false)}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
            <Footer />
        </>
    );

};

export default Cargo;
