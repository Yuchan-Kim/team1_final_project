import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const NaverLoginCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const processNaverLogin = async () => {
            try {
                // URL에서 access_token 파싱
                const hash = location.hash.substring(1);
                const params = new URLSearchParams(hash);
                const accessToken = params.get('access_token');

                if (!accessToken) {
                    throw new Error('액세스 토큰이 없습니다');
                }

                // 백엔드에 토큰 전송하여 처리
                const loginResponse = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/users/naver/login`,
                    { accessToken },
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                );

                if (loginResponse.data.result === 'success') {
                    localStorage.setItem("token", loginResponse.headers.authorization.split(' ')[1]);
                    localStorage.setItem("authUser", JSON.stringify(loginResponse.data.apiData));
                    localStorage.setItem("naverAccessToken", accessToken);
                    navigate("/");
                } else {
                    throw new Error('로그인 실패');
                }
            } catch (error) {
                console.error(error);
                navigate("/user/loginform");
            }
        };

        processNaverLogin();
    }, [navigate, location]);

    return <div>처리중...</div>;
};

export default NaverLoginCallback;