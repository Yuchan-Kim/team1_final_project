// src/ham_pages/ham_common/ham_topbar.jsx

/**
 * Topbar 컴포넌트
 * 메인 콘텐츠 영역 상단의 사용자 프로필 정보와 통계 테이블을 구성합니다.
 * - 사용자 프로필 이미지, 닉네임, 주소, 비밀번호 변경 버튼
 * - 통계 테이블 (진행중인 챌린지, 시작 예정 챌린지, 완료 챌린지, 랭킹)
 * 
 * Props:
 * - profileImage: 사용자 프로필 이미지 URL
 * - nickname: 사용자 닉네임
 * - address: 사용자 주소
 * - onEditProfile: 프로필 편집 버튼 클릭 시 호출되는 함수
 * - onEditNickname: 닉네임 편집 버튼 클릭 시 호출되는 함수
 * - onEditAddress: 주소 편집 버튼 클릭 시 호출되는 함수
 * - onEditPassword: 비밀번호 변경 버튼 클릭 시 호출되는 함수
 */

// src/ham_pages/ham_common/ham_topbar.jsx

import React, { useState, useEffect } from 'react';
import Modal from './ham_modal';
import '../../ham_asset/css/ham_topbar.css'; // 상단 바 전용 CSS
import '../../ham_asset/css/ham_modal.css'; // 모달 전용 CSS
import { profileItems, defaultProfile } from '../../ham_data/ham_profileData';
import ProfileOptions from './ham_profileOptions';
import profileStore from './profileStore'; // profileStore 임포트
import axios from 'axios';
import storeIcon from '../../ham_asset/images/shopfront.png';


const Topbar = () => {
    // 모달 초기 상태값 세팅
    const [modalState, setModalState] = useState({
        profile: false,
        password: false,
        address: false,
        nickname: false,
    });

    // 모달 관련 state (입력값)
    const [selectedProfileImage, setSelectedProfileImage] = useState(null); // 선택된 프로필 이미지
    const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 입력값
    const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 입력값
    const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 입력값
    const [newAddress, setNewAddress] = useState(''); // 새 주소 입력값
    const [newNickname, setNewNickname] = useState(''); // 새 닉네임 입력값

    // 닉네임 중복 체크 관련 state
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const [isNicknameUnique, setIsNicknameUnique] = useState(true);
    const [nicknameError, setNicknameError] = useState('');

    // 프로필 상태
    const [nickname, setNickname] = useState(profileStore.getNickname());

    useEffect(() => {
        // profileStore에 구독자 추가
        const handleProfileChange = (updatedProfile) => {
            setNickname(updatedProfile.nickname);
        };

        profileStore.subscribe(handleProfileChange);

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // 특정 모달을 여는 함수
    const openModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: true }));
    };

    // 특정 모달을 닫는 함수
    const closeModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: false }));
        // 모달을 닫을 때 입력값 초기화
        if (type === 'profile') {
            setSelectedProfileImage(null);
        }
        if (type === 'nickname') {
            setNewNickname('');
            setIsNicknameUnique(true);
            setNicknameError('');
        }
        if (type === 'address') setNewAddress('');
        if (type === 'password') {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    // 프로필 이미지 선택 함수
    const handleProfileSelect = (src) => {
        setSelectedProfileImage(src);
    };

    // 프로필 이미지 확인 함수
    const handleProfileConfirm = () => {
        if (selectedProfileImage) {
            profileStore.setProfileImage(selectedProfileImage); // profileStore를 통해 프로필 이미지 업데이트
            setSelectedProfileImage(null); // 선택된 이미지 초기화
            closeModal('profile'); // 모달 닫기
        } else {
            alert("프로필 이미지를 선택해주세요."); // 이미지 미선택 시 알림
        }
    };

    // 포인트 상점 이동 함수 (예시)
    const handlePointShopRedirect = () => {
        // 포인트 상점 페이지로 이동하는 로직 추가
        // 예를 들어, React Router를 사용하는 경우:
        // navigate('/point-shop');
        console.log("포인트 상점으로 이동");
    };

    // 닉네임 중복 체크 함수 (백엔드 API 연동)
    const checkNicknameUnique = async (nickname) => {
        try {
            const response = await axios.get('http://localhost:5000/api/check-nickname', {
                params: { nickname }
            });
            return response.data.isUnique;
        } catch (error) {
            console.error("닉네임 중복 체크 중 오류 발생:", error);
            // 오류 발생 시 기본값으로 false를 반환하거나 사용자에게 오류 메시지를 표시
            setNicknameError("닉네임 중복 체크 중 오류가 발생했습니다. 다시 시도해주세요.");
            return false;
        }
    };

    // 정보 변경을 처리하는 함수 (예: API 호출 추가 가능)
    const handleChange = async (type) => {
        switch (type) {
            case 'nickname':
                if (newNickname.trim() === "") {
                    alert("닉네임을 입력해주세요.");
                    return;
                }

                setIsCheckingNickname(true);
                const isUnique = await checkNicknameUnique(newNickname.trim());
                setIsNicknameUnique(isUnique);
                setIsCheckingNickname(false);

                if (!isUnique) {
                    setNicknameError("이미 사용 중인 닉네임입니다.");
                    return;
                }

                // 닉네임이 고유한 경우 업데이트
                profileStore.setNickname(newNickname.trim()); // profileStore를 통해 닉네임 업데이트
                closeModal('nickname'); // 모달 닫기
                break;

            case 'address':
                if (newAddress.trim() === "") {
                    alert("주소를 입력해주세요.");
                    return;
                }
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                console.log("주소 변경:", newAddress);
                closeModal('address'); // 모달 닫기
                break;

            case 'password':
                if (newPassword === '') {
                    alert("새 비밀번호를 입력해주세요.");
                    return;
                }
                if (newPassword !== confirmPassword) {
                    alert("비밀번호가 일치하지 않습니다.");
                    return;
                }
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                console.log("비밀번호 변경:", currentPassword, newPassword);
                closeModal('password'); // 모달 닫기
                break;

            default:
                break;
        }
    };

    return (
        <div className="hmk_topbar">
            {/* 사용자 프로필 정보 */}
            <div className="hmk_Profile">
                <div className="hmk_profile-container">
                    <div className="hmk_profile-image">
                        {/* 현재 프로필 이미지 표시 */}
                        <img src={profileStore.getProfileImage()} alt="Profile" />
                        {/* 프로필 편집 버튼 */}
                        <button className="hmk_edit-profile" onClick={() => openModal('profile')}>
                            <span className="hmk_edit-pficon">✎</span>
                        </button>
                    </div>
                </div>
                <ul>
                    <li>
                        {/* 사용자 닉네임 또는 기본 이름 표시 */}
                        <span>{nickname}</span>
                        {/* 닉네임 편집 버튼 */}
                        <button className="hmk_edit-button" onClick={() => openModal('nickname')}>
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                    <li>
                        {/* 사용자 주소 또는 기본 주소 표시 */}
                        <span>{newAddress || "경기 어디"}</span>
                        {/* 주소 편집 버튼 */}
                        <button className="hmk_edit-button" onClick={() => openModal('address')}>
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                    <li>
                        {/* 비밀번호 변경 링크 */}
                        <span>비밀번호 변경</span>
                        {/* 비밀번호 변경 버튼 */}
                        <button className="hmk_edit-button" onClick={() => openModal('password')}>
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
                            <th>평점</th>
                        </tr>
                        <tr>
                            <td>5 개</td>
                            <td>2 개</td>
                            <td>213 개</td>
                            <td>90 점</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 프로필 변경 모달 */}
            <Modal type="profile" isOpen={modalState.profile} onClose={() => closeModal('profile')}>
                <h2>프로필 변경</h2>
                <p>자신의 프로필을 꾸며보세요</p>
                <div className="hmk_profile-store">
                    <button className="hmk_tooltip-button" onClick={handlePointShopRedirect}>
                        <span className="hmk_store-icon"><img src={storeIcon} alt='store' /></span>
                        <span className="hmk_tooltip-text">상점으로 이동</span>
                    </button>
                </div>
                {/* 프로필 이미지 선택 옵션을 별도의 컴포넌트로 분리 */}
                <ProfileOptions
                    profiles={profileItems}
                    selectedProfile={selectedProfileImage}
                    onSelect={handleProfileSelect}
                />
                <div className="hmk_profile-actions">
                    {/* 프로필 이미지 확인 버튼 */}
                    <button onClick={handleProfileConfirm}>확인</button>
                    {/* 모달 닫기 버튼 */}
                    <button onClick={() => closeModal('profile')}>취소</button>
                </div>
            </Modal>

            {/* 닉네임 변경 모달 */}
            <Modal type="nickname" isOpen={modalState.nickname} onClose={() => closeModal('nickname')}>
                <h2>닉네임 변경</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleChange('nickname'); }}>
                    <div className="hmk_nickname-field">
                        <label htmlFor="new-nickname">닉네임 (필수)</label>
                        {/* 닉네임 입력 필드에 autoFocus 속성 추가 */}
                        <input
                            id="new-nickname"
                            name="nickname"
                            type="text"
                            placeholder="새 닉네임 입력"
                            value={newNickname}
                            onChange={(e) => setNewNickname(e.target.value)}
                            autoComplete="nickname"
                            autoFocus
                        />
                    </div>
                    {/* 닉네임 중복 체크 오류 메시지 표시 */}
                    {nicknameError && <p className="hmk_nickname-error">{nicknameError}</p>}
                    <div className="hmk_nickname-actions">
                        {/* 닉네임 변경 확인 버튼 */}
                        <button type="submit" disabled={isCheckingNickname}>
                            {isCheckingNickname ? "확인 중..." : "확인"}
                        </button>
                        {/* 닉네임 변경 취소 버튼 */}
                        <button type="button" onClick={() => closeModal('nickname')}>취소</button>
                    </div>
                </form>
            </Modal>

            {/* 주소 변경 모달 */}
            <Modal type="address" isOpen={modalState.address} onClose={() => closeModal('address')}>
                <h2>지역 변경</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleChange('address'); }}>
                    <div className="hmk_address-field">
                        <label htmlFor="new-address">지역</label>
                        {/* 주소 입력 필드 */}
                        <input
                            id="new-address"
                            name="address"
                            type="text"
                            placeholder="새 지역 입력"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            autoComplete="address-level1"
                            required
                        />
                    </div>
                    <div className="hmk_address-actions">
                        {/* 주소 변경 확인 버튼 */}
                        <button type="submit">확인</button>
                        {/* 주소 변경 취소 버튼 */}
                        <button type="button" onClick={() => closeModal('address')}>취소</button>

                    </div>
                </form>
            </Modal>

            {/* 비밀번호 변경 모달 */}
            <Modal type="password" isOpen={modalState.password} onClose={() => closeModal('password')}>
                <h2>비밀번호 변경</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleChange('password'); }}>
                    <div className="hmk_password-field">
                        <label htmlFor="current-password">현재 비밀번호</label>
                        {/* 현재 비밀번호 입력 필드에 autoFocus 속성 제거 */}
                        <input
                            type="password"
                            id="current-password"
                            name="currentPassword"
                            placeholder="현재 비밀번호 입력"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <div className="hmk_password-field">
                        <label htmlFor="new-password">새 비밀번호</label>
                        {/* 새 비밀번호 입력 필드에 autoFocus 속성 제거 */}
                        <input
                            type="password"
                            id="new-password"
                            name="newPassword"
                            placeholder="새 비밀번호 입력"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="hmk_password-field">
                        <label htmlFor="confirm-password">비밀번호 확인</label>
                        {/* 비밀번호 확인 입력 필드에 autoFocus 속성 제거 */}
                        <input
                            type="password"
                            id="confirm-password"
                            name="confirmPassword"
                            placeholder="비밀번호 확인"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="hmk_password-actions">
                        {/* 비밀번호 변경 확인 버튼 */}
                        <button type="submit">확인</button>
                        {/* 비밀번호 변경 취소 버튼 */}
                        <button type="button" onClick={() => closeModal('password')}>취소</button>

                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Topbar;
