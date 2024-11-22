// NaverLogin.js
import React, { useEffect, useRef } from 'react';

const NaverLogin = () => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js";
        script.charset = "utf-8";
        
        script.onload = () => {
            if (window.naver_id_login && buttonRef.current) {
                const naver_id_login = new window.naver_id_login(
                    process.env.REACT_APP_NAVER_CLIENT_ID,
                    `${process.env.REACT_APP_NAVER_CALLBACK_URL}`  // 콜백 URL
                );
                naver_id_login.setButton("white", 3, 40);
                naver_id_login.setDomain(process.env.REACT_APP_NAVER_BASE_URL);
                naver_id_login.init_naver_id_login();
            }
            
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