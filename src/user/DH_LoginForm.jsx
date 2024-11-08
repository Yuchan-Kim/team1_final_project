//import 라이브러리
import React from 'react';
import { Link } from 'react-router-dom';
// import React, {useState} from 'react';	화면 상태관리
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import DH_Header from '../include/DH_Header';

//import css
import '../css/dh_loginform.css';


const DH_LoginForm = () => {

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
                <div className="dy-loginform">
                    <h1 className="dy-loginTitle">DONKEY에 로그인하기</h1>
                    
                    <div className="dy-loginform-content">
                        <div className="dy-api-logins">
                            <div className="dy-api-login">카카오로 가입하기</div>
                            <div className="dy-api-login">Google로 가입하기</div>
                            <div className="dy-api-login">네이버로 가입하기</div>
                        </div>
                        {/* /dy-api-logins */}
                        <div className="dy-middle">─────────── 또는 ───────────</div>

                        <div className="dy-loginform-login">
                            <div className="dy-login-word">이메일</div>
                            <input className="dy-login-input"></input>
                        </div>
                        <div className="dy-loginform-login">
                            <div className="dy-login-word">비밀번호</div>
                            <input className="dy-login-input"></input>
                        </div>

                        <button type="submit" className="dy-submit-btn">로그인</button>
                        <div className="dy-password-search"><Link to="" className="dy-link" rel="noreferrer noopener">비밀번호</Link>를 잊었나요?</div>
                        <div className="dy-to-joinform">계정이 없나요? DONKEY에 <Link to="" className="dy-link" rel="noreferrer noopener">가입하기</Link></div>

                    </div>
                    {/* /dy-loginform-content */}
                </div>
                {/* /dy-loginform */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_LoginForm;