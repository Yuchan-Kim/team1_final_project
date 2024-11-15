// YCProfileInfo.jsx
import React from 'react';
import '../yc_assets/yc_css/yc_css_profile_info.css';
import { FaTimes, FaUserPlus } from 'react-icons/fa'; // 아이콘 추가

const YCProfileInfo = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    return (
        <div className="yc_profile_info" role="dialog" aria-modal="true" aria-labelledby="profile-title">
            <div className="yc_profile_content">
                <button className="yc_profile_close" onClick={onClose} aria-label="닫기">
                    <FaTimes />
                </button>
                <div className="yc_profile">
                    <div className="yc_profile-avatar">
                        {user.avatar ? <img src={user.avatar} alt={`${user.name}의 아바타`} /> : <FaUserPlus />}
                    </div>
                    <h2 className="yc_profile_nickname" id="profile-title">
                        {user.name}
                        <button className="yc_add_friend_button" title="친구 추가" aria-label="친구 추가">
                            <FaUserPlus /> 추가
                        </button>
                    </h2>
                    
                    <p className="yc_profile_location">{user.location}</p>
                </div>
                <div className="yc_profile_stats">
                    <div>
                        <p>성실도</p>
                        <p>{user.reliability} / 5.0</p>
                    </div>
                    <div>
                        <p>포인트 랭킹</p>
                        <p>{user.pointRanking} 등</p>
                    </div>
                    <div>
                        <p>신고당한 횟수</p>
                        <p>{user.reportCount}</p>
                    </div>
                </div>
                <div className="yc_profile_challenge_info">
                    <div>
                        <p>참여 중인 챌린지</p>
                        <p>{user.activeChallenges}</p>
                    </div>
                    <div>
                        <p>참여 완료 챌린지</p>
                        <p>{user.completedChallenges}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YCProfileInfo;
