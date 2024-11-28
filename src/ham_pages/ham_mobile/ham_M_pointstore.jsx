// ham_M_pointstore.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MobileBottomMenu from './ham_MobileBottomMenu';
import '../../ham_asset/css/ham_M_pointstore.css';
import profileStore from '../ham_common/profileStore';

const MobilePointStore = () => {
    const [itemList, setItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [historyPoint, setHistoryPoint] = useState(0);
    const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [profile, setProfile] = useState({
        userNum: profileStore.getUserNum(),
        token: profileStore.getToken()
    });
    const [activeCategory, setActiveCategory] = useState('꾸미기');
    // 교환 모달 열기
    const openExchangeModal = (item) => {
        setSelectedItem(item);
        setIsDetailModalOpen(false);
        setIsExchangeModalOpen(true);
    };
    // 데이터 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';

                // 상품 목록 가져오기
                const itemsResponse = await axios.get(`${apiUrl}/api/pointstores`, {
                    params: { userNum: profile.userNum },
                    headers: { Authorization: `Bearer ${profile.token}` }
                });

                if (itemsResponse.data.result === 'success') {
                    setItemList(itemsResponse.data.apiData);
                }

                // 포인트 정보 가져오기
                if (profile.userNum && profile.token) {
                    const pointsResponse = await axios.get(`${apiUrl}/api/user/points`, {
                        params: { userNum: profile.userNum },
                        headers: { Authorization: `Bearer ${profile.token}` }
                    });

                    if (pointsResponse.data.result === 'success') {
                        setHistoryPoint(pointsResponse.data.apiData);
                    }
                }
            } catch (error) {
                console.error('데이터 로드 실패:', error);
            }
        };

        if (profile.userNum && profile.token) {
            fetchData();
        }
    }, [profile.userNum, profile.token]);

    // 구매 처리 함수
    const handlePurchase = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const purchaseData = {
                itemNum: selectedItem.itemNum,
                userNum: profile.userNum,
                purchasedDate: new Date().toISOString().split("T")[0],
                purchasedStatus: selectedItem.itemBrandName === "꾸미기" ? "꾸미기" : "사용가능",
                itemCost: selectedItem.itemCost,
                itemBrandName: selectedItem.itemBrandName
            };

            const response = await axios({
                method: "post",
                url: `${apiUrl}/api/item/exchange`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${profile.token}`
                },
                data: purchaseData
            });

            if (response.data.result === "success") {
                setIsExchangeModalOpen(false);
                setIsCompleteModalOpen(true);
                // 포인트 정보 갱신
                const newPoint = historyPoint - selectedItem.itemCost;
                setHistoryPoint(newPoint);
            }
        } catch (error) {
            console.error("교환 처리 중 오류 발생:", error);
            alert("교환 처리 중 오류가 발생했습니다.");
        }
    };

    const categories = ['꾸미기', '스타벅스', '배스킨라빈스', '투썸플레이스', '메가MGC커피'];

    return (
        <div className="hmk_mobile_pointstore">
            {/* 상단 포인트 표시 */}
            <div className="hmk_mobile_pointstore-header">
                <img src="/images/point.png" alt="point" className="hmk_mobile_pointstore-point-icon" />
                <span>{historyPoint} P</span>
            </div>

            {/* 카테고리 필터 */}
            <div className="hmk_mobile_pointstore-categories">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`hmk_mobile_pointstore-category ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 상품 목록 */}
            <div className="hmk_mobile_pointstore-items">
                {itemList
                    .filter(item => item.itemBrandName === activeCategory)
                    .map(item => (
                        <div
                            key={item.itemNum}
                            className="hmk_mobile_pointstore-item"
                            onClick={() => {
                                if (profile.token) {
                                    if (item.purchaseNum && item.itemBrandName === "꾸미기") {
                                        alert("이미 구매한 아이템입니다.");
                                        return;
                                    }
                                    openExchangeModal(item);
                                } else {
                                    alert("로그인이 필요한 서비스입니다.");
                                }
                            }}
                        >
                            <div className="hmk_mobile_pointstore-item-image">
                                <img src={`/images/${item.itemImg}`} alt={item.itemName} />
                                {item.purchaseNum > 0 && item.itemBrandName === "꾸미기" && (
                                    <div className="hmk_mobile_pointstore-item-purchased">구매완료</div>
                                )}
                            </div>
                            <div className="hmk_mobile_pointstore-item-info">
                                <h3>{item.itemName}</h3>
                                <p>{item.itemCost} P</p>
                            </div>
                        </div>
                    ))}
                {/* 교환 확인 모달 */}
                {isExchangeModalOpen && selectedItem && (
                    <div className="hmk_mobile_pointstore-modal-overlay">
                        <div className="hmk_mobile_pointstore-modal">
                            <h3>포인트 교환</h3>
                            {historyPoint >= selectedItem.itemCost ? (
                                <>
                                    <p>{selectedItem.itemCost} 포인트를 사용하여 교환하시겠습니까?</p>
                                    <div className="hmk_mobile_pointstore-modal-info">
                                        <p>상품: {selectedItem.itemName}</p>
                                        <p>가격: {selectedItem.itemCost} P</p>
                                    </div>
                                    <div className="hmk_mobile_pointstore-modal-buttons">
                                        <button onClick={() => setIsExchangeModalOpen(false)}>취소</button>
                                        <button onClick={handlePurchase}>확인</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <br />
                                    <div className="hmk_mobile_pointstore-modal-content">
                                        <p>포인트가 부족합니다.</p>
                                        <p>이 제품의 구매를 원하시나요?</p>
                                        <br />
                                        <p>원하시는 제품을 구매하시려면</p>
                                        <p>챌린지를 통해 포인트를 쌓아주세요.</p>
                                        <p>현재 포인트: {historyPoint} P</p>
                                        <p>필요 포인트: {selectedItem.itemCost} P</p>
                                    </div>
                                    <div className="hmk_mobile_pointstore-modal-single-button">
                                        <button onClick={() => setIsExchangeModalOpen(false)}>확인</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* 교환 완료 모달 */}
                {isCompleteModalOpen && selectedItem && (
                    <div className="hmk_mobile_pointstore-modal-overlay">
                        <div className="hmk_mobile_pointstore-modal">
                            <h3>교환 완료</h3>
                            <p>교환이 완료되었습니다.</p>
                            <p>{selectedItem.itemCost} 포인트를 사용하였습니다.</p>
                            <p>남은 포인트: {historyPoint} P</p>
                            <div className="hmk_mobile_pointstore-modal-single-button">
                                <button onClick={() => {
                                    setIsCompleteModalOpen(false);
                                    window.location.reload();
                                }}>확인</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <MobileBottomMenu />
        </div>
    );
};

export default MobilePointStore;