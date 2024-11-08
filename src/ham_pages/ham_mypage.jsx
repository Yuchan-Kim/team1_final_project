import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto'; // 차트 만드는 라이브러리
import '../ham_asset/css/reset.css';
import '../ham_asset/css/mypage.css';

// 아이콘 이미지 import
import ChallengeIcon from '../ham_asset/images/challenge.png';
import FriendsIcon from '../ham_asset/images/friends.png';
import PointsIcon from '../ham_asset/images/points.png';
import InventoryIcon from '../ham_asset/images/inventory.png';

// 공용 이미지 import
import DefaultProfile from '../ham_asset/images/profile-fill.png'; // 기본 프로필 이미지
import InitialProfileImage from '../ham_asset/images/IMG_4879.jpg'; // 초기 프로필 이미지

// 공통 Modal 컴포넌트(정보 수정용 모달창 공통틀)
const Modal = ({ type, isOpen, onClose, children }) => {
    if (!isOpen) return null; // isOpen이 false이면 모달을 렌더링하지 않음
    return (
        <div className={`hmk_${type}-modal`}>
            <div className={`hmk_${type}-modal-content`}>
                <button className="hmk_close-modal" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

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
    // 프로필 편집용 상태값
    const [selectedProfileImage, setSelectedProfileImage] = useState(null); // 선택된 프로필 이미지
    const [profileImage, setProfileImage] = useState(InitialProfileImage);    // 현재 프로필 이미지
    // 비밀번호 편집용 상태값
    const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호
    const [newPassword, setNewPassword] = useState(''); // 새 비밀번호
    // 지역설정 편집용 상태값
    const [newAddress, setNewAddress] = useState(''); // 새로 입력한 지역 정보
    const [newNickname, setNewNickname] = useState(''); // 새로 입력한 닉네임
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

    // 모달 열기
    const openModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: true })); // 해당 모달 유형의 상태를 true로 설정
    };

    // 모달 닫기
    const closeModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: false })); // 해당 모달 유형의 상태를 false로 설정
        if (type === 'nickname') setNewNickname(''); // 닉네임 모달 닫힐 때 입력값 초기화
        if (type === 'address') setNewAddress(''); // 주소 모달 닫힐 때 입력값 초기화
        if (type === 'password') {
            setCurrentPassword(''); // 비밀번호 모달 닫힐 때 입력값 초기화
            setNewPassword('');
        }
    };

    // 정보 변경 확인
    const handleChange = (type) => {
        switch (type) {
            case 'nickname':
                console.log('New Nickname:', newNickname); // 새 닉네임 출력
                closeModal('nickname');
                break;
            case 'address':
                console.log('New Address:', newAddress); // 새 주소 출력
                closeModal('address');
                break;
            case 'password':
                console.log('Current Password:', currentPassword); // 현재 비밀번호 출력
                console.log('New Password:', newPassword); // 새 비밀번호 출력
                closeModal('password');
                break;
            default:
                break;
        }
    };

    // 프로필 이미지 선택 시 상태 업데이트
    const handleProfileSelect = (imageSrc) => {
        setSelectedProfileImage(imageSrc); // 선택된 프로필 이미지 상태로 저장
    };

    // 선택된 프로필 이미지 저장 및 모달 닫기
    const handleProfileConfirm = () => {
        if (selectedProfileImage) {
            setProfileImage(selectedProfileImage); // 프로필 이미지 상태 업데이트
        }
        closeModal('profile');
    };

    return (
        <div className="wrap">
            <header className="hmk_header">
                <img src="https://via.placeholder.com/50" alt="Logo" className="hmk_logo" />
                <div className="hmk_topmenu">
                    <ul className="hmk_menu">
                        <li><Link to="#">챌린지</Link></li>
                        <li><Link to="#">커뮤니티</Link></li>
                        <li><Link to="#">힝키</Link></li>
                        <li><Link to="#">상점</Link></li>
                        <li><Link to="#">고객센터</Link></li>
                    </ul>
                    <ul className="hmk_menu2">
                        <li>
                            <Link to="#">
                                <img src={profileImage || DefaultProfile} alt="Profile" />
                            </Link>
                        </li>
                        <li><p>씽씽이김유찬</p></li>
                        <li><span>3600</span></li>
                        <li><Link to="#">로그아웃</Link></li>
                    </ul>
                </div>
            </header>

            <div className="hmk_main-container">
                <aside className="aside">
                    <h1>나의 정보</h1>
                    <div className="hmk_sidebar">
                        <ul>
                            <li>
                                <img src={ChallengeIcon} alt="Challenge" className="Challenge_ico" />
                                <Link to="#">나의 챌린지</Link>
                            </li>
                            <li>
                                <img src={FriendsIcon} alt="Friends" className="Fr_ico" />
                                <Link to="#">친구</Link>
                            </li>
                            <li>
                                <img src={PointsIcon} alt="Points" className="Point_ico" />
                                <Link to="/user/mypoint">포인트 내역</Link>
                            </li>
                            <li>
                                <img src={InventoryIcon} alt="Inventory" className="inven_ico" />
                                <Link to="/user/cargo">보관함</Link>
                            </li>
                        </ul>
                    </div>
                </aside>

                <div className="hmk_main">
                    <div className="hmk_topbar">
                        <div className="hmk_Profile">
                            <div className="hmk_profile-container">
                                <div className="hmk_profile-image">
                                    <img src={profileImage} alt="Profile" />
                                    <button className="hmk_edit-profile" onClick={() => openModal('profile')}>
                                        <span className="hmk_edit-pficon">✎</span>
                                    </button>
                                </div>
                            </div>
                            <ul>
                                <li>
                                    <Link to="#">{newNickname || "씽씽이김유찬"}</Link>
                                    <button id="nickchange" className="hmk_edit-button" onClick={() => openModal('nickname')}>
                                        <span className="hmk_edit-icon">✎</span>
                                    </button>
                                </li>
                                <li>
                                    <Link to="#">{newAddress || "경기 어디"}</Link>
                                    <button id="addchange" className="hmk_edit-button" onClick={() => openModal('address')}>
                                        <span className="hmk_edit-icon">✎</span>
                                    </button>
                                </li>
                                <li>
                                    <Link to="#">비밀번호 변경</Link>
                                    <button id="pwchange" className="hmk_edit-button" onClick={() => openModal('password')}>
                                        <span className="hmk_edit-icon">✎</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
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

            {/* 프로필 변경 모달 (map으로 리스트 뿌리기 기능)*/}
            <Modal type="profile" isOpen={modalState.profile} onClose={() => closeModal('profile')}>
                <h2>프로필 변경</h2>
                <p>자신의 프로필을 꾸며보세요</p>
                <div className="hmk_profile-options">
                    {["../ham_asset/images/IMG_4879.jpg", "../ham_asset/images/IMG_4878.jpg", "../ham_asset/images/IMG_4646.jpg", "../ham_asset/images/IMG_4645.jpg", "../ham_asset/images/IMG_4643.jpg"].map((src) => (
                        <img
                            key={src}
                            src={src}
                            alt="프로필 선택"
                            onClick={() => handleProfileSelect(src)}
                            className={selectedProfileImage === src ? "selected-profile" : ""}
                        />
                    ))}
                </div>
                <div className="hmk_profile-actions">
                    <button onClick={handleProfileConfirm}>확인</button>
                    <button>포인트 상점 이동</button>
                    <button>기본 이미지 적용</button>
                    <button onClick={() => closeModal('profile')}>취소</button>
                </div>
            </Modal>

            {/* 닉네임 변경 모달 */}
            <Modal type="nickname" isOpen={modalState.nickname} onClose={() => closeModal('nickname')}>
                <h2>닉네임 변경</h2>
                <p>새로운 닉네임을 입력해주세요</p>
                <div className="hmk_nickname-field">
                    <label htmlFor="new-nickname">닉네임 (필수)</label>
                    <input
                        id="new-nickname"
                        type="text"
                        placeholder="새 닉네임 입력"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                    />
                </div>
                <div className="hmk_nickname-actions">
                    <button onClick={() => closeModal('nickname')}>취소</button>
                    <button onClick={() => handleChange('nickname')}>확인</button>
                </div>
            </Modal>

            {/* 지역 변경 모달 */}
            <Modal type="address" isOpen={modalState.address} onClose={() => closeModal('address')}>
                <h2>지역 변경</h2>
                <p>새로운 지역을 입력해주세요</p>
                <div className="hmk_address-field">
                    <label htmlFor="new-address">지역</label>
                    <input
                        id="new-address"
                        type="text"
                        placeholder="새 지역 입력"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                    />
                </div>
                <div className="hmk_address-actions">
                    <button onClick={() => closeModal('address')}>취소</button>
                    <button onClick={() => handleChange('address')}>확인</button>
                </div>
            </Modal>

            {/* 비밀번호 변경 모달 */}
            <Modal type="password" isOpen={modalState.password} onClose={() => closeModal('password')}>
                <h2>비밀번호 변경</h2>
                <div className="hmk_password-field">
                    <label htmlFor="current-password">비밀번호</label>
                    <input
                        id="current-password"
                        type="password"
                        placeholder="30자 이내"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="hmk_password-field">
                    <label htmlFor="new-password">새 비밀번호</label>
                    <input
                        id="new-password"
                        type="password"
                        placeholder="30자 이내"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="hmk_password-actions">
                    <button onClick={() => closeModal('password')}>취소</button>
                    <button onClick={() => handleChange('password')}>확인</button>
                </div>
            </Modal>
        </div>
    );
};

export default MyPage;
