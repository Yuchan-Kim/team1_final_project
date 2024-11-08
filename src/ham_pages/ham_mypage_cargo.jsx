// src/components/Cargo.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../ham_asset/css/reset.css'; // 기본 스타일 초기화
import '../ham_asset/css/cargopage.css'; // 보관함 페이지 스타일

// 공용 이미지 import
import DefaultProfile from '../ham_asset/images/profile-fill.png'; // 기본 프로필 이미지
import InitialProfileImage from '../ham_asset/images/IMG_4879.jpg'; // 초기 프로필 이미지

// 기프티콘 이미지 import (예시)
import GiftImage1 from '../ham_asset/images/gift1.jpg';
import GiftImage2 from '../ham_asset/images/gift2.jpg';
import GiftImage3 from '../ham_asset/images/gift3.jpg';
import GiftImage4 from '../ham_asset/images/gift4.jpg';
import GiftImage5 from '../ham_asset/images/gift5.jpg';
import GiftImage6 from '../ham_asset/images/gift6.jpg';
import GiftImage7 from '../ham_asset/images/gift7.jpg';
// ... 다른 기프티콘 이미지 import (추가 필요 시 여기에 추가)

// 공통 Modal 컴포넌트 import
import Modal from './ham_modal';
// Header, Sidebar, Topbar, GiftCard 컴포넌트 import
import Header from './ham_header';
import Sidebar from './ham_sidebar';
import Topbar from './ham_topbar';
import GiftCard from './ham_giftcard';

const Cargo = () => {
    // 여러 개의 모달 창 상태를 관리하는 state
    const [modalState, setModalState] = useState({
        profile: false, // 프로필 변경 모달
        password: false, // 비밀번호 변경 모달
        address: false, // 주소 변경 모달
        nickname: false, // 닉네임 변경 모달
    });

    // 프로필 이미지 관련 state
    const [selectedProfileImage, setSelectedProfileImage] = useState(null); // 선택된 프로필 이미지
    const [profileImage, setProfileImage] = useState(InitialProfileImage); // 현재 프로필 이미지

    // 비밀번호 변경 관련 state
    const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 입력값
    const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 입력값

    // 주소 변경 관련 state
    const [newAddress, setNewAddress] = useState(''); // 새 주소 입력값

    // 닉네임 변경 관련 state
    const [newNickname, setNewNickname] = useState(''); // 새 닉네임 입력값

    // 기프티콘 상세 모달 관련 state
    const [modalDetailState, setModalDetailState] = useState(false); // 기프티콘 상세 모달 열림 여부
    const [selectedGift, setSelectedGift] = useState(null); // 선택된 기프티콘 정보

    // 기프티콘 목록 데이터 (예시 데이터)
    const giftCards = [
        { id: 1, name: "눼눼칙힌", image: GiftImage1 },
        { id: 2, name: "BBQ", image: GiftImage2 },
        { id: 3, name: "피자혓", image: GiftImage3 },
        { id: 4, name: "나눔로또", image: GiftImage4 },
        { id: 5, name: "칙힌깊흐트", image: GiftImage5 },
        { id: 6, name: "배라기프티콘", image: GiftImage6 },
        { id: 7, name: "치킨기프트", image: GiftImage7 },
        // ... 추가 데이터 (필요 시 여기에 추가)
    ];

    // 특정 모달을 여는 함수
    const openModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: true }));
    };

    // 특정 모달을 닫는 함수
    const closeModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: false }));
        // 모달을 닫을 때 입력값 초기화
        if (type === 'nickname') setNewNickname('');
        if (type === 'address') setNewAddress('');
        if (type === 'password') {
            setCurrentPassword('');
            setNewPassword('');
        }
    };

    // 기프티콘 상세 모달을 여는 함수
    const openDetailModal = (gift) => {
        setSelectedGift(gift); // 선택된 기프티콘 정보를 state에 저장
        setModalDetailState(true); // 상세 모달 열림
    };

    // 기프티콘 상세 모달을 닫는 함수
    const closeDetailModal = () => {
        setModalDetailState(false); // 상세 모달 닫힘
        setSelectedGift(null); // 선택된 기프티콘 정보 초기화
    };

    // 정보 변경을 처리하는 함수 (예: API 호출 추가 가능)
    const handleChange = (type) => {
        switch (type) {
            case 'nickname':
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                closeModal('nickname'); // 모달 닫기
                break;
            case 'address':
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                closeModal('address'); // 모달 닫기
                break;
            case 'password':
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                closeModal('password'); // 모달 닫기
                break;
            default:
                break;
        }
    };

    // 프로필 이미지를 선택하는 함수
    const handleProfileSelect = (imageSrc) => {
        setSelectedProfileImage(imageSrc); // 선택된 이미지 저장
    };

    // 선택된 프로필 이미지를 확인하고 업데이트하는 함수
    const handleProfileConfirm = () => {
        if (selectedProfileImage) {
            setProfileImage(selectedProfileImage); // 프로필 이미지 업데이트
        }
        setSelectedProfileImage(null); // 선택된 이미지 초기화
        closeModal('profile'); // 모달 닫기
    };

    // 로그아웃 핸들러 (예시)
    const handleLogout = () => {
        // 로그아웃 로직 추가
        console.log("로그아웃");
    };

    return (
        <div className="wrap">
            {/* Header 컴포넌트 */}
            <Header 
                profileImage={profileImage || DefaultProfile} 
                username="씽씽이김유찬" 
                points="3600" 
                onLogout={handleLogout} 
            />

            {/* 메인 컨테이너 */}
            <div className="hmk_main-container">
                {/* Sidebar 컴포넌트 */}
                <Sidebar />

                {/* 메인 콘텐츠 영역 */}
                <div className="hmk_main">
                    {/* Topbar 컴포넌트 */}
                    <Topbar 
                        profileImage={profileImage} 
                        username="씽씽이김유찬" 
                        nickname={newNickname || "씽씽이김유찬"} 
                        address={newAddress || "경기 어디"} 
                        onEditProfile={() => openModal('profile')} 
                        onEditNickname={() => openModal('nickname')} 
                        onEditAddress={() => openModal('address')} 
                        onEditPassword={() => openModal('password')} 
                    />

                    {/* 보관함(기프티콘) 영역 */}
                    <div className="hmk_cargobox">
                        <h1>보관함</h1>
                        <div className="hmk_gift-gallery">
                            {/* 기프티콘 목록을 반복하여 표시 */}
                            {giftCards.map(gift => (
                                <GiftCard key={gift.id} gift={gift} onClick={openDetailModal} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 프로필 변경 모달 */}
            <Modal type="profile" isOpen={modalState.profile} onClose={() => closeModal('profile')}>
                <h2>프로필 변경</h2>
                <p>자신의 프로필을 꾸며보세요</p>
                <div className="hmk_profile-options">
                    {/* 프로필 이미지 선택 옵션 (추가 이미지 필요 시 주석 해제 및 추가) */}
                    {[InitialProfileImage /*, 다른 이미지 import */].map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`프로필 선택 ${index + 1}`}
                            onClick={() => handleProfileSelect(src)}
                            className={selectedProfileImage === src ? "hmk_selected-profile" : ""}
                        />
                    ))}
                </div>
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
                <p>새로운 닉네임을 입력해주세요</p>
                <div className="hmk_nickname-field">
                    <label htmlFor="new-nickname">닉네임 (필수)</label>
                    {/* 닉네임 입력 필드 */}
                    <input
                        id="new-nickname"
                        type="text"
                        placeholder="새 닉네임 입력"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                    />
                </div>
                <div className="hmk_nickname-actions">
                    {/* 닉네임 변경 취소 버튼 */}
                    <button onClick={() => closeModal('nickname')}>취소</button>
                    {/* 닉네임 변경 확인 버튼 */}
                    <button onClick={() => handleChange('nickname')}>확인</button>
                </div>
            </Modal>

            {/* 주소 변경 모달 */}
            <Modal type="address" isOpen={modalState.address} onClose={() => closeModal('address')}>
                <h2>지역 변경</h2>
                <p>새로운 지역을 입력해주세요</p>
                <div className="hmk_address-field">
                    <label htmlFor="new-address">지역</label>
                    {/* 주소 입력 필드 */}
                    <input
                        id="new-address"
                        type="text"
                        placeholder="새 지역 입력"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                </div>
                <div className="hmk_address-actions">
                    {/* 주소 변경 취소 버튼 */}
                    <button onClick={() => closeModal('address')}>취소</button>
                    {/* 주소 변경 확인 버튼 */}
                    <button onClick={() => handleChange('address')}>확인</button>
                </div>
            </Modal>

            {/* 비밀번호 변경 모달 */}
            <Modal type="password" isOpen={modalState.password} onClose={() => closeModal('password')}>
                <h2>비밀번호 변경</h2>
                <div className="hmk_password-field">
                    <label htmlFor="current-password">비밀번호</label>
                    {/* 현재 비밀번호 입력 필드 */}
                    <input
                        id="current-password"
                        type="password"
                        placeholder="현재 비밀번호 입력"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="hmk_password-field">
                    <label htmlFor="new-password">새 비밀번호</label>
                    {/* 새 비밀번호 입력 필드 */}
                    <input
                        id="new-password"
                        type="password"
                        placeholder="새 비밀번호 입력"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="hmk_password-actions">
                    {/* 비밀번호 변경 취소 버튼 */}
                    <button onClick={() => closeModal('password')}>취소</button>
                    {/* 비밀번호 변경 확인 버튼 */}
                    <button onClick={() => handleChange('password')}>확인</button>
                </div>
            </Modal>

            {/* 기프티콘 상세 모달 */}
            <Modal type="cargo_detail" isOpen={modalDetailState} onClose={closeDetailModal}>
                {selectedGift && (
                    <>
                        {/* 선택된 기프티콘의 이름 표시 */}
                        <h2 className="hmk_cargo_detail-content">{selectedGift.name}</h2>
                        {/* 선택된 기프티콘의 이미지 표시 */}
                        <img src={selectedGift.image} alt={selectedGift.name} className="hmk_cargo_detail-image" />
                        {/* 기프티콘 상세 설명 (추가 정보 필요 시 수정) */}
                        <p className="hmk_cargo_detail-content">상세 설명이 여기에 표시됩니다.</p>
                        <div className="hmk_cargo_detail-actions">
                            {/* 상세 모달 닫기 버튼 */}
                            <button className="hmk_cargo_btnmodal" onClick={closeDetailModal}>확인</button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );

};

export default Cargo;
