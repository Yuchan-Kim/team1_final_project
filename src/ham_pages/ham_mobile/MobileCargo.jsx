import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MobileBottomMenu from './MobileBottomMenu';
import profileStore from '../ham_common/profileStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import GiftCard from '../ham_common/ham_giftcard';

const MobileCargo = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('available');
    const [giftCards, setGiftCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalDetailState, setModalDetailState] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [confirmModalState, setConfirmModalState] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [pendingGiftcard, setPendingGiftcard] = useState(null);

    const userNum = profileStore.getUserNum();

    // 기프티콘 데이터 로드
    useEffect(() => {
        const fetchGiftCards = async () => {
            if (!userNum) {
                navigate('/mobile');
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/my/${userNum}/giftcards`
                );
                if (response.data.result === 'success') {
                    setGiftCards(response.data.apiData || []);
                }
            } catch (error) {
                console.error("기프티콘 데이터 로드 실패:", error);
                setError("기프티콘을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchGiftCards();
    }, [userNum, navigate]);

    // 이미지 경로 처리 헬퍼 함수
    const getGiftImagePath = (imagePath) => {
        if (!imagePath) return '/images/gift-default.png';
        if (imagePath.startsWith('http')) {
            const imageName = imagePath.split('/').pop();
            return `/images/${imageName}`;
        }
        if (!imagePath.startsWith('/')) {
            return `/images/${imagePath}`;
        }
        return `/images${imagePath}`;
    };

    const GiftCard = ({ gift, onClick }) => {
        return (
            <div
                className="hmk_challenge-card"
                onClick={() => onClick(gift)}
            >
                <img
                    src={getGiftImagePath(gift.image)}
                    alt={gift.name}
                    className="hmk_challenge-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/gift-default.png';
                    }}
                />
                <div className="hmk_challenge-details">
                    <div className="hmk_challenge-datebox">
                        <p>{gift.purchasedStatus}</p>
                    </div>
                    <p className="hmk_challenge-title">{gift.name}</p>
                </div>
            </div>
        );
    };

    // 탭별 기프티콘 필터링
    const filteredGifts = giftCards.filter(gift =>
        activeTab === 'available'
            ? gift.purchasedStatus === '사용가능'
            : gift.purchasedStatus === '사용완료'
    );

    // 기프티콘 사용 처리
    const handleUseGiftcard = (gift) => {
        setPendingGiftcard(gift);
        setModalMessage(`${gift.name} 기프티콘을 사용하시겠습니까?`);
        setConfirmModalState(true);
    };

    const processGiftcardUse = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/my/giftcards/use/${pendingGiftcard.purchaseNum}`,
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
                            ? { ...gift, purchasedStatus: '사용완료' }
                            : gift
                    )
                );
                setModalDetailState(false);
                setModalMessage('기프티콘이 사용 처리되었습니다.');
                setConfirmModalState(false);
                setPendingGiftcard(null);
            }
        } catch (error) {
            console.error('기프티콘 사용 처리 실패:', error);
            setModalMessage('기프티콘 사용 처리에 실패했습니다.');
        }
    };

    return (
        <div className="hmk_mobile_home-wrap">
            <div className="hmk_mobile_home-fixed-top">
                {/* 상단 통계 카드 */}
                <div className="hmk_mobile_home-card">
                    <div className="hmk_mobile_home-stats">
                        <div className="hmk_mobile_home-stat">
                            <div className="hmk_mobile_home-stat-title">사용 가능</div>
                            <div className="hmk_mobile_home-stat-value">
                                {giftCards.filter(g => g.purchasedStatus === '사용가능').length}
                            </div>
                        </div>
                        <div className="hmk_mobile_home-stat">
                            <div className="hmk_mobile_home-stat-title">사용 완료</div>
                            <div className="hmk_mobile_home-stat-value">
                                {giftCards.filter(g => g.purchasedStatus === '사용완료').length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 탭 메뉴 */}
                <div className="hmk_mobile_home-grid">
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'available' ? 'hmk_active' : ''}`}
                        onClick={() => setActiveTab('available')}
                    >
                        사용 가능
                    </button>
                    <button
                        className={`hmk_mobile_home-grid-item ${activeTab === 'completed' ? 'hmk_active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        사용 완료
                    </button>
                </div>
            </div>

            {/* 기프티콘 리스트 */}
            <div className="hmk_mobile_home-content">
                <div className="hmk_mobile_home-grid-list">
                    {loading ? (
                        <div className="hmk_loading">로딩중...</div>
                    ) : error ? (
                        <div className="hmk_error">{error}</div>
                    ) : filteredGifts.length === 0 ? (
                        <div className="hmk_empty">표시할 기프티콘이 없습니다.</div>
                    ) : (
                        filteredGifts.map(gift => (
                            <GiftCard
                                key={gift.purchaseNum}
                                gift={gift}
                                onClick={() => {
                                    setSelectedGift(gift);
                                    setModalDetailState(true);
                                }}
                                isMobile={true}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* 상세 모달 */}
            {modalDetailState && selectedGift && (
                <div className="hmk_mobile_home-modal-overlay" onClick={() => setModalDetailState(false)}>
                    <div className="hmk_mobile_home-modal" onClick={e => e.stopPropagation()}>
                        <button
                            className="hmk_mobile_home-modal-close"
                            onClick={() => setModalDetailState(false)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <div className="hmk_mobile_home-modal-content">
                            <img
                                src={getGiftImagePath(selectedGift.image)}
                                alt={selectedGift.name}
                                className="hmk_mobile_home-modal-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/gift-default.png';
                                }}
                            />
                            <h3 className="hmk_mobile_home-stat-title">{selectedGift.name}</h3>
                            <p className="hmk_mobile_home-stat-value">{selectedGift.description}</p>
                            {selectedGift.purchasedStatus === '사용가능' && (
                                <button
                                    className="hmk_mobile_home-grid-item hmk_active"
                                    onClick={() => handleUseGiftcard(selectedGift)}
                                >
                                    사용하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 확인 모달 */}
            {confirmModalState && (
                <div className="hmk_mobile_home-modal-overlay" onClick={() => setConfirmModalState(false)}>
                    <div className="hmk_mobile_home-modal" onClick={e => e.stopPropagation()}>
                        <div className="hmk_mobile_home-modal-content">
                            <p className="hmk_mobile_home-stat-value">{modalMessage}</p>
                            <div className="hmk_mobile_home-grid">
                                <button
                                    className="hmk_mobile_home-grid-item hmk_active"
                                    onClick={processGiftcardUse}
                                >
                                    확인
                                </button>
                                <button
                                    className="hmk_mobile_home-grid-item"
                                    onClick={() => setConfirmModalState(false)}
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <MobileBottomMenu />
        </div>
    );
};

export default MobileCargo;