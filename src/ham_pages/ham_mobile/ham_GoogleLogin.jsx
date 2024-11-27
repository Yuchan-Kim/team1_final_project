// src/ham_pages/ham_mobile/ham_GoogleLogin.jsx
import React from 'react';
import SocialLogin from './SocialLogin';

const Ham_GoogleLogin = ({ onLogin }) => {
    return <SocialLogin platform="google" onLogin={onLogin} />;
};

export default Ham_GoogleLogin;
