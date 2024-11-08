//import 라이브러리
import React from 'react';
import { Link } from 'react-router-dom';
// import React, {useState} from 'react';	화면 상태관리
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import DH_Header from '../include/DH_Header';

//import css
import '../css/dh_joinform.css';


const DH_JoinForm = () => {

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
                <div className="dy-joinform">
                    <h1 className="dy-joinTitle">가입하고 원하는 콘텐츠를 즐기세요</h1>

                    <div className="dy-joinform-content">
                        <div className="dy-joinform-join">
                            <div className="dy-join-word">이메일</div>
                            <input className="dy-join-input"></input>
                            <div className="dy-message">&nbsp; &#8226; 이미 가입된 아이디입니다.</div>
                        </div>
                        <div className="dy-joinform-join">
                            <div className="dy-join-word">비밀번호</div>
                            <input className="dy-join-input"></input>
                            <div className="dy-message">
                                <div>비밀번호에는 다음 문자가 반드시 포함되어야 합니다.</div>
                                <ol>
                                    <li>&nbsp; &#8226; &nbsp; 문자 1개</li>
                                    <li>&nbsp; &#8226; &nbsp; 숫자 또는 특수 문자 1개 (예: # ? ! &)</li>
                                    <li>&nbsp; &#8226; &nbsp; 10자 이상</li>
                                </ol>
                            </div>
                        </div>
                        <div className="dy-joinform-join">
                            <div className="dy-join-word">비밀번호 재입력</div>
                            <input className="dy-join-input"></input>
                            <div className="dy-message">&nbsp; &#8226; 비밀번호가 일치하지 않습니다.</div>
                        </div>
                        <div className="dy-joinform-join">
                            <div className="dy-join-word">닉네임</div>
                            <input className="dy-join-input"></input>
                            <div className="dy-message">&nbsp; &#8226; 이미 가입된 닉네임입니다.</div>
                        </div>

                        <button type="submit" className="dy-submit-btn">가입하기</button>
                        <div>─────────── 또는 ───────────</div>

                        <div className="dy-api-joins">
                            <div className="dy-api-join">카카오로 계속하기</div>
                            <div className="dy-api-join">Google로 계속하기</div>
                            <div className="dy-api-join">네이버로 계속하기</div>
                        </div>

                        <div className="dy-to-loginform">이미 계정이 있나요? 여기에서 <Link to="" className="dy-link" rel="noreferrer noopener">로그인</Link>하세요</div>
                    </div>
                    {/* /dy-joinform-content */}
                </div>
                {/* /dy-joinform */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_JoinForm;