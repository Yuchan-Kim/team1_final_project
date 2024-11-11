// src/ham_pages/ham_common/ham_topbar.js

/**
 * Topbar 컴포넌트
 * 메인 콘텐츠 영역 상단의 사용자 프로필 정보와 통계 테이블을 구성합니다.
 * - 사용자 프로필 이미지, 닉네임, 주소, 비밀번호 변경 버튼
 * - 통계 테이블 (진행중인 챌린지, 시작 예정 챌린지, 완료 챌린지, 랭킹)
 * 
 * Props:
 * - profileImage: 사용자 프로필 이미지 URL
 * - username: 사용자 이름
 * - nickname: 사용자 닉네임
 * - address: 사용자 주소
 * - onEditProfile: 프로필 편집 버튼 클릭 시 호출되는 함수
 * - onEditNickname: 닉네임 편집 버튼 클릭 시 호출되는 함수
 * - onEditAddress: 주소 편집 버튼 클릭 시 호출되는 함수
 * - onEditPassword: 비밀번호 변경 버튼 클릭 시 호출되는 함수
 */

import React from 'react';
import '../../ham_asset/css/ham_topbar.css'; // 상단 바 전용 CSS

const Topbar = ({
    profileImage,
    nickname,
    address,
    onEditProfile,
    onEditNickname,
    onEditAddress,
    onEditPassword
}) => {
    return (
        <div className="hmk_topbar">
            {/* 사용자 프로필 정보 */}
            <div className="hmk_Profile">
                <div className="hmk_profile-container">
                    <div className="hmk_profile-image">
                        {/* 현재 프로필 이미지 표시 */}
                        <img src={profileImage} alt="Profile" />
                        {/* 프로필 편집 버튼 */}
                        <button className="hmk_edit-profile" onClick={onEditProfile}>
                            <span className="hmk_edit-pficon">✎</span>
                        </button>
                    </div>
                </div>
                <ul>
                    <li>
                        {/* 사용자 닉네임 또는 기본 이름 표시 */}
                        <span>{nickname}</span>
                        {/* 닉네임 편집 버튼 */}
                        <button className="hmk_edit-button" onClick={onEditNickname}>
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                    <li>
                        {/* 사용자 주소 또는 기본 주소 표시 */}
                        <span>{address}</span>
                        {/* 주소 편집 버튼 */}
                        <button className="hmk_edit-button" onClick={onEditAddress}>
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                    <li>
                        {/* 비밀번호 변경 링크 */}
                        <span>비밀번호 변경</span>
                        {/* 비밀번호 변경 버튼 */}
                        <button className="hmk_edit-button" onClick={onEditPassword}>
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* 통계 테이블 영역 */}
            <div className="hmk_statistics">
                <table>
                    <tbody>
                        <tr>
                            <th>진행중인 챌린지</th>
                            <th>시작 예정 챌린지</th>
                            <th>완료 챌린지</th>
                            <th>랭킹</th>
                        </tr>
                        <tr>
                            <td>5개</td>
                            <td>2개</td>
                            <td>213개</td>
                            <td>미진입</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Topbar;
