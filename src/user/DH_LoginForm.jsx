//import 라이브러리
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//import 컴포넌트
import Header from '../pages/include/DH_Header';
import NaverLogin from '../ham_pages/NaverLogin';
//import css
import '../css/dh_loginform.css';


const DH_LoginForm = () => {

    /*---일반 변수 --------------------------------------------*/
    const [userEmail, setUserEmail] = useState("");
    const [userPw, setUserPw] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    // oauth 요청 URL
    const kakaoURL2 = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    // 카카오 동의 항목
    const handleKakaoLogin = () => {
        window.location.href = kakaoURL2;
    };

    /*---라우터 관련------------------------------------------*/

    /*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

    /*---일반 메소드 -----------------------------------------*/

    /*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 이메일
    const handleEmail =(e)=> {
        setUserEmail(e.target.value);
    }

    // 비밀번호
    const handlePw =(e)=> {
        setUserPw(e.target.value);
    }

    // 로그인버튼 클릭했을때 (전송)
    const handleLogin = (e)=> {
        e.preventDefault(); 

        const userVo = {
            userEmail: userEmail,
            userPw: userPw
        }
        console.log(userVo);

        // 서버로 데이터 전송
        axios({
            method: 'post', 
            url: `${process.env.REACT_APP_API_URL}/api/users/login`,

            headers: { "Content-Type": "application/json; charset=utf-8" },    // post put

            data: userVo, // put, post, JSON(자동변환됨)

            responseType: 'json' //수신타입 받을때
        }).then(response => {
            console.log(response.data); //수신데이타

            // 응답처리
            JSON.stringify(response.data.apiData); 
            const authHeader = response.headers['authorization'];

            if (authHeader) {
                const token = authHeader.split(' ')[1]; 
                localStorage.setItem("token", token);

            } else {    // 없는정보일떄
                setErrorMessage("이메일과 비밀번호를 다시 확인해주세요.");
                return;   
            }
            
            localStorage.setItem("authUser", JSON.stringify(response.data.apiData));

            // 응답처리
            if (response.data.result ==='success') {
                // 리다이렉트
                navigate("/");       
                
            }else {
                alert("로그인 실패.");
            }
            
        }).catch(error => {
            console.log(error);
        });

    };


    return (
        <>
            <Header />
            {/* // header */}
            
            <div className="wrap">
                <div className="dy-loginform">
                    <h1 className="dy-loginTitle">DONKEY에 로그인하기</h1>
                    
                    <div className="dy-loginform-content">
                        <div className="dy-api-logins">
                            <div id="kakaoIdLogin">
                                <img className="dy-kakao-login"
                                src="/images/kakao_login_medium_wide.png"
                                alt="카카오로 계속하기"
                                onClick={handleKakaoLogin}
                                />
                            </div>
                            {/* <div className="dy-api-login">Google로 계속하기</div> */}
                            <div className="dy-naver-login">
                                <NaverLogin />
                                <p>네이버 로그인</p>
                            </div>
                            
                        </div>
                        {/* /dy-api-logins */}
                        <div className="dy-middle">─────────── 또는 ───────────</div>

                        <form action='' method='' onSubmit={handleLogin}>
                            <div className="dy-loginform-login">
                                <div className="dy-login-word">이메일</div>
                                <input type="text" className="dy-login-input"  value={userEmail} onChange={handleEmail} />
                            </div>
                            <div className="dy-loginform-login">
                                <div className="dy-login-word">비밀번호</div>
                                <input type="password" className="dy-login-input" value={userPw} onChange={handlePw} />
                                {errorMessage && 
                                    <div className="dy-error-message">{errorMessage}</div>
                                }
                            </div>

                            <button type="submit" className="dy-submit-btn">로그인</button>
                        </form>
                        <div className="dy-password-search"><Link to="/user/pwsearch" className="dy-link" rel="noreferrer noopener">비밀번호를 잊었나요?</Link></div>
                        <div className="dy-to-joinform"><Link to="/user/joinform" className="dy-link" rel="noreferrer noopener">계정이 없나요? DONKEY에 가입하기</Link></div>

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