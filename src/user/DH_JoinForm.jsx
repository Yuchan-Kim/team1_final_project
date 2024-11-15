//import 라이브러리
import React, {useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트
import Header from '../pages/include/DH_Header';

//import css
import '../css/dh_joinform.css';


const DH_JoinForm = () => {

	/*---일반 변수 --------------------------------------------*/

	/*---라우터 관련------------------------------------------*/

	/*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/
    const [userEmail, setUserEmail] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userName, setUserName] = useState('');

    const navigate = useNavigate();

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 아이디
    const handleEmail =(e)=> {
        setUserEmail(e.target.value);
    }

    // 비밀번호
    const handlePw =(e)=> {
        setUserPw(e.target.value);
    }

    // 이름
    const handleName =(e)=> {
        setUserName(e.target.value);
    }

    // 회원가입버튼 클릭했을때
    const handleJoin = (e)=> {
        e.preventDefault(); 

        const userVo= {
            userEmail: userEmail,
            userPw: userPw,
            userName: userName
        }
        console.log(userVo);

        // 서버로 데이터 전송
        axios({
            method: 'post',         // 저장 (등록)
            url: `${process.env.REACT_APP_API_URL}/api/users`,

            headers: { "Content-Type": "application/json; charset=utf-8" }, 	

            data: userVo, // put, post, JSON(자동변환됨)

            responseType: 'json' //수신타입 받을때
        }).then(response => {
            console.log(response.data); //수신데이타

            if (response.data.result ==='success') {
                // 리다이렉트
                navigate("/user/loginform");
            
            }else {
                alert("회원등록실패");
            }

        }).catch(error => {
            console.log(error);
        });

    }


    return (
        <>
            <Header />
            {/* // header */}

			<div className="wrap">
                <div className="dy-joinform">
                    <h1 className="dy-joinTitle">가입하고 원하는 콘텐츠를 즐기세요</h1>

                    <div className="dy-joinform-content">
                        <form action='' method='' onSubmit={handleJoin}> 
                            <div className="dy-joinform-join">
                                <div className="dy-join-word">이메일</div>
                                <input className="dy-join-input" value={userEmail} onChange={handleEmail}></input>
                                <div className="dy-message">&nbsp; &#8226; 이미 가입된 아이디입니다.</div>
                            </div>
                            <div className="dy-joinform-join">
                                <div className="dy-join-word">비밀번호</div>
                                <input className="dy-join-input" value={userPw} onChange={handlePw}></input>
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
                                <input className="dy-join-input" value={userName} onChange={handleName}></input>
                                <div className="dy-message">&nbsp; &#8226; 이미 가입된 닉네임입니다.</div>
                            </div>

                            <button type="submit" className="dy-submit-btn">가입하기</button>
                            <div>─────────── 또는 ───────────</div>

                            <div className="dy-api-joins">
                                <div className="dy-api-join">카카오로 계속하기</div>
                                <div className="dy-api-join">Google로 계속하기</div>
                                <div className="dy-api-join">네이버로 계속하기</div>
                            </div>

                            <div className="dy-to-loginform"><Link to="/user/loginform" className="dy-link" rel="noreferrer noopener">이미 계정이 있나요? 여기에서 로그인하세요</Link></div>
                        </form>
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