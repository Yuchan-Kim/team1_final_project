// src/ham_pages/ham_mypage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto'; // 차트 만드는 라이브러리

// Header, Sidebar, Topbar, Modal, ProfileOptions 컴포넌트 import
import Header from './ham_common/ham_header';
import Sidebar from './ham_common/ham_sidebar';
import Topbar from './ham_common/ham_topbar';
import Modal from './ham_common/ham_modal';
import ProfileOptions from './ham_common/ham_profileOptions';

//공통 리셋 & 마이페이지 스타일 
import '../ham_asset/css/reset.css';
import '../ham_asset/css/ham_mypage.css';

// 프로필 이미지 데이터 임포트
import { profileItems, defaultProfile } from '../ham_data/ham_profileData';

// 차트 출력용 더미 데이터
const chartData = [
    { id: "chart1", data: [66, 34], color: "#3a7afe", label: "66%", title: "일반 방 출석률", stat: "85일 / 128 일", link: "View Details" },
    { id: "chart2", data: [74, 26], color: "#3a7afe", label: "74%", title: "챌린지 방 출석률", stat: "73일 / 85 일", link: "Go to challenge lists" },
    { id: "chart3", data: [74, 26], color: "#3a7afe", label: "74%", title: "로그인 출석 체크", stat: "158 일 of 235 일", link: "Go to check-in" },
    { id: "chart4", data: [97, 3], color: "#3a7afe", label: "97%", title: "과제 수행 / 출석일 (일반방)", stat: "83일 / 85 일", link: "View Details" },
    { id: "chart5", data: [100, 0], color: "#28a745", label: "100%", title: "과제 수행 / 출석일 (챌린지)", stat: "73일 / 73 일", link: "View Details" },
];

// 챌린지 리스트 더미 데이터
const challenges = {
    ongoing: [
        { id: 1, title: '반갑습니다. 매일 500m 걷기 챌린지 방입니다.', date: '2024 / 03 / 21 ~ 2024 / 04 / 20 (30일)', image: 'IMG_4879.jpg' },
        { id: 2, title: '건강한 루틴을 만드는 것은 중요합니다.', date: '2024 / 02 / 01 ~ 2024 / 02 / 20 (20일)', image: 'IMG_4878.jpg' },
        { id: 3, title: '안녕하세요! 100m 걷기 챌린지입니다.', date: '2024 / 02 / 01 ~ 2024 / 02 / 20 (20일)', image: 'IMG_4878.jpg' },
        { id: 4, title: '500m 걷기 챌린지 시작합니다.', date: '2024 / 02 / 01 ~ 2024 / 02 / 20 (20일)', image: 'IMG_4879.jpg' },
    ],
    upcoming: [
        { id: 5, title: '제목 뭐 뭐하는 방~', date: '2024 / 03 / 01 ~ 2024 / 03 / 10 (10일)', image: 'IMG_4646.jpg' },
    ],
    completed: [
        { id: 6, title: '제목', date: '2024 / 01 / 01 ~ 2024 / 01 / 31', image: 'IMG_4645.jpg' },
        { id: 7, title: '제목', date: '2024 / 01 / 01 ~ 2024 / 01 / 31', image: 'IMG_4645.jpg' },
    ],
};

const MyPage = () => {
    // 모달 초기 상태값 세팅
    const [modalState, setModalState] = useState({
        profile: false,
        password: false,
        address: false,
        nickname: false,
    });
    // 프로필 이미지 관련 state
    const [selectedProfileImage, setSelectedProfileImage] = useState(null); // 선택된 프로필 이미지
    const [profileImage, setProfileImage] = useState(defaultProfile); // 현재 프로필 이미지
    // 비밀번호 변경 관련 state
    const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 입력값
    const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 입력값
    const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 입력값
    // 주소 변경 관련 state
    const [newAddress, setNewAddress] = useState(''); // 새 주소 입력값
    // 닉네임 변경 관련 state
    const [newNickname, setNewNickname] = useState(''); // 새 닉네임 입력값
    // 챌린지 히스토리 탭 전환 상태값
    const [activeTab, setActiveTab] = useState('ongoing'); // 현재 활성화된 챌린지 탭 (진행 중, 시작 전, 종료)

    // 차트 생성 및 파괴 관리
    useEffect(() => {
        const chartInstances = {}; // 차트 인스턴스를 저장하는 객체

        chartData.forEach((chart) => {
            const canvas = document.getElementById(chart.id); // 차트를 그릴 canvas 요소 가져오기
            if (!canvas) return;
            const ctx = canvas.getContext("2d"); // 2D 컨텍스트 얻기

            if (chartInstances[chart.id]) {
                chartInstances[chart.id].destroy(); // 기존 차트 인스턴스 제거
            }

            chartInstances[chart.id] = new Chart(ctx, {
                type: "doughnut", // 도넛형 차트
                data: {
                    datasets: [
                        {
                            data: chart.data,
                            backgroundColor: [chart.color, "#e0e0e0"], // 차트 색상 설정
                            borderWidth: 0,
                        },
                    ],
                },
                options: {
                    cutout: "70%", // 가운데 비율 설정
                    responsive: true, // 반응형 설정
                    maintainAspectRatio: false, // 반응형일 때 비율 유지하지 않음
                    plugins: {
                        tooltip: { enabled: false }, // 툴팁 비활성화
                        legend: { display: false }, // 범례 비활성화
                    },
                    animation: {
                        onComplete: function () {
                            if (!this.chart) return;

                            const ctx = this.chart.ctx;
                            if (!ctx) return;

                            const width = this.chart.width;
                            const height = this.chart.height;

                            ctx.restore();
                            const fontSize = (height / 4).toFixed(2);
                            ctx.font = `${fontSize}px Arial`;
                            ctx.textBaseline = "middle";
                            ctx.fillStyle = "#000";

                            const text = chart.label; // 차트 중앙에 표시할 텍스트
                            const textX = Math.round((width - ctx.measureText(text).width) / 2);
                            const textY = height / 2;

                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        },
                    },
                },
            });
        });

        // 컴포넌트 언마운트 시 차트 인스턴스 정리
        return () => {
            Object.values(chartInstances).forEach((chartInstance) => {
                chartInstance.destroy(); // 차트 인스턴스 파괴
            });
        };
    }, []);

    // 탭 클릭 시 활성화 상태 변경
    const handleTabClick = (tab) => {
        setActiveTab(tab); // 클릭된 탭으로 activeTab 업데이트
    };

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
        if (type === 'nickname') setNewNickname('');
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
            setProfileImage(selectedProfileImage); // 프로필 이미지 업데이트
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

    // 기본 이미지 적용 함수 (예시)
    const handleDefaultImageApply = () => {
        setProfileImage(defaultProfile); // 기본 이미지로 설정
        setSelectedProfileImage(null); // 선택된 이미지 초기화
        closeModal('profile'); // 모달 닫기
    };

    // 정보 변경을 처리하는 함수 (예: API 호출 추가 가능)
    const handleChange = (type) => {
        switch (type) {
            case 'nickname':
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                console.log("닉네임 변경:", newNickname);
                closeModal('nickname'); // 모달 닫기
                break;
            case 'address':
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                console.log("주소 변경:", newAddress);
                closeModal('address'); // 모달 닫기
                break;
            case 'password':
                // 여기서 실제 변경 로직을 추가 (예: API 호출)
                if (newPassword === '') {
                    alert("새 비밀번호를 입력해주세요.");
                    return;
                }
                if (newPassword !== confirmPassword) {
                    alert("비밀번호가 일치하지 않습니다.");
                    return;
                }
                console.log("비밀번호 변경:", currentPassword, newPassword);
                closeModal('password'); // 모달 닫기
                break;
            default:
                break;
        }
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
                profileImage={profileImage || defaultProfile}
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

                    <div className="hmk_stat-container">
                        {chartData.map((chart) => (
                            <div key={chart.id} className="hmk_stat-card" style={{ position: 'relative' }}>
                                <div className="hmk_chart">
                                    <canvas className="hmk_chart_item" id={chart.id} width="71" height="71"></canvas>
                                    <div className="hmk_stat-card_chart-center-text">
                                        {chart.label} {/* 차트 중앙에 표시될 텍스트 */}
                                    </div>
                                </div>
                                <div className="hmk_stat-info">
                                    <p className="hmk_stat-title">{chart.title}</p>
                                    <p className="hmk_stat-data">{chart.stat}</p>
                                    <Link to="#" className="hmk_stat-link">{chart.link}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hmk_tab-menu">
                        <button className={`hmk_tab-button ${activeTab === 'ongoing' ? 'hmk_active' : ''}`} onClick={() => handleTabClick('ongoing')}>
                            진행중인 챌린지
                        </button>
                        <button className={`hmk_tab-button ${activeTab === 'upcoming' ? 'hmk_active' : ''}`} onClick={() => handleTabClick('upcoming')}>
                            시작 전 챌린지
                        </button>
                        <button className={`hmk_tab-button ${activeTab === 'completed' ? 'hmk_active' : ''}`} onClick={() => handleTabClick('completed')}>
                            종료 된 챌린지
                        </button>
                    </div>

                    <div className="hmk_challenge-list">
                        {challenges[activeTab].map((challenge) => (
                            <div key={challenge.id} className="hmk_challenge-card">
                                <img src={require(`../ham_asset/images/${challenge.image}`)} alt="챌린지" className="hmk_challenge-image" />
                                <div className="hmk_challenge-details">
                                    <p className="hmk_challenge-date">{challenge.date}</p>
                                    <p className="hmk_challenge-title">{challenge.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 프로필 변경 모달 */}
            <Modal type="profile" isOpen={modalState.profile} onClose={() => closeModal('profile')}>
                <h2>프로필 변경</h2>
                <p>자신의 프로필을 꾸며보세요</p>
                {/* 프로필 이미지 선택 옵션을 별도의 컴포넌트로 분리 */}
                <ProfileOptions
                    profiles={profileItems}
                    selectedProfile={selectedProfileImage}
                    onSelect={handleProfileSelect}
                />
                <div className="hmk_profile-actions">
                    {/* 프로필 이미지 확인 버튼 */}
                    <button onClick={handleProfileConfirm}>확인</button>
                    <button onClick={handlePointShopRedirect}>포인트 상점 이동</button>
                    <button onClick={handleDefaultImageApply}>기본 이미지 적용</button>
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
                        {/* 닉네임 입력 필드 */}
                        <input
                            id="new-nickname"
                            name="nickname"
                            type="text"
                            placeholder="새 닉네임 입력"
                            value={newNickname}
                            onChange={(e) => setNewNickname(e.target.value)}
                            autoComplete="nickname"
                            required
                        />
                    </div>
                    <div className="hmk_nickname-actions">
                        {/* 닉네임 변경 취소 버튼 */}
                        <button type="button" onClick={() => closeModal('nickname')}>취소</button>
                        {/* 닉네임 변경 확인 버튼 */}
                        <button type="submit">확인</button>
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
                        {/* 주소 변경 취소 버튼 */}
                        <button type="button" onClick={() => closeModal('address')}>취소</button>
                        {/* 주소 변경 확인 버튼 */}
                        <button type="submit">확인</button>
                    </div>
                </form>
            </Modal>

            {/* 비밀번호 변경 모달 */}
            <Modal type="password" isOpen={modalState.password} onClose={() => closeModal('password')}>
                <h2>비밀번호 변경</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleChange('password'); }}>
                    <div className="hmk_password-field">
                        <label htmlFor="current-password">현재 비밀번호</label>
                        {/* 현재 비밀번호 입력 필드 */}
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
                        {/* 새 비밀번호 입력 필드 */}
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
                        {/* 비밀번호 확인 입력 필드 */}
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
                        {/* 비밀번호 변경 취소 버튼 */}
                        <button type="button" onClick={() => closeModal('password')}>취소</button>
                        {/* 비밀번호 변경 확인 버튼 */}
                        <button type="submit">확인</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MyPage;
