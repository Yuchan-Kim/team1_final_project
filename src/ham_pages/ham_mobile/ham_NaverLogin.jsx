// src/ham_pages/ham_mobile/ham_NaverLogin.jsx
import React from 'react';
import SocialLogin from './SocialLogin';

const Ham_NaverLogin = ({ onLogin }) => {
    return <SocialLogin platform="naver" onLogin={onLogin} />;
};

export default Ham_NaverLogin;
