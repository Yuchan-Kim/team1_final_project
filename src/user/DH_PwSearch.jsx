//import 라이브러리
import React from 'react';
//import { Link } from 'react-router-dom';
// import React, {useState} from 'react';	화면 상태관리
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import Header from '../pages/include/DH_Header';

//import css
import '../css/dh_pwsearch.css';


const DH_PwSearch = () => {

	/*---일반 변수 --------------------------------------------*/

	/*---라우터 관련------------------------------------------*/

	/*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/


    return (
        <>
            <Header />
            {/* // header */}

			<div className="wrap">
                <div className="dy-pwsearch">
                    <h1 className="dy-pwsearchTitle">비밀번호 찾기</h1>

                    <div className="dy-pwsearch-content">
                        <div className="dy-pwsearch-search">
                            <div className="dy-search-word">이메일</div>
                            <input className="dy-search-input"></input>
                        </div>
                        
                        <div className="dy-pwsearch-search">
                            <div className="dy-search-word">닉네임</div>
                            <input className="dy-search-input"></input>
                            <div className="dy-message">&nbsp; &#8226; 없는 정보입니다. 다시 입력해주세요.</div>
                        </div>

                        <button type="button" className="dy-next-btn">다음</button>
                        
                        <div className="dy-pwsearch-search">
                            <div className="dy-search-word">임시 비밀번호 생성</div>
                            <input className="dy-search-input"></input>
                        </div>

                        <button type="submit" className="dy-ok-btn">확인</button>

                    </div>
                    {/* /dy-pwsearch-content */}
                </div>
                {/* /dy-pwsearch */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_PwSearch;