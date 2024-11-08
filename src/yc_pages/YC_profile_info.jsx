import React from 'react';
import './Modal.css';

const YCProfileInfo = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="yc_profile_info">
        <div className="yc_profile_content">
            <button className="yc_profile_close" onClick={onClose}>
            &times;
            </button>
            <div className="yc_profile">
            <div className="yc_profile-avatar"></div>
            <h2 className="yc_profile_nickname">닉네임</h2>
            <p className="yc_profile_location">서울 (강남구)</p>
            </div>
            <div className="yc_profile_stats">
            <div>
                <p>성실도</p>
                <p>4.32 / 5.0</p>
            </div>
            <div>
                <p>포인트 랭킹</p>
                <p>150 등</p>
            </div>
            <div>
                <p>신고당한횟수</p>
                <p>0</p>
            </div>
            </div>
            <div className="yc_profile_challenge_info">
            <div>
                <p>참여중인 챌린지</p>
                <p>3</p>
            </div>
            <div>
                <p>참여완료 챌린지</p>
                <p>15</p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default YCProfileInfo;
