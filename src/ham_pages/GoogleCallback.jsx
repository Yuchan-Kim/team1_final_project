import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const code = new URLSearchParams(location.search).get('code');
        if (code) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/users/google/login?code=${code}`)
                .then(response => {
                    if (response.data.result === 'success') {
                        localStorage.setItem('token', response.headers.authorization.split(' ')[1]);
                        localStorage.setItem('authUser', JSON.stringify(response.data.apiData));
                        window.location.href = '/';
                    } else {
                        navigate('/user/loginform');
                    }
                })
                .catch(error => {
                    console.error('Google login error:', error);
                    navigate('/user/loginform');
                });
        }
    }, [navigate, location]);

    return <div>구글 로그인 처리중...</div>;
};

export default GoogleCallback;