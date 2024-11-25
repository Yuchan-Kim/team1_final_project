// src/ham_pages/ham_common/ham_topbar.jsx

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from './ham_modal';
import Alert from './ham_alert';
import ProfileOptions from './ham_profileOptions';
import profileStore from './profileStore';
import '../../ham_asset/css/ham_modal.css';
import '../../ham_asset/css/ham_topbar.css';
const defaultProfile = '/images/profile-fill.png';
const storeIcon = '/images/shopfront.png';



const Topbar = () => {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]); // 자동완성 목록 상태
    const [ownedProfileImages, setOwnedProfileImages] = useState([]); // 소유한 프로필 이미지 목록 상태
    const [hasPassword, setHasPassword] = useState(null);

    // 모달 상태
    const [modalState, setModalState] = useState({
        profile: false,
        password: false,
        address: false,
        nickname: false,
    });
    const [alertState, setAlertState] = useState({
        isOpen: false,
        message: '',
        type: 'success'
    });
    // 모달 입력 상태
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [newAddress, setNewAddress] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const [nicknameError, setNicknameError] = useState('');
    const [userInfo, setUserInfo] = useState({
        nickname: profileStore.getNickname(),
        region: profileStore.getRegion(),
        profileImage: profileStore.getProfileImage(),
        ownedProfileImages: profileStore.getOwnedProfileImages(),
        challengesSummary: profileStore.getChallengesSummary(),
        participationScore: profileStore.getChallengesSummary().participationScore,
        socialLogin: profileStore.getSocialLogin() // socialLogin 정보 추가
    });
    // 비밀번호 강도 상태 (선택 사항)
    const [passwordValidity, setPasswordValidity] = useState({
        hasLetter: false,
        hasNumberOrSpecial: false,
        isLongEnough: false
    });
    // 비밀번호 생성 규칙 함수
    const validatePassword = (password) => {
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumberOrSpecial = /[0-9#?!&]/.test(password);
        const isLongEnough = password.length >= 10;
        return hasLetter && hasNumberOrSpecial && isLongEnough;
    };
    // 비밀번호 입력 필드 변경 시 실시간 검증 함수
    const handleNewPasswordChange = (e) => {
        const pwd = e.target.value;
        setNewPassword(pwd);
        setPasswordValidity({
            hasLetter: /[A-Za-z]/.test(pwd),
            hasNumberOrSpecial: /[0-9#?!&]/.test(pwd),
            isLongEnough: pwd.length >= 10
        });
    };

    // 비밀번호 존재 여부 확인 함수
    const checkPasswordExists = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const userNum = profileStore.getUserNum();

            const response = await axios.get(`${apiUrl}/api/my/${userNum}/checkPassword`);
            console.log("비밀번호 확인 응답:", response);

            if (response.data.result === 'success' && response.data.apiData) {
                setHasPassword(response.data.apiData.passwordExists);  // apiData로 수정
            } else {
                setHasPassword(false);
            }
        } catch (error) {
            console.error('비밀번호 상태 확인 중 에러:', error);
            setHasPassword(false);
        }
    };
    // 비밀번호 변경 모달 열 때 비밀번호 존재 여부 확인
    const handlePasswordModalOpen = async () => {
        await checkPasswordExists();
        openModal('password');
    };

    // 지역 변경용 자동완성 데이터 요청 함수
    const fetchRegionSuggestions = async (input) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await axios.get(`${apiUrl}/api/my/updateAddress`, {
                params: { query: input }
            });
            setSuggestions(response.data.apiData || []); // 자동완성 결과를 상태에 설정
        } catch (error) {
            console.error("자동완성 데이터 요청 실패:", error);
        }
    };
    // 사용자 입력이 변경될 때 자동완성 목록 가져오는 함수
    const handleAddressChange = (e) => {
        const input = e.target.value;
        setNewAddress(input); // 입력 상태 설정
        if (input.length > 0) {
            fetchRegionSuggestions(input); // 입력값을 기반으로 자동완성 목록 가져오기
        } else {
            setSuggestions([]); // 입력값이 없을 때는 목록 초기화
        }
    };
    // 모달 제어 함수
    const openModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: true }));
    };
    const closeModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: false }));
        // 모달 상태 초기화
        switch (type) {
            case 'profile':
                setSelectedProfileImage(null);
                break;
            case 'nickname':
                setNewNickname('');
                setNicknameError('');
                break;
            case 'address':
                setNewAddress('');
                break;
            case 'password':
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                break;
            default:
                break;
        }
    };

    // 프로필 이미지 관련 함수
    const handleProfileSelect = (relativePath) => {
        setSelectedProfileImage(relativePath);
    };

    const handleProfileConfirm = async () => {
        const userNum = profileStore.getUserNum();
        if (!userNum) {
            alert("사용자 번호가 설정되지 않았습니다.");
            return;
        }
        if (!selectedProfileImage) {
            alert("프로필 이미지를 선택해주세요.");
            return;
        }
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await axios.put(`${apiUrl}/api/my/${userNum}/update-profile`, {
                profileImage: selectedProfileImage // DB에 저장된 경로 그대로 전송
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.result === 'success') {
                profileStore.setProfileImage(selectedProfileImage);
                setUserInfo(prev => ({
                    ...prev,
                    profileImage: selectedProfileImage
                }));
                closeModal('profile');
            } else {
                alert(response.data.message || "프로필 이미지 업데이트에 실패했습니다.");
            }
        } catch (error) {
            console.error("프로필 이미지 업데이트 중 오류 발생:", error);
            alert("프로필 이미지 업데이트에 실패했습니다.");
        }
    };


    // 정보 변경 처리 함수
    const handleChange = async (type) => {
        console.log(`${type} 변경 함수 호출됨`); // 함수 호출 확인
        const userNum = profileStore.getUserNum();
        if (!userNum) {
            alert("사용자 번호가 설정되지 않았습니다.");
            return;
        }
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
        console.log(`API 요청 시작: /api/my/${userNum}/update${type === 'nickname' ? 'Nickname' : type.charAt(0).toUpperCase() + type.slice(1)}`, type === 'address' ? newAddress : '');
        try {
            let response;
            switch (type) {
                case 'nickname':
                    if (!newNickname.trim()) {
                        alert("닉네임을 입력해주세요.");
                        return;
                    }
                    // 닉네임 중복 체크
                    setIsCheckingNickname(true);
                    const checkResponse = await axios.get(`${apiUrl}/api/my/checkNickname`, {
                        params: { nickname: newNickname.trim() }
                    });
                    setIsCheckingNickname(false);
                    const isAvailable = checkResponse.data.apiData;
                    if (!isAvailable) {
                        // 중복된 경우
                        setNicknameError("사용할 수 없는 닉네임입니다.");
                        setNewNickname(''); // 입력 창 비우기
                        return;
                    }
                    // 중복이 없는 경우 닉네임 업데이트 요청
                    response = await axios.put(`${apiUrl}/api/my/${userNum}/updateNickname`, {
                        nickname: newNickname.trim()
                    });
                    if (response?.data.result === 'success') {
                        // profileStore 업데이트
                        profileStore.setNickname(newNickname.trim());
                        // 로컬 상태도 직접 업데이트
                        setUserInfo(prev => ({
                            ...prev,
                            nickname: newNickname.trim()
                        }));
                        closeModal('nickname');
                    }
                    break;
                case 'address':
                    if (!newAddress.trim()) {
                        alert("주소를 입력해주세요.");
                        return;
                    }
                    response = await axios.put(`${apiUrl}/api/my/${userNum}/updateAddress`, {
                        region: newAddress.trim()
                    }, { headers: { 'Content-Type': 'application/json' } });
                    if (response?.data.result === 'success') {
                        // profileStore에 지역 정보 업데이트
                        profileStore.setRegion(newAddress.trim());
                        // 로컬 상태 업데이트
                        setUserInfo(prev => ({
                            ...prev,
                            region: newAddress.trim()
                        }));
                        closeModal('address');
                    }
                    break;
            }
            if (response?.data.result === 'success') {
                switch (type) {
                    case 'nickname':
                        profileStore.setNickname(newNickname.trim());
                        break;
                    case 'address':
                        // 지역 업데이트는 profileStore에 별도 로직 필요 (현재 userInfo 상태 업데이트)
                        setUserInfo(prev => ({ ...prev, region: newAddress.trim() }));
                        break;
                    case 'password':
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            console.error(`${type} 변경 중 오류 발생:`, error);
            const errorMessage = error.response?.data?.message || `${type} 변경에 실패했습니다.`;
            setAlertState({
                isOpen: true,
                message: errorMessage,
                type: 'error'
            });
        }
    };

    // 비밀번호 변경 처리 함수
    const handlePasswordChange = async () => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const userNum = profileStore.getUserNum();

            if (!userNum) {
                setPasswordError("사용자 정보를 찾을 수 없습니다.");
                return;
            }

            // 입력값 검증
            if (hasPassword && !currentPassword) {
                setPasswordError("현재 비밀번호를 입력해주세요.");
                return;
            }
            if (!newPassword) {
                setPasswordError("새 비밀번호를 입력해주세요.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setPasswordError("새 비밀번호가 일치하지 않습니다.");
                return;
            }
            if (!validatePassword(newPassword)) {
                setPasswordError("비밀번호 형식이 올바르지 않습니다.");
                return;
            }

            // API 요청 데이터 구성
            const requestData = {
                userNum: userNum,
                currentPassword: currentPassword,
                newPassword: newPassword
            };

            const response = await axios.put(
                `${apiUrl}/api/my/${userNum}/updatePassword`,
                requestData
            );

            if (response.data.result === 'success') {
                setAlertState({
                    isOpen: true,
                    message: "비밀번호가 성공적으로 변경되었습니다.",
                    type: 'success'
                });
                closeModal('password');
            } else {
                // API에서 실패 응답이 왔을 때
                setPasswordError(response.data.message || "비밀번호 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error('비밀번호 변경 중 에러:', error);

            // 현재 비밀번호가 맞지 않을 경우에 대한 처리
            if (error.response?.status === 400) {
                setPasswordError("현재 비밀번호가 일치하지 않습니다.");
            } else {
                setPasswordError(error.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
            }

            setAlertState({
                isOpen: true,
                message: error.response?.data?.message || "비밀번호 변경에 실패했습니다.",
                type: 'error'
            });
        }
    };
    // 비밀번호 입력필드에서 Enter 키 처리
    const handlePasswordKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handlePasswordChange();
        }
    };
    // profileStore 구독
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            console.log("탑바가 구독한 프로필의 데이터: ", updatedProfile);

            const safeProfile = {
                ...updatedProfile,
                ownedProfileImages: Array.isArray(updatedProfile.ownedProfileImages) ? updatedProfile.ownedProfileImages : []
            };

            // DB에 저장된 경로를 그대로 사용
            const ownedPfimg = safeProfile.ownedProfileImages.map(image => {
                if (image.startsWith('http')) return image;
                return image; // DB에 저장된 경로 그대로 사용 (/파일이름.jpg)
            });

            console.log("소유한 프로필 이미지:", ownedPfimg);

            setUserInfo(prev => ({
                ...prev,
                ...safeProfile
            }));

            setOwnedProfileImages(ownedPfimg);
        };

        // 초기 데이터 설정 - getProfileData() 메소드 사용
        handleProfileChange(profileStore.getProfileData());

        // 구독 추가
        profileStore.subscribe(handleProfileChange);

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // Helper 함수: 절대 경로 생성
    const getFullImagePath = (path) => {
        if (!path) return defaultProfile;
        if (path.startsWith('http')) {
            // http로 시작하는 경로를 /images 경로로 변환
            const imageName = path.split('/').pop(); // item2.jpg 추출
            return `/images/${imageName}`;
        }
        // 이미 /images로 시작하면 그대로 반환
        if (path.startsWith('/images')) {
            return path;
        }
        // /item1.jpg 형식이면 /images 추가
        if (path.startsWith('/')) {
            return `/images${path}`;
        }
        // 그 외의 경우 /images/ 추가
        return `/images/${path}`;
    };



    return (
        <div className="hmk_topbar">
            {/* 사용자 프로필 정보 */}
            <div className="hmk_Profile">
                <div className="hmk_profile-container">
                    <div className="hmk_profile-image">
                        <img
                            src={getFullImagePath(userInfo.profileImage)}
                            alt="Profile"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultProfile;
                            }}
                        />
                        <button className="hmk_edit-profile" onClick={() => openModal('profile')} aria-label="프로필 편집">
                            <span className="hmk_edit-pficon">✎</span>
                        </button>
                    </div>
                </div>
                <ul>
                    <li>
                        <span>{userInfo.nickname}</span>
                        <button className="hmk_edit-button" onClick={() => openModal('nickname')} aria-label="닉네임 편집">
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                    <li>
                        <span>{userInfo.region}</span>
                        <button className="hmk_edit-button" onClick={() => openModal('address')} aria-label="지역 편집">
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                    <li>
                        <span>비밀번호 변경</span>
                        <button
                            className="hmk_edit-button"
                            onClick={handlePasswordModalOpen}  // 여기서 handlePasswordModalOpen 사용
                            aria-label="비밀번호 변경"
                        >
                            <span className="hmk_edit-icon">✎</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* 챌린지 통계 테이블 */}
            <div className="hmk_statistics">
                <table>
                    <thead>
                        <tr>
                            <th>진행 중인 챌린지</th>
                            <th>시작 예정 챌린지</th>
                            <th>완료 챌린지</th>
                            <th>종합 달성률 (평점)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{userInfo.challengesSummary.ongoing}개</td>
                            <td>{userInfo.challengesSummary.upcoming}개</td>
                            <td>{userInfo.challengesSummary.completed}개</td>
                            <td>
                                {userInfo.participationScore > 0 ? (
                                    `${userInfo.participationScore}점`
                                ) : (
                                    <span className="hmk_small-text">달성한 미션이 없습니다.</span>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Alert
                isOpen={alertState.isOpen}
                message={alertState.message}
                type={alertState.type}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
            />

            {/* 프로필 변경 모달 */}
            <Modal type="profile" isOpen={modalState.profile} onClose={() => closeModal('profile')}>
                <h2>프로필 변경</h2>
                <p>자신의 프로필을 꾸며보세요</p>
                <div className="hmk_profile-store">
                    <button
                        className="hmk_tooltip-button"
                        onClick={() => navigate('/pointstore/pointstoremain')}
                        aria-label="상점으로 이동"
                    >
                        <span className="hmk_store-icon">
                            <img src={storeIcon} alt='store' />
                        </span>
                        <span className="hmk_tooltip-text">상점으로 이동</span>
                    </button>
                </div>
                <ProfileOptions
                    profiles={ownedProfileImages}
                    selectedProfile={selectedProfileImage}
                    onSelect={handleProfileSelect}
                    onConfirm={handleProfileConfirm}
                    onCancel={() => closeModal('profile')}
                />
            </Modal>


            {/* 닉네임 변경 모달 */}
            <Modal type="nickname" isOpen={modalState.nickname} onClose={() => closeModal('nickname')}>
                <h2>닉네임 변경</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleChange('nickname'); }}>
                    <div className="hmk_nickname-field">
                        <label htmlFor="new-nickname">닉네임 (필수)</label>
                        <input
                            id="new-nickname"
                            name="nickname"
                            type="text"
                            placeholder="새 닉네임 입력"
                            value={newNickname}
                            onChange={(e) => setNewNickname(e.target.value)}
                            autoComplete="nickname"
                            autoFocus
                            required
                        />
                    </div>
                    {nicknameError && <p className="hmk_nickname-error">{nicknameError}</p>}
                    <div className="hmk_nickname-actions">
                        <button type="submit" disabled={isCheckingNickname}>
                            {isCheckingNickname ? "확인 중..." : "확인"}
                        </button>
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
                        <input
                            id="new-address"
                            name="address"
                            type="text"
                            placeholder="새 지역 입력"
                            value={newAddress}
                            onChange={handleAddressChange} // 자동완성 함수 연결
                            autoComplete="off"
                            required
                        />
                        {/* 자동완성 목록 표시 */}
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
                                {suggestions.map((region, index) => (
                                    <li key={index} onClick={() => {
                                        setNewAddress(region); // 항목 선택 시 입력 필드에 설정
                                        setSuggestions([]); // 목록 닫기
                                    }}>
                                        {region}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="hmk_address-actions">
                        <button type="submit">확인</button>
                        <button type="button" onClick={() => closeModal('address')}>취소</button>
                    </div>
                </form>
            </Modal>

            {/* 비밀번호 변경 모달 */}
            <Modal type="password" isOpen={modalState.password} onClose={() => closeModal('password')}>
                <h2>비밀번호 변경</h2>
                <form onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }}>
                    {hasPassword && (
                        <div className="hmk_password-field">
                            <label htmlFor="current-password">현재 비밀번호</label>
                            <input
                                type="password"
                                id="current-password"
                                name="currentPassword"
                                placeholder="현재 비밀번호 입력"
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    setPasswordError(''); // 에러 메시지 초기화
                                }}
                                onKeyPress={handlePasswordKeyPress}
                                autoComplete="current-password"
                            />
                            {passwordError && passwordError.includes("현재 비밀번호") && (
                                <div className="hmk_password-field-error">
                                    {passwordError}
                                </div>
                            )}
                        </div>
                    )}
                    <div className="hmk_password-field">
                        <label htmlFor="new-password">새 비밀번호</label>
                        <input
                            type="password"
                            id="new-password"
                            name="newPassword"
                            placeholder="새 비밀번호 입력"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            autoComplete="new-password"
                            required
                        />
                        {/* 비밀번호 규칙 표시 - 스타일 추가 */}
                        <div className="hmk_password-rules">
                            <p>비밀번호 요구사항:</p>
                            <ul>
                                <li className={passwordValidity.hasLetter ? "valid" : ""}>
                                    {passwordValidity.hasLetter ? "✓" : "○"} 문자 1개 이상 포함
                                </li>
                                <li className={passwordValidity.hasNumberOrSpecial ? "valid" : ""}>
                                    {passwordValidity.hasNumberOrSpecial ? "✓" : "○"} 숫자 또는 특수문자(#?!&) 1개 이상 포함
                                </li>
                                <li className={passwordValidity.isLongEnough ? "valid" : ""}>
                                    {passwordValidity.isLongEnough ? "✓" : "○"} 10글자 이상
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="hmk_password-field">
                        <label htmlFor="confirm-password">비밀번호 확인</label>
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
                        {newPassword && confirmPassword && (
                            <div className="hmk_password-match">
                                {newPassword === confirmPassword ?
                                    <span className="valid">✓ 비밀번호가 일치합니다</span> :
                                    <span className="invalid">× 비밀번호가 일치하지 않습니다</span>
                                }
                            </div>
                        )}
                    </div>
                    {passwordError && !passwordError.includes("현재 비밀번호") && (
                        <div className="hmk_password-error" role="alert">
                            {passwordError}
                        </div>
                    )}
                    <div className="hmk_password-actions">
                        <button
                            type="submit"
                            disabled={
                                (hasPassword && !currentPassword) ||
                                !validatePassword(newPassword) ||
                                newPassword !== confirmPassword
                            }
                        >
                            확인
                        </button>
                        <button type="button" onClick={() => closeModal('password')}>취소</button>
                    </div>
                </form>
            </Modal>
        </div>
    );

};

export default Topbar;
