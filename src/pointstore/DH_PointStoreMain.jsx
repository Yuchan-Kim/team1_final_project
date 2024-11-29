//import 라이브러리
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import Header from '../pages/include/DH_Header';
import Footert from "../pages/include/JM-Footer.jsx";

//import css
import '../css/dh_pointstoremain.css';


const DH_PointStoreMain = () => {

	/*---일반 변수 --------------------------------------------*/

	/*---라우터 관련------------------------------------------*/

	/*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/
    const [hasToken, setHasToken] = useState(false);    // 토큰 상태 관리

    const [itemList, setItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); // 디테일 모달창 
    const [selectedItemExchange, setSelectedItemExchange] = useState(null);   // 포인트 교환 모달창
    const [selectedItemComplete, setSelectedItemComplete] = useState(null);   // 완료 모달창

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);      // 상품 상세 모달
    const [isPointsAvailable, setIsPointsAvailable] = useState(0); // 유저의 포인트 상태 관리
    const [historyPoint, setHistoryPoint] = useState(0); // 유저의 포인트 상태 관리
    // 토큰 상태 확인 및 포인트 조회
    const [token, setToken] = useState(localStorage.getItem('token')); 
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);  // 포인트 교환 모달
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);  // 교환 완료 모달

    const starbucksGiftSectionRef = useRef(null); // 스타벅스 기프티콘 섹션을 참조하는 ref
    const baskinrobbinsGiftSectionRef = useRef(null); // 배스킨라빈스 기프티콘 섹션을 참조하는 ref
    const atwosomeplaceGiftSectionRef = useRef(null); // 투썸플레이스 기프티콘 섹션을 참조하는 ref
    const megacoffeeGiftSectionRef = useRef(null); // 메가커피 기프티콘 섹션을 참조하는 ref

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 마운트됐을때
    useEffect(() => {
        console.log("마운트 됐어요");
    
        const userNum = localStorage.getItem('userNum'); // 로컬스토리지에서 userNum 가져오기
    
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/pointstores`,
            params: userNum ? { userNum: userNum } : {}, // userNum이 있으면 전달, 없으면 빈 객체
            responseType: 'json',
        }).then(response => {
                console.log(response); // 수신 데이터
                // console.log(response.data.apiData);
                setItemList(response.data.apiData);
        }).catch(error => {
                console.log(error);
        });

        // 토큰 확인 로직
        const token = localStorage.getItem('token'); // 로컬스토리지에서 토큰 가져오기
        if (token) {
            setHasToken(true); // 토큰이 있다면 true로 설정
        }

    }, []);


    // 출석체크 알림 함수
    const handleAttendance = () => {

        const authUser = JSON.parse(localStorage.getItem('authUser'));
        const userNum = authUser ? authUser.userNum : null;  // authUser에 userNum이 있을 경우 가져오기
        // userNum이 유효하지 않으면 알림을 표시하고 종료
        if (!userNum) {
            alert("로그인 정보가 유효하지 않습니다.");
            return;
        }
        const today = new Intl.DateTimeFormat('ko-KR').format(new Date());
        const dyCheckinVo = {
            userNum: userNum,
            checkinDate: today   // 오늘 날짜
        };
    
        // 서버로 데이터 전송
        axios({
            method: 'post',
            url: `${process.env.REACT_APP_API_URL}/api/checkin`,
            headers: { "Content-Type": "application/json; charset=utf-8" }, // JSON 타입 설정

            data: dyCheckinVo, 
            responseType: 'json'
        }).then((response) => {
                if (response.data.result === 'success') {
                    alert(`${today} \n출석체크가 완료되었습니다!`);
                    window.location.reload();
                } else {
                    alert("이미 오늘 출석체크를 완료하였습니다. \n내일 다시 출석해주세요.");
                }
            })
            .catch((error) => {
                console.error("출석체크 중 오류 발생:", error);
                alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
            });
    };

    // 스타벅스 로고 클릭 시 스크롤 이동 함수
    const handleStarbucksLogoClick = () => {
        if (starbucksGiftSectionRef.current) {
            starbucksGiftSectionRef.current.scrollIntoView({
                behavior: 'smooth', // 부드럽게 스크롤
                block: 'start', // 섹션의 맨 위로
            });
        }
    };

    // 배스킨라빈스 로고 클릭 시 스크롤 이동 함수
    const handleBaskinrobbinsLogoClick = () => {
        if (baskinrobbinsGiftSectionRef.current) {
            baskinrobbinsGiftSectionRef.current.scrollIntoView({
                behavior: 'smooth', // 부드럽게 스크롤
                block: 'start', // 섹션의 맨 위로
            });
        }
    };

    // 투썸플레이스 로고 클릭 시 스크롤 이동 함수
    const handleAtwosomeplaceLogoClick = () => {
        if (atwosomeplaceGiftSectionRef.current) {
            atwosomeplaceGiftSectionRef.current.scrollIntoView({
                behavior: 'smooth', // 부드럽게 스크롤
                block: 'start', // 섹션의 맨 위로
            });
        }
    };

    // 메가커피 로고 클릭 시 스크롤 이동 함수
    const handleMegacoffeeLogoClick = () => {
        if (megacoffeeGiftSectionRef.current) {
            megacoffeeGiftSectionRef.current.scrollIntoView({
                behavior: 'smooth', // 부드럽게 스크롤
                block: 'start', // 섹션의 맨 위로
            });
        }
    };


    // 모달 열기/닫기 함수
    const openDetailModal = (item) => {
        if (!hasToken) {
            alert("로그인이 필요합니다. 로그인을 먼저 해주세요."); // 알림 메시지
            return;
        }
        setSelectedItem(item); // 선택한 아이템을 상태에 저장
        setIsDetailModalOpen(true);
    };
    const closeDetailModal = () => setIsDetailModalOpen(false);
    
    const openExchangeModal = () => {
        setSelectedItemExchange(selectedItem); // 선택한 아이템 정보 저장
        setIsDetailModalOpen(false); // 이전 모달 닫기

        axios({
			method: 'get', // HTTP 메서드 설정 (GET 요청)
			url: `${process.env.REACT_APP_API_URL}/api/user/points`, // API URL
			params: { userNum: authUser.userNum }, 
			headers: { "Authorization": `Bearer ${token}` },
			responseType: 'json' // 서버 응답 형식
		})
        .then(response => {
            if (response.data.result === "success") {
                const userPoints = response.data.apiData;
                setHistoryPoint(userPoints);  // 포인트 정보 저장

                 // 포인트가 부족해도 교환 모달은 열어두고, 부족 메시지를 표시
                setIsExchangeModalOpen(true);
            }
        })
        .catch(error => {
            console.error('포인트 조회 실패:', error);
        });
    
    };
    const closeExchangeModal = () => setIsExchangeModalOpen(false);

    const openCompleteModal = () => {
        setSelectedItemComplete(selectedItemExchange); // 교환할 아이템 정보 저장
        setIsExchangeModalOpen(false); // 이전 모달 닫기
        setIsCompleteModalOpen(true); // 교환 완료 모달 열기

        // 구매 처리 함수 호출
        const authUser = JSON.parse(localStorage.getItem('authUser'));
        const userNum = authUser ? authUser.userNum : null; // authUser에 userNum이 있을 경우 가져오기
        if (!userNum || !selectedItem) {
            alert("유효하지 않은 요청입니다.");
            return;
        }

        // 구매 정보 구성
        const purchaseData = {
            itemNum: selectedItem.itemNum, // 선택된 상품 번호
            userNum: userNum, // 로그인한 사용자 번호
            purchasedDate: new Date().toISOString().split("T")[0], // 오늘 날짜 (YYYY-MM-DD 형식)
            purchasedStatus: selectedItem.itemBrandName === "꾸미기" ? "꾸미기" : "사용가능",
            itemCost: selectedItem.itemCost,
            itemBrandName: selectedItem.itemBrandName
        };
        console.log(purchaseData);
        // 서버로 데이터 전송
        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/api/item/exchange`,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            data: purchaseData,
            responseType: 'json'
        }).then((response) => {
                if (response.data.result === "success") {
                    setIsCompleteModalOpen(true); // 교환 완료 모달 열기
                } else {
                    alert("교환 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
                }
            })
            .catch((error) => {
                console.error("교환 처리 중 오류 발생:", error);
                alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
            });
    };
    const closeCompleteModal = () => {
        setIsCompleteModalOpen(false);  // 모달 닫기
        window.location.reload();  // 페이지 리로드
    };


    return (
        <>
            <Header />
            {/* // header */}
            
			<div className="dy-wrap">
                <div className="dy-pointstoremain">
                    <div className="dy-pointstoremain-header">
                        <h1 className="dy-pointstoremainTitle">포인트 상점</h1>
                        {hasToken && (      // 로그인시에만 보임
                            <button type="button" onClick={handleAttendance} className="dy-attendance-btn">출석하기</button>
                        )}
                    </div>
                    
                    <div className="dy-pointstoremain-top">
                        <div className="dy-ad">
                            <img src="../images/starbucksAd.jpg" className="dy-ad-image" alt="Ad image1"/>
                            <img src="../images/baskinrobbinsAd.jpg" className="dy-ad-image" alt="Ad image2"/>
                            <img src="../images/atwosomeplaceAd.jpg" className="dy-ad-image" alt="Ad image3"/>
                            <img src="../images/megaAd.jpg" className="dy-ad-image" alt="Ad image4"/>
                            {/* 이미지 매끄럽게하기위한 복사본 */}
                            <img src="../images/starbucksAd.jpg" className="dy-ad-image" alt="Ad image1"/>
                            <img src="../images/baskinrobbinsAd.jpg" className="dy-ad-image" alt="Ad image2"/>
                            <img src="../images/atwosomeplaceAd.jpg" className="dy-ad-image" alt="Ad image3"/>
                            <img src="../images/megaAd.jpg" className="dy-ad-image" alt="Ad image4"/>
                        </div>
                        <div className="dy-filter">
                            <div className="dy-filter-item">
                                <img src="../images/starbucksLogo.jpg" onClick={handleStarbucksLogoClick} className="dy-Logo-image" alt="Logo image1"/>
                            </div>
                            <div className="dy-filter-item">
                                <img src="../images/baskinrobbinsLogo.jpg" onClick={handleBaskinrobbinsLogoClick} className="dy-Logo-image" alt="Logo image2"/>
                            </div>
                            <div className="dy-filter-item">
                                <img src="../images/atwosomeplaceLogo.jpg" onClick={handleAtwosomeplaceLogoClick} className="dy-Logo-image" alt="Logo image3"/>
                            </div>
                            <div className="dy-filter-item">
                                <img src="../images/megaLogo.jpg" onClick={handleMegacoffeeLogoClick} className="dy-Logo-image" alt="Logo image4"/>
                            </div>
                        </div>
                    </div>


                    {/* 세션 반복 */}
                    <div className="dy-product-sections">
                        <h2 className="dy-product-header">꾸미기 아이템으로 교환</h2>
                        <div  className="dy-product-section">
                            {itemList
                                .filter(item => item.itemBrandName === "꾸미기")  
                                .map(item => (
                                    <div key={item.itemNum} className="dy-product-info" onClick={() => openDetailModal(item)}>
                                        <img src={`/images/${item.itemImg}`} className="dy-pointstore-pointproduct" alt={item.itemName} />
                                        
                                        {/* 구매완료 여부 체크 */}
                                        {item.purchaseNum ? (
                                            <span className="dy-purchase-completed">구매완료</span>  // 이미 구매한 아이템에 '구매완료' 표시
                                        ) : null}
                                        
                                        <div className="dy-product-details">
                                            <h3>{item.itemName}</h3>
                                            <p>{item.itemCost} P</p>
                                        </div>
                                    </div>
                            ))}
                            {/* /dy-product-info */}
                        </div>
                        {/* /dy-product-section */}
                    </div>
                    {/* /dy-product-sections */}

                    {/* 기프티콘 시작 */}
                    {/* 세션 반복 */}
                    <div className="dy-product-sections" ref={starbucksGiftSectionRef}>
                        <h2 className="dy-product-header">스타벅스 기프티콘으로 교환</h2>
                        <div  className="dy-product-section">
                            {itemList
                                .filter(item => item.itemBrandName === '스타벅스') 
                                .map(item => (
                                    <div key={item.itemNum} className="dy-product-info" onClick={() => openDetailModal(item)}>
                                        <img src={`/images/${item.itemImg}`} className="dy-pointstore-pointproduct" alt={item.itemName} />
                                        {/* src={`${process.env.REACT_APP_API_URL}/upload/${item.itemImg}`} */}
                                        
                                        <div className="dy-product-details">
                                            <h3>{item.itemBrandName}</h3>
                                            <h4>{item.itemName}</h4>
                                            <p>{item.itemCost} P</p>
                                        </div>
                                    </div>
                            ))}
                            {/* /dy-product-info */}
                        </div>
                        {/* /dy-product-section */}
                    </div>
                    {/* /dy-product-sections */}


                    {/* 세션 반복 */}
                    <div className="dy-product-sections" ref={baskinrobbinsGiftSectionRef}>
                        <h2 className="dy-product-header">배스킨라빈스 기프티콘으로 교환</h2>
                        <div  className="dy-product-section">
                            {itemList
                                .filter(item => item.itemBrandName === '배스킨라빈스') 
                                .map(item => (
                                    <div key={item.itemNum} className="dy-product-info" onClick={() => openDetailModal(item)}>
                                        <img src={`/images/${item.itemImg}`} className="dy-pointstore-pointproduct" alt={item.itemName} />
                                        <div className="dy-product-details">
                                            <h3>{item.itemBrandName}</h3>
                                            <h4>{item.itemName}</h4>
                                            <p>{item.itemCost} P</p>
                                        </div>
                                    </div>
                            ))}
                            {/* /dy-product-info */}
                        </div>
                    </div>
                    {/* /dy-product-sections */}


                    {/* 세션 반복 */}
                    <div className="dy-product-sections" ref={atwosomeplaceGiftSectionRef}>
                        <h2 className="dy-product-header">투썸플레이스 기프티콘으로 교환</h2>
                        <div  className="dy-product-section">
                            {itemList
                                .filter(item => item.itemBrandName === '투썸플레이스') 
                                .map(item => (
                                    <div key={item.itemNum} className="dy-product-info" onClick={() => openDetailModal(item)}>
                                        <img src={`/images/${item.itemImg}`} className="dy-pointstore-pointproduct" alt={item.itemName} />
                                        <div className="dy-product-details">
                                            <h3>{item.itemBrandName}</h3>
                                            <h4>{item.itemName}</h4>
                                            <p>{item.itemCost} P</p>
                                        </div>
                                    </div>
                            ))}
                            {/* /dy-product-info */}
                        </div>
                    </div>
                    {/* /dy-product-sections */}


                    {/* 세션 반복 */}
                    <div className="dy-product-sections" ref={megacoffeeGiftSectionRef}>
                        <h2 className="dy-product-header">메가커피 기프티콘으로 교환</h2>
                        <div  className="dy-product-section">
                            {itemList
                                .filter(item => item.itemBrandName === '메가MGC커피') 
                                .map(item => (
                                    <div key={item.itemNum} className="dy-product-info" onClick={() => openDetailModal(item)}>
                                        <img src={`/images/${item.itemImg}`} className="dy-pointstore-pointproduct" alt={item.itemName} />
                                        <div className="dy-product-details">
                                            <h3>{item.itemBrandName}</h3>
                                            <h4>{item.itemName}</h4>
                                            <p>{item.itemCost} P</p>
                                        </div>
                                    </div>
                            ))}
                            {/* /dy-product-info */}
                        </div>
                    </div>
                    {/* /dy-product-sections */}







                {/* 상품상세 모달 */}
                {isDetailModalOpen && selectedItem && (
                    <div className="modal-background">
                        <div className="dy-detailContent-modal">
                            <div className="dy-close">
                                <button type="button" onClick={closeDetailModal} className="dy-close-btn">&times;</button>
                            </div>
                            <div className="dy-detailContent">
                                <img src={`/images/${selectedItem.itemImg}`} className="dy-detailContent-pointproduct" alt={selectedItem.itemName} />
                                <div className="dy-detailContent-left">
                                    <div className="dy-product-brand">{selectedItem.itemBrandName}</div>
                                    <div className="dy-product-name">{selectedItem.itemName}</div>
                                    <div className="dy-product-point">{selectedItem.itemCost} P</div>
                                    <div className="dy-product-warning">&nbsp; &#8226; &nbsp;본 상품은 환불불가 상품입니다.</div>
                                    <div className="dy-product-period">
                                        {selectedItem.itemBrandName === "꾸미기" ? 
                                            "사용기간 : 기한 없음 (평생 사용 가능)" : 
                                            "사용기간 : 30일 이내 (기간내에 미사용시 사용불가)"}
                                    </div>
                                    <div className="dy-product-check">발송방법 : 마이페이지에서 확인</div>
                                    
                                    {selectedItem.itemBrandName == "꾸미기" && selectedItem.purchaseNum ? (
                                        <></>
                                    ) : (
                                    <button type="submit" onClick={openExchangeModal} className="dy-change-btn">교환하기</button>
                                    )}
                                </div>
                                {/* /dy-detailContent-left */}
                            </div> 
                            {/* /dy-detailContent */}
                        </div>
                    </div>
                )}
                {/* /상품상세 모달 */}

                {/* 포인트 교환 모달 */}
                {isExchangeModalOpen && selectedItemExchange && (
                    <div className="modal-background">
                        <div className="dy-change-modal">
                            <h3>포인트 교환</h3>
                            
                            {/* 포인트가 있을 때와 없을 때 분기 */}
                            {historyPoint >= selectedItemExchange.itemCost ? (
                                <>
                                    <div className="dy-end-content">{selectedItemExchange.itemCost} 포인트를 사용하여 교환하시겠습니까?</div>
                                    <br />
                                    <div className="dy-end-content">상품브랜드: {selectedItemExchange.itemBrandName}</div>
                                    <div className="dy-end-content">상품명: {selectedItemExchange.itemName}</div>
                                    <div className="dy-end-content">상품가격: {selectedItemExchange.itemCost} P</div>
                                    <div className="dy-end-content">발송방법: 마이페이지에서 확인</div>

                                    <div className="dy-two-btn">
                                        <button type="button" onClick={closeExchangeModal} className="dy-cancel-btn">취소</button>
                                        <button type="submit" onClick={openCompleteModal} className="dy-ok-btn">확인</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <br />
                                    <div className="dy-end-content">현재 포인트가 부족합니다.</div>
                                    <div className="dy-end-content">이 제품의 구매를 원하시나요?</div>
                                    <br />
                                    <div className="dy-end-content">원하시는 제품을 구매하시려면</div>
                                    <div className="dy-end-content">챌린지를 통해 포인트를 쌓아주세요.</div>
                                    <div className="dy-one-btn">
                                        <button type="button" onClick={closeExchangeModal} className="dy-cancel-btn">확인</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {/* /포인트 교환 모달 */}

                {/* 교환 완료 모달 */}
                {isCompleteModalOpen && selectedItemComplete && (
                    <div className="modal-background">
                        <div className="dy-end-modal">
                            <h3>교환 완료</h3>
                            <div className="dy-end-content">교환되었습니다.</div>
                            <br />
                            <div className="dy-end-content">{selectedItemComplete.itemCost} 포인트를 사용하였습니다.</div>
                            <div className="dy-end-content">잔여 포인트는 {historyPoint  - selectedItemComplete.itemCost} 포인트입니다.</div>
                            <br />
                            <div className="dy-end-content">마이페이지를 확인해주세요.</div>
                            <div className="dy-one-btn">
                                <button type="button" onClick={closeCompleteModal} className="dy-end-btn">확인</button>
                            </div>
                        </div> 
                    </div> 
                )}
                {/* /교환 완료 모달 */}

                </div>
                {/* /dy-pointstoremain */}
            </div>
            {/* /wrap */}

            {/* 푸터 */}
            <Footert/>
            {/* 푸터 끝 */}
        </>
    );
}

export default DH_PointStoreMain;