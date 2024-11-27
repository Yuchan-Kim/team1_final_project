// src/components/SocialLogin.jsx
import React from 'react';
import PropTypes from 'prop-types';


const SocialLogin = ({ platform, onLogin }) => {
    const getPlatformDetails = (platform) => {
        switch(platform) {
            case 'kakao':
                return {
                    name: '카카오',
                    color: '#FEE500',
                    icon: '/images/icons/kakao-icon.png', // 실제 프로젝트에서는 아이콘 이미지나 SVG 사용 권장
                };
            case 'naver':
                return {
                    name: '네이버',
                    color: '#03C75A',
                    icon: '/images/icons/naver-icon.png',
                };
            case 'google':
                return {
                    name: '구글',
                    color: '#DB4437',
                    icon: '/images/icons/google-icon.png',
                };
        }
    };

    const { name, color, icon } = getPlatformDetails(platform);

    return (
        <button
            className={`hmk-social-btn hmk-${platform}`}
            onClick={() => onLogin(platform)}
            aria-label={`${name} 로그인`}
            style={{ backgroundColor: color }}
        >
            <span className="hmk-social-icon">{icon}</span>
            <span className="hmk-social-text">{name}로 로그인</span>
        </button>
    );
};

SocialLogin.propTypes = {
    platform: PropTypes.oneOf(['kakao', 'naver', 'google']).isRequired,
    onLogin: PropTypes.func.isRequired,
};

export default SocialLogin;
