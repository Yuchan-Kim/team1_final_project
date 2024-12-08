// src/ham_pages/ham_mobile/ham_mobileUser.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Import 소셜 로그인 컴포넌트
import Ham_KakaoLogin from './ham_KakaoLogin';
import Ham_NaverLogin from './ham_NaverLogin';
import Ham_GoogleLogin from './ham_GoogleLogin';
import profileStore from '../ham_common/profileStore';

// Import CSS
import '../../ham_asset/css/hmk_mobileUser.css';

const Ham_MobileAuth = () => {
    /*--- 상태 관리 변수들 ------------------------------------------*/
    const [isLogin, setIsLogin] = useState(true); // true: 로그인, false: 회원가입
    // 로그인 상태 관리
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPw, setLoginPw] = useState('');
    const [loginError, setLoginError] = useState('');

    const [userEmail, setUserEmail] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [isEmailChecked, setIsEmailChecked] = useState(false);

    const [userName, setUserName] = useState("");
    const [nameMessage, setNameMessage] = useState("");
    const [isNameAvailable, setIsNameAvailable] = useState(true);
    const [isNameChecked, setIsNameChecked] = useState(false);

    const [userPw, setUserPw] = useState("");
    const [userPw2, setUserPw2] = useState("");
    const [pwMatch, setPwMatch] = useState(true);
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#&*?]).{10,}$/;
    const [isPwValid, setIsPwValid] = useState(true);

    // 약관 동의 상태 관리
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);

    const navigate = useNavigate();

    /*--- 이벤트 핸들러 -----------------------------------------*/
    const handleEmailChange = (e) => {
        setUserEmail(e.target.value);
        setIsEmailChecked(false);
        setEmailMessage("");
    };

    const handleNameChange = (e) => {
        setUserName(e.target.value);
        setIsNameChecked(false);
        setNameMessage("");
    };

    const handlePwChange = (e) => {
        setUserPw(e.target.value);
        checkPw(e.target.value, userPw2);

        const isValid = pwRegex.test(e.target.value);
        setIsPwValid(isValid);
    };

    const handlePw2Change = (e) => {
        setUserPw2(e.target.value);
        checkPw(userPw, e.target.value);
    };

    const checkPw = (password1, password2) => {
        setPwMatch(password1 === password2);
    };

    const handleEmailCheck = () => {
        if (!userEmail) {
            alert("이메일을 입력해주세요.");
            return;
        }

        axios.post(`${process.env.REACT_APP_API_URL}/api/users/email/${userEmail}`, {
            userEmail: userEmail
        }, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            responseType: 'json'
        })
            .then(response => {
                if (response.data.result === 'success') {
                    setIsEmailAvailable(true);
                    setEmailMessage('사용 가능한 이메일입니다.');
                    setIsEmailChecked(true);
                } else {
                    setIsEmailAvailable(false);
                    setEmailMessage('이미 가입된 이메일입니다.');
                }
            })
            .catch(error => {
                console.error(error);
                setIsEmailAvailable(false);
                setEmailMessage('이메일 중복 확인에 실패했습니다.');
            });
    };

    const handleNameCheck = () => {
        if (!userName) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        axios.post(`${process.env.REACT_APP_API_URL}/api/users/name/${userName}`, {
            userName: userName
        }, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            responseType: 'json'
        })
            .then(response => {
                if (response.data.result === 'success') {
                    setIsNameAvailable(true);
                    setNameMessage('사용 가능한 닉네임입니다.');
                    setIsNameChecked(true);
                } else {
                    setIsNameAvailable(false);
                    setNameMessage('이미 가입된 닉네임입니다.');
                }
            })
            .catch(error => {
                console.error(error);
                setIsNameAvailable(false);
                setNameMessage('닉네임 중복 확인에 실패했습니다.');
            });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');

        const userVo = {
            userEmail: "event@event.com",
            userPw: "event"
        };

        try {
            const response = await axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/api/users/login`,
                headers: { "Content-Type": "application/json; charset=utf-8" },
                data: userVo,
                responseType: 'json',
                withCredentials: true // 쿠키 전송을 위해 필요
            });

            if (!response.data.apiData) {
                setLoginError("사용자 정보를 받아오지 못했습니다.");
                return;
            }

            const authHeader = response.headers['authorization'];
            if (!authHeader) {
                setLoginError("이메일과 비밀번호를 다시 확인해주세요.");
                return;
            }

            const token = authHeader.split(' ')[1];

            // 쿠키로 토큰 저장 (httpOnly, secure 옵션 추가)
            document.cookie = `token=${token}; path=/; domain=challengedonkey.com; max-age=86400; secure; samesite=strict`;

            // localStorage에도 사용자 정보 저장
            localStorage.setItem("authUser", JSON.stringify(response.data.apiData));
            localStorage.setItem("token", token);

            // profileStore 설정
            profileStore.setUserNum(response.data.apiData.userNum);
            profileStore.setToken(token);
            profileStore.setUserInfo(response.data.apiData);

            await profileStore.loadUserData();

            if (response.data.result === 'success') {
                navigate("/mobile/home");
            } else {
                setLoginError("로그인에 실패했습니다.");
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError('로그인 중 오류가 발생했습니다.');
        }
    };

    // 회원가입 핸들러
    const handleJoin = (e) => {
        e.preventDefault();

        if (!userPw || !userPw2) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (!pwRegex.test(userPw)) {
            alert("비밀번호가 조건에 부합하지 않습니다. 조건을 확인하세요.");
            return;
        }

        if (!isEmailChecked || !isNameChecked) {
            alert("이메일 또는 닉네임의 중복 체크를 완료해주세요.");
            return;
        }

        if (!isEmailAvailable || !isNameAvailable) {
            alert("이메일 또는 닉네임이 이미 존재합니다.");
            return;
        }

        if (!pwMatch) {
            alert("비밀번호 재입력하여 비밀번호를 확인해주세요.");
            return;
        }

        // 약관 동의 확인
        if (!agreeTerms || !agreePrivacy) {
            alert("서비스 이용약관 및 개인정보처리방침에 동의해주세요.");
            return;
        }

        const userVo = {
            userEmail: userEmail,
            userPw: userPw,
            userName: userName
        };

        axios.post(`${process.env.REACT_APP_API_URL}/api/users`, userVo, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            responseType: 'json'
        })
            .then(response => {
                if (response.data.result === 'success') {
                    navigate("/mobile/home");
                } else {
                    alert("회원등록에 실패했습니다.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("회원등록 중 오류가 발생했습니다.");
            });
    };

    /*--- 소셜 로그인 핸들러 -------------------------------------*/
    const handleSocialLogin = (platform) => {
        switch (platform) {
            case 'kakao':
                handleKakaoLogin();
                break;
            case 'naver':
                handleNaverLogin();
                break;
            case 'google':
                handleGoogleLogin();
                break;
            default:
                console.error("지원되지 않는 소셜 로그인 플랫폼입니다.");
        }
    };

    /*--- 소셜 로그인 메소드 -------------------------------------*/
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const handleKakaoLogin = () => {
        window.location.href = kakaoURL;
    };

    const handleNaverLogin = () => {
        const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
        const NAVER_CALLBACK_URL = process.env.REACT_APP_NAVER_CALLBACK_URL;
        const state = generateRandomString(16); // CSRF 방지를 위한 상태 토큰 생성
        const mobileCallbackUrl = `${NAVER_CALLBACK_URL}?redirect=/mobile/home`;
        const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_CLIENT_ID}&response_type=code&redirect_uri=${mobileCallbackUrl}&state=${state}`;
        window.location.href = naverAuthURL;
    };

    const handleGoogleLogin = () => {
        const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        const GOOGLE_CALLBACK_URL = process.env.REACT_APP_GOOGLE_CALLBACK_URL;
        const redirectPath = "/mobile/home";
        const state = encodeURIComponent(redirectPath);
        const scope = encodeURIComponent('profile email');
        
        // mobileCallbackUrl 제거하고 state 파라미터만 사용
        const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&response_type=code&scope=${scope}&access_type=offline&state=${state}`;
        
        window.location.href = googleAuthURL;
    };

    // 상태 토큰 생성 함수 예시
    const generateRandomString = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    return (
        <div className="hmk-wrap">
            <div className="hmk-joinform">
                <h1 className="hmk-joinTitle">
                    {isLogin ? 'DONKEY 로그인' : '지금 바로 DONKEY 가입하고 함께 동기를 키워봐요'}
                </h1>

                <div className="hmk-joinform-content">
                    {isLogin ? (
                        // 로그인 폼
                        <form onSubmit={handleLogin}>
                            <div className="hmk-joinform-group">
                                <label className="hmk-join-label">이메일</label>
                                <input
                                    type="email"
                                    className="hmk-join-input"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="이메일을 입력하세요"
                                    required
                                />
                            </div>

                            <div className="hmk-joinform-group">
                                <label className="hmk-join-label">비밀번호</label>
                                <input
                                    type="password"
                                    className="hmk-join-input"
                                    value={loginPw}
                                    onChange={(e) => setLoginPw(e.target.value)}
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                />
                            </div>

                            {loginError && (
                                <div className="hmk-message hmk-error">
                                    &#8226; {loginError}
                                </div>
                            )}

                            <button type="submit" className="hmk-submit-btn">로그인</button>

                            <div className="hmk-divider">───────  또는  ───────</div>

                            <div className="hmk-social-logins">
                                <Ham_KakaoLogin onLogin={handleSocialLogin} />
                                <Ham_GoogleLogin onLogin={handleSocialLogin} />
                                <Ham_NaverLogin onLogin={handleSocialLogin} />
                            </div>

                            <div className="hmk-to-loginform">
                                <span
                                    className="hmk-link"
                                    onClick={() => setIsLogin(false)}
                                >
                                    계정이 없으신가요? 여기에서 가입하세요
                                </span>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleJoin}>
                            {/* 이메일 입력 */}
                            <div className="hmk-joinform-group">
                                <label className="hmk-join-label">이메일</label>
                                <div className="hmk-input-group">
                                    <input
                                        type="email"
                                        className="hmk-join-input"
                                        value={userEmail}
                                        onChange={handleEmailChange}
                                        placeholder="이메일을 입력하세요"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="hmk-emailcheck-btn"
                                        onClick={handleEmailCheck}
                                    >
                                        중복체크
                                    </button>
                                </div>
                                {emailMessage && (
                                    <div className={`hmk-message ${isEmailAvailable ? 'hmk-success' : 'hmk-error'}`}>
                                        &#8226; {emailMessage}
                                    </div>
                                )}
                            </div>

                            {/* 닉네임 입력 */}
                            <div className="hmk-joinform-group">
                                <label className="hmk-join-label">닉네임</label>
                                <div className="hmk-input-group">
                                    <input
                                        type="text"
                                        className="hmk-join-input"
                                        value={userName}
                                        onChange={handleNameChange}
                                        placeholder="닉네임을 입력하세요"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="hmk-namecheck-btn"
                                        onClick={handleNameCheck}
                                    >
                                        중복체크
                                    </button>
                                </div>
                                {nameMessage && (
                                    <div className={`hmk-message ${isNameAvailable ? 'hmk-success' : 'hmk-error'}`}>
                                        &#8226; {nameMessage}
                                    </div>
                                )}
                            </div>

                            {/* 비밀번호 입력 */}
                            <div className="hmk-joinform-group">
                                <label className="hmk-join-label">비밀번호</label>
                                <input
                                    type="password"
                                    className="hmk-join-input"
                                    value={userPw}
                                    onChange={handlePwChange}
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                />
                                {!isPwValid && (
                                    <div className="hmk-message hmk-error">
                                        <div>비밀번호에는 다음 문자가 반드시 포함되어야 합니다.</div>
                                        <ol>
                                            <li>&#8226; 문자 1개</li>
                                            <li>&#8226; 숫자 또는 특수 문자 1개 (예: # ? ! &)</li>
                                            <li>&#8226; 10자 이상</li>
                                        </ol>
                                    </div>
                                )}
                            </div>

                            {/* 비밀번호 재입력 */}
                            <div className="hmk-joinform-group">
                                <label className="hmk-join-label">비밀번호 재입력</label>
                                <input
                                    type="password"
                                    className="hmk-join-input"
                                    value={userPw2}
                                    onChange={handlePw2Change}
                                    placeholder="비밀번호를 다시 입력하세요"
                                    required
                                />
                                {!pwMatch && userPw2 && (
                                    <div className="hmk-message hmk-error">
                                        &#8226; 비밀번호가 일치하지 않습니다.
                                    </div>
                                )}
                            </div>

                            {/* 약관 동의 체크박스 */}
                            <div className="hmk-joinform-group hmk-agree-group">
                                <label className="hmk-agree-label">
                                    <input
                                        type="checkbox"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        required
                                    />
                                    <span> <Link to="/terms" target="_blank" className="hmk-link">(필수) 서비스 이용약관 동의</Link></span>
                                </label>
                            </div>

                            <div className="hmk-joinform-group hmk-agree-group">
                                <label className="hmk-agree-label">
                                    <input
                                        type="checkbox"
                                        checked={agreePrivacy}
                                        onChange={(e) => setAgreePrivacy(e.target.checked)}
                                        required
                                    />
                                    <span> <Link to="/privacy" target="_blank" className="hmk-link">(필수) 개인정보 처리방침 동의</Link></span>
                                </label>
                            </div>

                            {/* 가입하기 버튼 */}
                            <button type="submit" className="hmk-submit-btn">가입하기</button>

                            {/* 구분선 */}
                            <div className="hmk-divider">───────  또는  ───────</div>

                            {/* 소셜 로그인 버튼들 */}
                            <div className="hmk-social-logins">
                                <Ham_KakaoLogin onLogin={handleSocialLogin} />
                                <Ham_GoogleLogin onLogin={handleSocialLogin} />
                                <Ham_NaverLogin onLogin={handleSocialLogin} />
                            </div>

                            {/* 로그인 페이지로 이동 */}
                            <div className="hmk-to-loginform">
                                <span
                                    className="hmk-link"
                                    onClick={() => setIsLogin(true)}
                                >
                                    이미 계정이 있나요? 여기에서 로그인하세요
                                </span>
                            </div>
                        </form>
                    )}
                </div>
                {/* /hmk-joinform-content */}
            </div>
            {/* /hmk-joinform */}
        </div>
    );
};

export default Ham_MobileAuth;
