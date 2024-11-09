//import 라이브러리
import React from 'react';
//import { Link } from 'react-router-dom';
// import React, {useState} from 'react';	화면 상태관리
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import DH_Header from '../include/DH_Header';

//import css
import '../css/dh_pwalter.css';


const DH_PwAlter = () => {

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
                <div className="dy-pwalter">
                    <h1 className="dy-pwalterTitle">비밀번호 변경</h1>

                    <div className="dy-pwalter-content">
                        <div className="dy-pwalter-alter">
                            <div className="dy-alter-word">임시 비밀번호</div>
                            <input className="dy-alter-input"></input>
                            <div className="dy-message">&nbsp; &#8226; 비밀번호가 틀렸습니다. 다시 입력해주세요.</div>
                        </div>
                        <div className="dy-pwalter-alter">
                            <div className="dy-alter-word">새로운 비밀번호</div>
                            <input className="dy-alter-input"></input>
                            <div className="dy-message">
                                <div>비밀번호에는 다음 문자가 반드시 포함되어야 합니다.</div>
                                <ol>
                                    <li>&nbsp; &#8226; &nbsp; 문자 1개</li>
                                    <li>&nbsp; &#8226; &nbsp; 숫자 또는 특수 문자 1개 (예: # ? ! &)</li>
                                    <li>&nbsp; &#8226; &nbsp; 10자 이상</li>
                                </ol>
                            </div>
                        </div>
                        <div className="dy-pwalter-alter">
                            <div className="dy-alter-word">비밀번호 재입력</div>
                            <input className="dy-alter-input"></input>
                            <div className="dy-message">&nbsp; &#8226; 비밀번호가 일치하지 않습니다.</div>
                        </div>
                        
                        <button type="submit" className="dy-submit-btn">비밀번호 변경하기</button>
                        
                    </div>
                    {/* /dy-joinform-content */}
                </div>
                {/* /dy-joinform */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_PwAlter;