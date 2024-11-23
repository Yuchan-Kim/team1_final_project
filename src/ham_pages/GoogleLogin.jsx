// GoogleLogin.jsx
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginComponent = () => {
    const handleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/users/google/login`,
                { credential: credentialResponse.credential }
            );

            if (response.data.result === 'success') {
                localStorage.setItem('token', response.headers.authorization.split(' ')[1]);
                localStorage.setItem('authUser', JSON.stringify(response.data.apiData));
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Google login failed:', error);
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => console.log('Login Failed')}
                useOneTap={false}
                cookiePolicy={'single_host_origin'}
                prompt="select_account"
                ux_mode="popup"  // popup 모드 사용
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginComponent;