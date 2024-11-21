// NaverLogin.js
import React, { useEffect, useRef } from 'react';
import '../ham_asset/css/ham_naverlogin.css';  // CSS 파일 추가

const NaverLogin = () => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js";
        script.charset = "utf-8";
        
        script.onload = () => {
            const naverLogin = new naver_id_login(
                process.env.REACT_APP_NAVER_CLIENT_ID, 
                "http://localhost:3000/naver/callback"
            );
            naverLogin.setButton("white", 2, 40);
            naverLogin.setDomain("http://localhost:3000");
            naverLogin.init_naver_id_login();
            
            // 버튼 스타일 초기화
            const loginButton = document.getElementById("naver_id_login").firstChild;
            if (loginButton) {
                loginButton.style.display = 'block';
            }
        };

        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return (
        <div className="naver-login-container" ref={buttonRef} id="naver_id_login"></div>
    );
};

export default NaverLogin;

