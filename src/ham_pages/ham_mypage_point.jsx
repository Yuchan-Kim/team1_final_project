import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // 날짜 선택기 import
import '../ham_asset/css/reset.css';
import '../ham_asset/css/mypage.css';
import '../ham_asset/css/pointpage.css';
import 'react-datepicker/dist/react-datepicker.css';


// 아이콘 이미지 import
import ChallengeIcon from '../ham_asset/images/challenge.png';
import FriendsIcon from '../ham_asset/images/friends.png';
import PointsIcon from '../ham_asset/images/points.png';
import InventoryIcon from '../ham_asset/images/inventory.png';

// 공용 이미지 import
import DefaultProfile from '../ham_asset/images/profile-fill.png';
import InitialProfileImage from '../ham_asset/images/IMG_4879.jpg';

// 공통 Modal 컴포넌트
const Modal = ({ type, isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className={`hmk_${type}-modal`}>
            <div className={`hmk_${type}-modal-content`}>
                <button className="hmk_close-modal" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};


const Pointpage = () => {
    const [modalState, setModalState] = useState({
        profile: false,
        password: false,
        address: false,
        nickname: false,
    });

    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [profileImage, setProfileImage] = useState(InitialProfileImage);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newNickname, setNewNickname] = useState('');

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('전체'); // 기본 상태로 '전체' 설정

    const openModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: true }));
    };

    const closeModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: false }));
        if (type === 'nickname') setNewNickname('');
        if (type === 'address') setNewAddress('');
        if (type === 'password') {
            setCurrentPassword('');
            setNewPassword('');
        }
    };

    const handleChange = (type) => {
        switch (type) {
            case 'nickname':
                console.log('New Nickname:', newNickname);
                closeModal('nickname');
                break;
            case 'address':
                console.log('New Address:', newAddress);
                closeModal('address');
                break;
            case 'password':
                console.log('Current Password:', currentPassword);
                console.log('New Password:', newPassword);
                closeModal('password');
                break;
            default:
                break;
        }
    };

    const handleProfileSelect = (imageSrc) => {
        setSelectedProfileImage(imageSrc);
    };

    const handleProfileConfirm = () => {
        if (selectedProfileImage) {
            setProfileImage(selectedProfileImage);
        }
        closeModal('profile');
    };

    // 탭 전환 함수
    const handleTabChange = (tab) => {
        setActiveTab(tab);
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
                                <Link to="/user/mypage">나의 챌린지</Link>
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

                    {/* 포인트 내역 테이블 */}
                    <div className="hmk_point-history">
                        <h2>포인트 내역</h2>
                        <div className="hmk_point-summary">
                            <div className="hmk_point-box">
                                <p>Total Points</p>
                                <div className="hmk_point-value">1152</div>
                            </div>
                            <div className="hmk_point-box">
                                <p>Points Earned</p>
                                <div className="hmk_point-value">17550</div>
                            </div>
                            <div className="hmk_point-box">
                                <p>Points Spent</p>
                                <div className="hmk_point-value">15998</div>
                            </div>
                        </div>

                        <div className="hmk_point-filter">
                            <p>기간을 선택하세요</p>
                            <div className="hmk_date-options">
                                <button className="hmk_date-button">최근 7일</button>
                                <button className="hmk_date-button">최근 30일</button>
                                <button className="hmk_date-button">최근 90일</button>
                            </div>
                            <div className="hmk_date-inputs">
                                <div className="hmk_date">
                                    <label htmlFor="start-date">시작일</label>
                                    <div className="hmk_date-wrapper">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={date => setStartDate(date)}
                                            placeholderText="mm/dd/yyyy          📅"
                                            className="hmk_date-input"
                                        />
                                        <span className="hmk_calendar-icon" onClick={() => setIsStartDatePickerOpen(true)}></span>
                                    </div>
                                </div>
                                <div className="hmk_date">
                                    <label htmlFor="end-date">종료일</label>
                                    <div className="hmk_date-wrapper">
                                        <DatePicker
                                            selected={endDate}
                                            onChange={date => setEndDate(date)}
                                            placeholderText="mm/dd/yyyy          📅"
                                            className="hmk_date-input"
                                        />
                                        <span className="hmk_calendar-icon" onClick={() => setIsEndDatePickerOpen(true)}></span>
                                    </div>
                                </div>

                                <button className="hmk_search-button">검색</button>
                            </div>

                        </div>
                        {/* 포인트 토글 버튼 */}
                        <div className="hmk_toggle-container">
                            <button
                                className={`hmk_toggle-button ${activeTab === '전체' ? 'active' : ''}`}
                                onClick={() => handleTabChange('전체')}
                            >
                                전체
                            </button>
                            <button
                                className={`hmk_toggle-button ${activeTab === '적립' ? 'active' : ''}`}
                                onClick={() => handleTabChange('적립')}
                            >
                                적립
                            </button>
                            <button
                                className={`hmk_toggle-button ${activeTab === '사용' ? 'active' : ''}`}
                                onClick={() => handleTabChange('사용')}
                            >
                                사용
                            </button>
                        </div>
                        {/* 여기에서 activeTab에 따라 다른 테이블 내용 보여주기 */}
                        <table className="hmk_point-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === '전체' && (
                                    <>
                                        {/* 전체 내역 데이터 */}
                                        <tr>
                                            <td>7.30</td>
                                            <td>출석체크 보상</td>
                                            <td>+ 100</td>
                                            <td>1,152</td>
                                        </tr>
                                        <tr>
                                            <td>7.30</td>
                                            <td>챌린지 퀘스트 보상</td>
                                            <td>+ 300</td>
                                            <td>902</td>
                                        </tr>
                                        <tr>
                                            <td>7.27</td>
                                            <td>프로필 구매</td>
                                            <td>- 5,999</td>
                                            <td>10,251</td>
                                        </tr>
                                        {/* ... 다른 전체 내역 데이터 */}
                                    </>
                                )}
                                {activeTab === '적립' && (
                                    <>
                                        {/* 적립 내역 데이터 */}
                                        <tr>
                                            <td>7.30</td>
                                            <td>출석체크 보상</td>
                                            <td>+ 100</td>
                                            <td>1,152</td>
                                        </tr>
                                        <tr>
                                            <td>7.30</td>
                                            <td>챌린지 퀘스트 보상</td>
                                            <td>+ 300</td>
                                            <td>902</td>
                                        </tr>
                                        {/* ... 다른 적립 내역 데이터 */}
                                    </>
                                )}
                                {activeTab === '사용' && (
                                    <>
                                        {/* 사용 내역 데이터 */}
                                        <tr>
                                            <td>7.27</td>
                                            <td>프로필 구매</td>
                                            <td>- 5,999</td>
                                            <td>10,251</td>
                                        </tr>
                                        {/* ... 다른 사용 내역 데이터 */}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* 프로필 변경 모달 */}
            < Modal type="profile" isOpen={modalState.profile} onClose={() => closeModal('profile')}>
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
            </Modal >

            {/* 닉네임 변경 모달 */}
            < Modal type="nickname" isOpen={modalState.nickname} onClose={() => closeModal('nickname')}>
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
            </Modal >

            {/* 지역 변경 모달 */}
            < Modal type="address" isOpen={modalState.address} onClose={() => closeModal('address')}>
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
            </Modal >

            {/* 비밀번호 변경 모달 */}
            < Modal type="password" isOpen={modalState.password} onClose={() => closeModal('password')}>
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
            </Modal >
        </div >
    );
};

export default Pointpage;
