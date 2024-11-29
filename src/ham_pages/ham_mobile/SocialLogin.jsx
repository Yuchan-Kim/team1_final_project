// src/components/SocialLogin.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SocialLogin = ({ platform, onLogin }) => {
    const getPlatformDetails = (platform) => {
        switch(platform) {
            case 'kakao':
                return {
                    name: '카카오',
                    bgColor: '#FEE500',
                    textColor: '#000000',
                    icon: `${process.env.REACT_APP_API_URL}/app/upload/icons/kakao-icon.png`,
                    hoverColor: '#e6cf00'
                };
            case 'naver':
                return {
                    name: '네이버',
                    bgColor: '#03C75A',
                    textColor: '#FFFFFF',
                    icon: `${process.env.REACT_APP_API_URL}/upload/icons/naver-icon.png`,
                    hoverColor: '#02b351'
                };
            case 'google':
                return {
                    name: '구글',
                    bgColor: '#FFFFFF',
                    textColor: '#000000',
                    icon: `${process.env.REACT_APP_API_URL}/upload/icons/google-icon.png`,
                    hoverColor: '#f5f5f5',
                    border: '1px solid #dddddd'
                };
            default:
                return null;
        }
    };

    const platformDetails = getPlatformDetails(platform);

    return (
        <button
            className={`hmk_social-login-btn hmk_${platform}-login`}
            onClick={() => onLogin(platform)}
            aria-label={`${platformDetails.name}로 계속하기`}
            style={{
                backgroundColor: platformDetails.bgColor,
                color: platformDetails.textColor,
                border: platformDetails.border || 'none'
            }}
        >
            <img 
                src={platformDetails.icon}
                alt={`${platformDetails.name} 아이콘`}
                className="hmk_social-icon"
            />
            <span className="hmk_social-text">
                {platformDetails.name}로 계속하기
            </span>
        </button>
    );
};

SocialLogin.propTypes = {
    platform: PropTypes.oneOf(['kakao', 'naver', 'google']).isRequired,
    onLogin: PropTypes.func.isRequired,
};

export default SocialLogin;