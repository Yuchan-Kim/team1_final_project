//import 라이브러리
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

//import 컴포넌트
import Header from '../pages/include/DH_Header';
import Footert from "../pages/include/JM-Footer.jsx";

//import css
import '../css/dh_loginform.css';


const DH_LoginForm = () => {

    /*---일반 변수 --------------------------------------------*/
    const [userEmail, setUserEmail] = useState("");
    const [userPw, setUserPw] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    // oauth 요청 URL
    const kakaoURL2 = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    // 카카오 동의 항목
    const handleKakaoLogin = () => {
        window.location.href = kakaoURL2;
    };

    // 네이버 로그인 핸들러
    const handleNaverLogin = () => {
        const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
        const NAVER_REDIRECT_URI = process.env.REACT_APP_NAVER_CALLBACK_URL;
        const state = Math.random().toString(36).substr(2, 11);
        const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`;
        window.location.href = naverAuthURL;
    };

    // 구글 로그인 핸들러
    const handleGoogleLogin = () => {
        const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        const GOOGLE_REDIRECT_URI = encodeURIComponent(`${process.env.REACT_APP_API_URL}/api/users/google/login`);
        const scope = encodeURIComponent('email profile openid');
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
        window.location.href = googleAuthURL;
    };

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');

            if (code) {
                try {
                    console.log('Google auth code:', code);  // 코드 확인용 로그

                    const response = await axios.get(
                        `${process.env.REACT_APP_API_URL}/api/users/google/login?code=${code}`
                    );
                    console.log('Google login response:', response.data);  // 응답 확인용 로그

                    if (response.data.result === 'success' && response.data.apiData) {
                        // JWT 토큰 저장
                        const authHeader = response.headers['authorization'];
                        if (authHeader) {
                            const token = authHeader.split(' ')[1];
                            localStorage.setItem('token', token);
                        }

                        // 사용자 정보 저장
                        localStorage.setItem('authUser', JSON.stringify(response.data.apiData));

                        // 메인 페이지로 이동
                        window.location.href = '/';  // navigate 대신 직접 리다이렉트
                    } else {
                        console.error('Login failed:', response.data.message);
                        alert('로그인에 실패했습니다.');
                        navigate('/user/loginform');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('로그인 처리 중 오류가 발생했습니다.');
                    navigate('/user/loginform');
                }
            }
        };

        handleGoogleCallback();
    }, [navigate, location]);

    /*---라우터 관련------------------------------------------*/

    /*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

    /*---일반 메소드 -----------------------------------------*/

    /*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 이메일
    const handleEmail = (e) => {
        setUserEmail(e.target.value);
    }

    // 비밀번호
    const handlePw = (e) => {
        setUserPw(e.target.value);
    }

    // 로그인버튼 클릭했을때 (전송)
    const handleLogin = (e) => {
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
            if (response.data.result === 'success') {
                // 리다이렉트
                navigate("/");

            } else {
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

            <div className="dy-wrap">
                <div className="dy-loginform">
                    <h1 className="dy-loginTitle">DONKEY에 로그인하기</h1>

                    <div className="dy-loginform-content">
                        {/* /dy-api-logins */}
                        <form action='' method='' onSubmit={handleLogin}>
                            <div className="dy-loginform-login">
                                <div className="dy-login-word">이메일</div>
                                <input type="text" className="dy-login-input" value={userEmail} onChange={handleEmail} />
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
                        <div className="dy-middle">─────── 또는 ────────</div>
                        <div className="dy-api-logins">
                            <div className="dy-social-login-kakao dy-social-login" onClick={handleKakaoLogin}>
                                <img
                                    className="dy-apisocial-logins"
                                    src="https://challengedonkey.com/upload/icons/kakao-icon.png"
                                    alt="카카오로 계속하기"
                                />
                                <span>카카오 로그인</span>
                            </div>
                            <div className="dy-social-login-google dy-social-login" onClick={handleGoogleLogin}>
                                <img
                                    className="dy-apisocial-logins"
                                    src="https://challengedonkey.com/upload/icons/google-icon.png"
                                    alt="구글로 로그인"
                                />
                                <span>구글 로그인</span>
                            </div>
                            <div className="dy-social-login-naver dy-social-login" onClick={handleNaverLogin}>
                                <img
                                    className="dy-apisocial-logins"
                                    src="https://challengedonkey.com/upload/icons/naver-icon.png"
                                    alt="네이버로 로그인"
                                />
                                <span>네이버 로그인</span>
                            </div>
                        </div>
                        <div className="dy-to-joinform"><Link to="/user/joinform" className="dy-link" rel="noreferrer noopener">계정이 없나요? DONKEY에 가입하기</Link></div>

                    </div>
                    {/* /dy-loginform-content */}
                </div>
                {/* /dy-loginform */}
            </div>
            {/* /wrap */}

            {/* 푸터 */}
            <Footert />
            {/* 푸터 끝 */}
        </>
    );
}

export default DH_LoginForm;