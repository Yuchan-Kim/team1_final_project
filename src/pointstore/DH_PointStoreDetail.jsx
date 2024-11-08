//import 라이브러리
import React from 'react';
// import { Link } from 'react-router-dom';
// import React, {useState} from 'react';	화면 상태관리
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import DH_Header from '../include/DH_Header';

//import css
import '../css/dh_pointstoredetail.css';


const DH_PointStoreDetail = () => {

	/*---일반 변수 --------------------------------------------*/

	/*---라우터 관련------------------------------------------*/

	/*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/


    return (
        <>
            <DH_Header />
            {/* // header */}
            
			<div className="wrap">
                <div className="dy-pointstoredetail">
                    <h1 className="dy-pointstoredetailTitle">교환하기</h1>

                    <div className="dy-detailContent">
                        <img src="../images/pointproduct.jpg" className="dy-pointstoredetail-pointproduct" alt="pointproduct" />
                        <div className="dy-detailContent-left">
                            <div className="dy-product-name">스타벅스 아이스 아메리카노  Tall</div>
                            <div className="dy-product-point">5,000 P</div>
                            <div className="dy-product-warning">&nbsp; &#8226; &nbsp;본 상품은 환불불가 상품입니다.</div>
                            <div className="dy-product-count">수량</div>
                            <div className="dy-counts">
                                <button type="button" className="dy-minus-btn">─</button>
                                <div className="dy-count">1</div>
                                <button type="button" className="dy-plus-btn">┼</button>
                            </div>
                            <div className="dy-product-period">사용기간 : 30일 이내 (기간내에 미사용시 사용불가)</div>
                            <div className="dy-product-check">발송방법 : 마이페이지에서 확인</div>
                            <button type="submit" className="dy-change-btn">교환하기</button>
                        </div>
                        {/* /dy-detailContent-left */}
                    </div>
                    {/* /dy-detailContent */}
                </div>
                {/* /dy-pointstoremain */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_PointStoreDetail;