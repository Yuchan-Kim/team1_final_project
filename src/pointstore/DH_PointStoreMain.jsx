//import 라이브러리
import React, {useState} from 'react';
//import { Link } from 'react-router-dom';
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import Header from '../include/DH_Header';

//import css
import '../css/dh_pointstoremain.css';


const DH_PointStoreMain = () => {

	/*---일반 변수 --------------------------------------------*/

	/*---라우터 관련------------------------------------------*/

	/*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);      // 상품 상세 모달
    const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);  // 포인트 교환 모달
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);  // 교환 완료 모달

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 출석체크 알림 함수
    const handleAttendance = () => {
        const today = new Date().toLocaleDateString(); // 오늘 날짜 포맷
        alert(`${today}\n출석체크 되었습니다!`);
    };


    // 모달 열기/닫기 함수
    const openDetailModal = () => setIsDetailModalOpen(true);
    const closeDetailModal = () => setIsDetailModalOpen(false);
    
    const openExchangeModal = () => {
        setIsDetailModalOpen(false); // 이전 모달 닫기
        setIsExchangeModalOpen(true); // 포인트 교환 모달 열기
    };
    const closeExchangeModal = () => setIsExchangeModalOpen(false);

    const openCompleteModal = () => {
        setIsExchangeModalOpen(false); // 이전 모달 닫기
        setIsCompleteModalOpen(true); // 교환 완료 모달 열기
    };
    const closeCompleteModal = () => setIsCompleteModalOpen(false);


    return (
        <>
            <Header />
            {/* // header */}
            
			<div className="wrap">
                <div className="dy-pointstoremain">
                    <div className="dy-pointstoremain-header">
                        <h1 className="dy-pointstoremainTitle">포인트 상점</h1>
                        <button type="button" onClick={handleAttendance} className="dy-attendance-btn">출석하기</button>
                    </div>
                    <div className="dy-product-sections">
                        <h2 className="dy-product-header">이벤트 상품으로 교환</h2>
                        <div  className="dy-product-section">
                            <div className="dy-product-info">
                                <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                <div className="dy-product-details">
                                    <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                    <p>5,000 P</p>
                                </div>
                                {/* /dy-product-details */}
                                <button type="button" onClick={openDetailModal} className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}

                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                        </div>
                    </div>
                    {/* /dy-product-section */}



                    {/* 세션 반복 */}
                    <div className="dy-product-sections">
                        <h2 className="dy-product-header">꾸미기 아이템으로 교환</h2>
                        <div  className="dy-product-section">
                            <div className="dy-product-info">
                                <img src="../images/profile.png" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                <div className="dy-product-details">
                                    <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                    <p>5,000 P</p>
                                </div>
                                {/* /dy-product-details */}
                                <button type="button" onClick={openDetailModal} className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}

                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/profile.png" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/profile.png" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/profile.png" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/profile.png" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                        </div>
                    </div>
                    {/* /dy-product-section */}

                    {/* 세션 반복 */}
                    <div className="dy-product-sections">
                        <h2 className="dy-product-header">기프티콘으로 교환</h2>
                        <div  className="dy-product-section">
                            <div className="dy-product-info">
                                <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                <div className="dy-product-details">
                                    <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                    <p>5,000 P</p>
                                </div>
                                {/* /dy-product-details */}
                                <button type="button" onClick={openDetailModal} className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}

                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}
                                    <button type="button" className="dy-product-btn">교환하기</button>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                        </div>
                    </div>
                    {/* /dy-product-section */}







                {/* 상품상세 모달 */}
                {isDetailModalOpen && (
                    <div className="modal-background">
                        <div className="dy-detailContent-modal">
                            <div className="dy-close">
                                <button type="button" onClick={closeDetailModal} className="dy-close-btn">&times;</button>
                            </div>
                            <div className="dy-detailContent">
                                <img src="../images/pointproduct.jpg" className="dy-detailContent-pointproduct" alt="pointproduct" />
                                <div className="dy-detailContent-left">
                                    <div className="dy-product-name">스타벅스 아이스 아메리카노 Tall</div>
                                    <div className="dy-product-point">5,000 P</div>
                                    <div className="dy-product-warning">&nbsp; &#8226; &nbsp;본 상품은 환불불가 상품입니다.</div>
                                    <div className="dy-product-period">사용기간 : 30일 이내 (기간내에 미사용시 사용불가)</div>
                                    <div className="dy-product-check">발송방법 : 마이페이지에서 확인</div>
                                    
                                    <button type="submit" onClick={openExchangeModal} className="dy-change-btn">교환하기</button>
                                </div>
                                {/* /dy-detailContent-left */}
                            </div> 
                            {/* /dy-detailContent */}
                        </div>
                    </div>
                )}
                {/* /상품상세 모달 */}

                {/* 포인트 교환 모달 */}
                {isExchangeModalOpen && (
                    <div className="modal-background">
                        <div className="dy-change-modal">
                            <h3>포인트 교환</h3>
                            <div className="dy-end-content">10,000 포인트를 사용하여 교환하시겠습니까?</div>
                            <br /><br />
                            <div className="dy-end-content">상품명: 아메라카노</div>
                            <div className="dy-end-content">상품가격: 10,000 P</div>
                            <div className="dy-end-content">발송방법: 마이페이지에서 확인</div>
                            <div className="dy-two-btn">
                                <button type="button" onClick={closeExchangeModal} className="dy-cancel-btn">취소</button>
                                <button type="submit" onClick={openCompleteModal} className="dy-ok-btn">확인</button>
                            </div>
                        </div> 
                    </div>
                )}
                {/* /포인트 교환 모달 */}

                {/* 교환 완료 모달 */}
                {isCompleteModalOpen && (
                    <div className="modal-background">
                        <div className="dy-end-modal">
                            <h3>교환 완료</h3>
                            <div className="dy-end-content">교환되었습니다.</div>
                            <br />
                            <div className="dy-end-content">10,000 포인트를 사용하였습니다.</div>
                            <div className="dy-end-content">잔여 포인트는 32,000 포인트입니다.</div>
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
        </>
    );
}

export default DH_PointStoreMain;