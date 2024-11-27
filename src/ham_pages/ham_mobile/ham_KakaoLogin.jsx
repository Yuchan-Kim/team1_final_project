// src/ham_pages/ham_mobile/ham_KakaoLogin.jsx
import React from 'react';
import SocialLogin from './SocialLogin';

const Ham_KakaoLogin = ({ onLogin }) => {
    return <SocialLogin platform="kakao" onLogin={onLogin} />;
};

export default Ham_KakaoLogin;
