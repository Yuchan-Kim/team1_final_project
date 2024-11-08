//import 라이브러리
import React from 'react';
import { Link } from 'react-router-dom';
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


    return (
        <>
            <DH_Header />
            {/* // header */}
            
			<div className="wrap">
                <div className="dy-pointstoremain">
                    <h1 className="dy-pointstoremainTitle">포인트 상점</h1>
                    <div className="dy-attendance">
                        <button type="button" className="dy-attendance-btn">출석하기</button>
                    </div>
                    <div className="dy-product-sections">
                        <h2 className="dy-product-header">이벤트 상품으로 교환</h2>
                        <div  className="dy-product-section">
                            <div className="dy-product-info">
                                <Link to="" className="dy-link" rel="noreferrer noopener">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}  
                                </Link>
                            </div>
                            {/* /dy-product-info */}

                            {/* 반복 */}
                            <div className="dy-product-info">
                                <Link to="" className="dy-link" rel="noreferrer noopener">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}  
                                </Link>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                <Link to="" className="dy-link" rel="noreferrer noopener">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}  
                                </Link>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                <Link to="" className="dy-link" rel="noreferrer noopener">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}  
                                </Link>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                            {/* 반복 */}
                            <div className="dy-product-info">
                                <Link to="" className="dy-link" rel="noreferrer noopener">
                                    <img src="../images/pointproduct.jpg" className="dy-pointstore-pointproduct" alt="pointproduct" />
                                    <div className="dy-product-details">
                                        <h3>스타벅스 아이스 아메리카노 Tall</h3>
                                        <p>5,000 P</p>
                                    </div>
                                    {/* /dy-product-details */}  
                                </Link>
                            </div>
                            {/* /dy-product-info */}
                            {/* /반복 */}
                        </div>

                    </div>
                    {/* /dy-product-section */}
                </div>
                {/* /dy-pointstoremain */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_PointStoreMain;