//import 라이브러리
import React from 'react';
//import { Link } from 'react-router-dom';
// import React, {useState} from 'react';	화면 상태관리
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import DH_Header from '../include/DH_Header';

//import css
import '../css/dh_pointstoremain.css';


const DH_PointStoreMain = () => {

	/*---일반 변수 --------------------------------------------*/

	/*---라우터 관련------------------------------------------*/

	/*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 출석체크 알림 함수
    const handleAttendance = () => {
        const today = new Date().toLocaleDateString(); // 오늘 날짜 포맷
        alert(`${today}\n출석체크 되었습니다!`);
    };


    return (
        <>
            <DH_Header />
            {/* // header */}
            
			<div className="wrap">
                <div className="dy-pointstoremain">
                    <h1 className="dy-pointstoremainTitle">포인트 상점</h1>
                    <div className="dy-attendance">
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
                                <button type="button" className="dy-product-btn">교환하기</button>
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
                <modal>
                    <div className="dy-detailContent-modal">
                        <div className="dy-close">
                            <button type="button" className="dy-close-btn">&times;</button>
                        </div>
                        <div className="dy-detailContent">
                            <img src="../images/pointproduct.jpg" className="dy-detailContent-pointproduct" alt="pointproduct" />
                            <div className="dy-detailContent-left">
                                <div className="dy-product-name">스타벅스 아이스 아메리카노 Tall</div>
                                <div className="dy-product-point">5,000 P</div>
                                <div className="dy-product-warning">&nbsp; &#8226; &nbsp;본 상품은 환불불가 상품입니다.</div>
                                <div className="dy-product-period">사용기간 : 30일 이내 (기간내에 미사용시 사용불가)</div>
                                <div className="dy-product-check">발송방법 : 마이페이지에서 확인</div>
                                
                                <button type="submit" className="dy-change-btn">교환하기</button>
                            </div>
                            {/* /dy-detailContent-left */}
                        </div> 
                        {/* /dy-detailContent */}
                    </div>
                </modal>
                {/* /상품상세 모달 */}

                {/* 포인트 교환 모달 */}
                <modal>
                    <div className="dy-change-modal">
                        <h3>포인트 교환</h3>
                        <div>10,000 포인트를 사용하여 교환하시겠습니까?</div>
                        <br /><br />
                        <div>상품명: 아메라카노</div>
                        <div>상품가격: 10,000 P</div>
                        <div>발송방법: 마이페이지에서 확인</div>
                        <div className="dy-two-btn">
                            <button type="button" className="dy-cancel-btn">취소</button>
                            <button type="submit" className="dy-ok-btn">확인</button>
                        </div>
                    </div> 
                </modal>
                {/* /포인트 교환 모달 */}

                {/* 교환 완료 모달 */}
                <modal>
                    <div className="dy-end-modal">
                        <h3>교환 완료</h3>
                        <div>교환되었습니다.</div>
                        <br />
                        <div>10,000 포인트를 사용하였습니다.</div>
                        <div>잔여 포인트는 32,000 포인트입니다.</div>
                        <br />
                        <div>마이페이지를 확인해주세요.</div>
                        <div className="dy-one-btn">
                            <button type="button" className="dy-end-btn">확인</button>
                        </div>
                    </div> 
                </modal>
                {/* /교환 완료 모달 */}

                </div>
                {/* /dy-pointstoremain */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_PointStoreMain;