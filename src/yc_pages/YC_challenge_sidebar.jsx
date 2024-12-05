// src/components/YCChallengeSidebar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import '../yc_assets/yc_css/yc_css_challenge_sidebar.css';
import { FaHome, FaBullhorn, FaTasks, FaUpload, FaUserFriends, FaCogs } from 'react-icons/fa';

Modal.setAppElement('#root');

const YCChallengeSidebar = () => {
    const navigate = useNavigate();
    const { roomNum } = useParams();
   
    const [regions, setRegions] = useState([]);
    const [currentParticipantCount, setCurrentParticipantCount] = useState(0);

    // 모달 상태 관리
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [exitModalMessage, setExitModalMessage] = useState('');
    const [exitModalType, setExitModalType] = useState('');

    // 방 상태 및 사용자 권한 상태 관리
    const [roomStatusNum, setRoomStatusNum] = useState(null);
    const [enteredUserAuth, setEnteredUserAuth] = useState(null);
    const [enteredUserStatusNum, setEnteredUserStatusNum] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isExitButtonVisible = roomStatusNum !== 4;
    const isMenuDisabled = roomStatusNum !== 3 && roomStatusNum !== 4;

    // 관리 모달 폼 상태
    const [formData, setFormData] = useState({
        regionNum: '',
        roomKeyword: '',
        roomTitle: '',
        roomThumbnail: null,
        roomMinNum: '',
        roomMaxNum: '',
        roomEnterPoint: '',
        roomEnterRate: '',
        evaluationType: ''
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // 섹션별 업데이트 상태
    const [updateStatus, setUpdateStatus] = useState({
        regionNum: { loading: false, error: null, success: null },
        roomKeyword: { loading: false, error: null, success: null },
        roomTitle: { loading: false, error: null, success: null },
        roomThumbnail: { loading: false, error: null, success: null },
        roomMinNum: { loading: false, error: null, success: null },
        roomMaxNum: { loading: false, error: null, success: null },
        roomEnterPoint: { loading: false, error: null, success: null },
        roomEnterRate: { loading: false, error: null, success: null },
        evaluationType: { loading: false, error: null, success: null },
    });

    const isExitDisabled = !(enteredUserStatusNum === 1 && enteredUserAuth !== null);
    const isMissionSubmissionDisabled = [1, 2, 4].includes(roomStatusNum);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');

            try {
                // 방 헤더 정보 가져오기
                const roomHeaderResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/header/${roomNum}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (roomHeaderResponse.data.result === 'success') {
                    const headerInfo = roomHeaderResponse.data.apiData;
                    setRoomStatusNum(headerInfo.roomStatusNum);
                    setEnteredUserStatusNum(headerInfo.enteredUserStatusNum);
                } else {
                    console.error('방 헤더 정보 가져오기 실패:', roomHeaderResponse.data.message);
                    setError('방 헤더 정보를 가져오는 데 실패했습니다.');
                }

                // 토큰이 있을 때만 사용자 권한 정보 가져오기
                if (token) {
                    const userAuthResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (userAuthResponse.data.result === 'success') {
                        setEnteredUserAuth(userAuthResponse.data.apiData);
                    } else {
                        console.error('사용자 권한 정보 가져오기 실패:', userAuthResponse.data.message);
                        setError('사용자 권한을 가져오는 데 실패했습니다.');
                    }
                }
            } catch (error) {
                console.error('데이터 가져오기 오류:', error);
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [roomNum]);

    // 모달 열기 및 닫기 함수
    const openModal = () => {
        setIsModalOpen(true);
        setIsExitModalOpen(false); // 다른 모달을 닫음
        fetchRoomDetails();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormError(null);
        setSuccessMessage(null);
    };

    // 방 상세 정보 가져오기
    const fetchRoomDetails = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/${roomNum}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                const data = response.data.apiData[0];
                console.log(data);
                setFormData({
                    regionNum: data.regionNum,
                    roomKeyword: data.roomKeyword,
                    roomTitle: data.roomTitle,
                    roomMinNum: data.roomMinNum,
                    roomMaxNum: data.roomMaxNum,
                    roomEnterPoint: data.roomPoint,
                    roomEnterRate: data.roomRate,
                    evaluationType: data.evaluationType === 1 ? '방장' : '유저'
                });
                setPreviewImage(data.roomThumbnail);
            } else {
                setFormError('방 상세 정보를 가져오는 데 실패했습니다.');
            }

            // 지역 목록 가져오기
            const regionsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/regions`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (regionsResponse.data.result === 'success') {
                setRegions(regionsResponse.data.apiData);
            } else {
                console.error('지역 정보 가져오기 실패:', regionsResponse.data.message);
                setError('지역 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('방 상세 정보 가져오기 오류:', error);
            setFormError('방 상세 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    // 폼 입력 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 이미지 파일 선택 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevState => ({
                ...prevState,
                roomThumbnail: file
            }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // 섹션별 업데이트 핸들러
    const handleSectionUpdate = async (section) => {
        setUpdateStatus(prevState => ({
            ...prevState,
            [section]: { ...prevState[section], loading: true, error: null, success: null }
        }));
    
        const token = localStorage.getItem('token');
        if (!token) {
            setUpdateStatus(prevState => ({
                ...prevState,
                [section]: { ...prevState[section], loading: false, error: '로그인이 필요합니다.', success: null }
            }));
            return;
        }
    
        let url = '';
        let data = {};
        let headers = {
            'Authorization': `Bearer ${token}`
        };
    
        switch (section) {
            case 'regionNum':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-region/${roomNum}`;
                data = { regionNum: formData.regionNum };
                headers['Content-Type'] = 'application/json';
                break;
            case 'roomKeyword':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-keyword/${roomNum}`;
                data = { roomKeyword: formData.roomKeyword };
                headers['Content-Type'] = 'application/json';
                break;
            case 'roomTitle':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-title/${roomNum}`;
                data = { roomTitle: formData.roomTitle };
                headers['Content-Type'] = 'application/json';
                break;
            case 'roomThumbnail':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-thumbnail/${roomNum}`;
                if (formData.roomThumbnail) {
                    data = new FormData();
                    data.append('roomThumbnail', formData.roomThumbnail);
                    headers['Content-Type'] = 'multipart/form-data';
                } else {
                    setUpdateStatus(prevState => ({
                        ...prevState,
                        [section]: { ...prevState[section], loading: false, error: '이미지를 선택해주세요.', success: null }
                    }));
                    return;
                }
                break;
            case 'roomMinNum':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-minnum/${roomNum}`;
                data = { roomMinNum: formData.roomMinNum };
                headers['Content-Type'] = 'application/json';
                break;
            case 'roomEnterPoint':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-enterpoint/${roomNum}`;
                data = { roomEnterPoint: formData.roomEnterPoint };
                headers['Content-Type'] = 'application/json';
                break;
            case 'roomEnterRate':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-enterrate/${roomNum}`;
                data = { roomEnterRate: formData.roomEnterRate };
                headers['Content-Type'] = 'application/json';
                break;
            case 'evaluationType':
                url = `${process.env.REACT_APP_API_URL}/api/challenge/update-evaluationtype/${roomNum}`;
                data = { evaluationType: formData.evaluationType === '방장' ? 1 : 2 };
                headers['Content-Type'] = 'application/json';
                break;
            default:
                setUpdateStatus(prevState => ({
                    ...prevState,
                    [section]: { ...prevState[section], loading: false, error: '잘못된 섹션입니다.', success: null }
                }));
                return;
        }
    
        try {
            const response = await axios.put(url, data, {
                headers: headers
            });
    
            if (response.data.result === 'success') {
                setUpdateStatus(prevState => ({
                    ...prevState,
                    [section]: { ...prevState[section], loading: false, error: null, success: '성공적으로 업데이트되었습니다.' }
                }));
                fetchRoomDetails(); // 업데이트된 데이터로 폼 새로고침
            } else {
                setUpdateStatus(prevState => ({
                    ...prevState,
                    [section]: { ...prevState[section], loading: false, error: response.data.message || '업데이트에 실패했습니다.', success: null }
                }));
            }
        } catch (error) {
            console.error(`방 정보 업데이트 오류 (${section}):`, error);
            setUpdateStatus(prevState => ({
                ...prevState,
                [section]: { ...prevState[section], loading: false, error: '업데이트 중 오류가 발생했습니다.', success: null }
            }));
        }
    };

    // 방 나가기 버튼 클릭 핸들러
    const handleExitClick = () => {
        if (enteredUserAuth === 1 && roomStatusNum === 1) {
            setExitModalMessage('방을 나가시겠습니까? 방이 삭제됩니다.');
            setExitModalType('delete');
        } else if (enteredUserAuth === 2 && roomStatusNum === 2) {
            setExitModalMessage('챌린지를 그만 두시겠습니까? 환불이 제공됩니다.');
            setExitModalType('leave');
        } else if (enteredUserAuth === 2 && roomStatusNum === 3) {
            setExitModalMessage('챌린지를 그만 두시겠습니까? 환불이 제공되지 않습니다.');
            setExitModalType('leave_norefund');
        } else if (enteredUserAuth === 1 && roomStatusNum === 2) {
            setExitModalMessage('챌린지를 그만 두시겠습니까? 방장을 다른 사용자에게 위임합니다.');
            setExitModalType('transfer');
        } else if (enteredUserAuth === 1 && roomStatusNum === 3) {
            setExitModalMessage('챌린지를 그만 두시겠습니까? 챌린지가 진행 중입니다. \n 방장을 다른 사용자에게 위임합니다.');
            setExitModalType('transfer_norefund');
        } else {
            return;
        }
        setIsExitModalOpen(true);
        setIsModalOpen(false); // 다른 모달을 닫음
    };

    // 방 나가기 확인 핸들러
    const handleExitConfirm = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/user/loginform');
            return;
        }
        try {
            let response;
            if (exitModalType === 'delete') {
                response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/challenge/delete-room/${roomNum}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.result === 'success') {
                    alert('방이 삭제되었습니다.');
                    navigate('/');
                } else {
                    alert('방 삭제에 실패했습니다.');
                }
            } else if (exitModalType === 'leave') {
                response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/leave-room/${roomNum}`, null, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.result === 'success') {
                    alert('챌린지를 나갔습니다.');
                    navigate('/');
                } else {
                    alert('챌린지 나가기에 실패했습니다.');
                }
            } else if (exitModalType === 'leave_norefund') {
                response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/leave-room-no-refund/${roomNum}`, null, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.result === 'success') {
                    alert('챌린지를 나갔습니다. 환불은 제공되지 않습니다.');
                    navigate('/');
                } else {
                    alert('챌린지 나가기에 실패했습니다.');
                }
            } else if (exitModalType === 'transfer') {
                response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/leave-room/${roomNum}`, null, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.result === 'success') {
                    alert('챌린지를 나가고 방장이 위임되었습니다.');
                    navigate('/');
                } else {
                    alert('챌린지 나가기에 실패했습니다.');
                }
            } else if (exitModalType === 'transfer_norefund') {
                response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/leave-room-no-refund/${roomNum}`, null, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data.result === 'success') {
                    alert('챌린지를 나가고 방장이 위임되었습니다. 환불은 제공되지 않습니다.');
                    navigate('/');
                } else {
                    alert('챌린지 나가기에 실패했습니다.');
                }
            }
        } catch (error) {
            console.error('서버와의 통신 오류:', error);
            alert('서버와의 통신에 실패했습니다.');
        } finally {
            setIsExitModalOpen(false);
        }
    };

    // 방 나가기 모달 닫기 핸들러
    const closeExitModal = () => {
        setIsExitModalOpen(false);
    };

    const isDisabled = !(roomStatusNum === 4 || enteredUserAuth === 1 || (enteredUserAuth === 2 && (enteredUserStatusNum === 1) && roomStatusNum > 2));

    return (
        <aside className="yc-challenge-sidebar_sidebar">
            {isLoading ? (
                <div className="yc-loading-spinner_sidebar">로딩 중...</div>
            ) : (
                <>
                    {error && <div className="yc-error-message_sidebar">{error}</div>}

                    <nav className="yc-challenge-menu_sidebar">
                        
                        <ul>
                            <li className="yc-challenge-sidebar-home_sidebar">
                                <Link to={`/cmain/${roomNum}`} aria-label="홈">
                                    <FaHome size={24} />
                                    <span className="yc-menu-text_sidebar">홈</span>
                                </Link>
                            </li>
                            <li className="yc-challenge-sidebar-notice_sidebar">
                                <Link to={`/board/${roomNum}`} aria-label="공지사항">
                                    <FaBullhorn size={24} />
                                    <span className="yc-menu-text_sidebar">공지사항</span>
                                </Link>
                            </li>
                            <li className={`yc-challenge-menu-mission-detail_sidebar ${isMenuDisabled ? 'yc-disabled_sidebar' : ''}`}>
                                <Link
                                    to={`/missioninfo/${roomNum}`}
                                    aria-label="미션 상세"
                                    onClick={(e) => isMenuDisabled && e.preventDefault()}
                                    className={isMenuDisabled ? 'yc-disabled-link_sidebar' : ''}
                                    title={isMenuDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
                                >
                                    <FaTasks size={24} />
                                    <span className="yc-menu-text_sidebar">미션 히스토리 / 채점</span>
                                </Link>
                            </li>
                            <li className={`yc-challenge-menu-submission-status_sidebar ${isMissionSubmissionDisabled ? 'yc-disabled_sidebar' : ''}`}>
                                <Link
                                    to={`/mission/${roomNum}`}
                                    aria-label="미션 제출"
                                    onClick={(e) => isMissionSubmissionDisabled && e.preventDefault()}
                                    className={isMissionSubmissionDisabled ? 'yc-disabled-link_sidebar' : ''}
                                    title={isMissionSubmissionDisabled ? '현재 상태에서는 미션 제출을 할 수 없습니다.' : ''}
                                >
                                    <FaUpload size={24} />
                                    <span className="yc-menu-text_sidebar">미션 제출</span>
                                </Link>
                            </li>
                            <li className={`yc-challenge-menu-user-status_sidebar ${isMenuDisabled ? 'yc-disabled_sidebar' : ''}`}>
                                <Link
                                    to={`/stat/${roomNum}`}
                                    aria-label="유저 현황"
                                    onClick={(e) => isMenuDisabled && e.preventDefault()}
                                    className={isMenuDisabled ? 'yc-disabled-link_sidebar' : ''}
                                    title={isMenuDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
                                >
                                    <FaUserFriends size={24} />
                                    <span className="yc-menu-text_sidebar">유저 현황</span>
                                </Link>
                            </li>

                            {/* 관리 메뉴: enteredUserAuth === 1인 관리자만 접근 가능 */}
                            {(enteredUserAuth === 1 && (roomStatusNum === 1 || roomStatusNum === 2)) && (
                                <li className="yc-challenge-menu-manage_sidebar">
                                    <Link
                                        onClick={openModal}
                                        aria-label="관리"
                                        className="yc-manage-button_sidebar"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <FaCogs size={24} />
                                        <span className="yc-menu-text_sidebar">관리</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>

                    {/* 관리 모달 */}
                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        contentLabel="관리 모달"
                        className="yc-custom-modal_sidebar"
                        overlayClassName="yc-custom-overlay_sidebar"
                    >
                        <div className="yc-modal-content_sidebar">
                            <button type="button" onClick={closeModal} className="yc-close-modal-button_sidebar" aria-label="모달 닫기">
                                &times;
                            </button>
                            <h2>방 관리</h2>
                            {formError && <div className="yc-error-message_sidebar">{formError}</div>}
                            {successMessage && <div className="yc-success-message_sidebar">{successMessage}</div>}
                            <div className="yc-manage-sections_sidebar">
                                {/* 지역 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-regionNum_sidebar">지역:</label>
                                        <select
                                            id="yc-regionNum_sidebar"
                                            name="regionNum"
                                            value={formData.regionNum}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">지역 선택</option>
                                            {regions.map(region => (
                                                <option key={region.regionNum} value={region.regionNum}>
                                                    {region.regionName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('regionNum')}
                                        disabled={updateStatus.regionNum.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.regionNum.loading ? '업데이트 중...' : '지역 업데이트'}
                                    </button>
                                    {updateStatus.regionNum.error && <div className="yc-error-message_sidebar">{updateStatus.regionNum.error}</div>}
                                    {updateStatus.regionNum.success && <div className="yc-success-message_sidebar">{updateStatus.regionNum.success}</div>}
                                </div>

                                {/* 방 키워드 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-roomKeyword_sidebar">방 키워드:</label>
                                        <input
                                            type="text"
                                            id="yc-roomKeyword_sidebar"
                                            name="roomKeyword"
                                            value={formData.roomKeyword}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomKeyword')}
                                        disabled={updateStatus.roomKeyword.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.roomKeyword.loading ? '업데이트 중...' : '키워드 업데이트'}
                                    </button>
                                    {updateStatus.roomKeyword.error && <div className="yc-error-message_sidebar">{updateStatus.roomKeyword.error}</div>}
                                    {updateStatus.roomKeyword.success && <div className="yc-success-message_sidebar">{updateStatus.roomKeyword.success}</div>}
                                </div>

                                {/* 방 제목 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-roomTitle_sidebar">방 제목:</label>
                                        <input
                                            type="text"
                                            id="yc-roomTitle_sidebar"
                                            name="roomTitle"
                                            value={formData.roomTitle}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomTitle')}
                                        disabled={updateStatus.roomTitle.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.roomTitle.loading ? '업데이트 중...' : '제목 업데이트'}
                                    </button>
                                    {updateStatus.roomTitle.error && <div className="yc-error-message_sidebar">{updateStatus.roomTitle.error}</div>}
                                    {updateStatus.roomTitle.success && <div className="yc-success-message_sidebar">{updateStatus.roomTitle.success}</div>}
                                </div>

                                {/* 방 썸네일 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-roomThumbnail_sidebar">방 썸네일:</label>
                                        {previewImage && (
                                            <div className="yc-image-preview_sidebar">
                                                <img src={`${previewImage}`} alt="방 썸네일 미리보기" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            id="yc-roomThumbnail_sidebar"
                                            name="roomThumbnail"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        
                                        
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomThumbnail')}
                                        disabled={updateStatus.roomThumbnail.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.roomThumbnail.loading ? '업데이트 중...' : '썸네일 업데이트'}
                                    </button>
                                    {updateStatus.roomThumbnail.error && <div className="yc-error-message_sidebar">{updateStatus.roomThumbnail.error}</div>}
                                    {updateStatus.roomThumbnail.success && <div className="yc-success-message_sidebar">{updateStatus.roomThumbnail.success}</div>}
                                </div>

                                {/* 최소 참가 인원 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-roomMinNum_sidebar">최소 참가 인원:</label>
                                        <input
                                            type="number"
                                            id="yc-roomMinNum_sidebar"
                                            name="roomMinNum"
                                            value={formData.roomMinNum}
                                            onChange={handleInputChange}
                                            min="2"
                                            max={formData.roomMaxNum}
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomMinNum')}
                                        disabled={updateStatus.roomMinNum.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.roomMinNum.loading ? '업데이트 중...' : '최소 인원 업데이트'}
                                    </button>
                                    {updateStatus.roomMinNum.error && <div className="yc-error-message_sidebar">{updateStatus.roomMinNum.error}</div>}
                                    {updateStatus.roomMinNum.success && <div className="yc-success-message_sidebar">{updateStatus.roomMinNum.success}</div>}
                                </div>

                                {/* 방 참가 포인트 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-roomEnterPoint_sidebar">방 참가 포인트:</label>
                                        <input
                                            type="number"
                                            id="yc-roomEnterPoint_sidebar"
                                            name="roomEnterPoint"
                                            value={formData.roomEnterPoint}
                                            onChange={handleInputChange}
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomEnterPoint')}
                                        disabled={updateStatus.roomEnterPoint.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.roomEnterPoint.loading ? '업데이트 중...' : '참가 포인트 업데이트'}
                                    </button>
                                    {updateStatus.roomEnterPoint.error && <div className="yc-error-message_sidebar">{updateStatus.roomEnterPoint.error}</div>}
                                    {updateStatus.roomEnterPoint.success && <div className="yc-success-message_sidebar">{updateStatus.roomEnterPoint.success}</div>}
                                </div>

                                {/* 방 참가 비율 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-roomEnterRate_sidebar">방 참가 비율 (%):</label>
                                        <input
                                            type="number"
                                            id="yc-roomEnterRate_sidebar"
                                            name="roomEnterRate"
                                            value={formData.roomEnterRate}
                                            onChange={handleInputChange}
                                            min="0"
                                            max="100"
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomEnterRate')}
                                        disabled={updateStatus.roomEnterRate.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.roomEnterRate.loading ? '업데이트 중...' : '참가 비율 업데이트'}
                                    </button>
                                    {updateStatus.roomEnterRate.error && <div className="yc-error-message_sidebar">{updateStatus.roomEnterRate.error}</div>}
                                    {updateStatus.roomEnterRate.success && <div className="yc-success-message_sidebar">{updateStatus.roomEnterRate.success}</div>}
                                </div>

                                {/* 평가 유형 수정 섹션 */}
                                <div className="yc-manage-section_sidebar">
                                    <div className="yc-form-group_sidebar">
                                        <label htmlFor="yc-evaluationType_sidebar">평가 유형:</label>
                                        <select
                                            id="yc-evaluationType_sidebar"
                                            name="evaluationType"
                                            value={formData.evaluationType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">평가 유형 선택</option>
                                            <option value="방장">방장</option>
                                            <option value="유저">유저</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('evaluationType')}
                                        disabled={updateStatus.evaluationType.loading}
                                        className="yc-update-button_sidebar"
                                    >
                                        {updateStatus.evaluationType.loading ? '업데이트 중...' : '평가 유형 업데이트'}
                                    </button>
                                    {updateStatus.evaluationType.error && <div className="yc-error-message_sidebar">{updateStatus.evaluationType.error}</div>}
                                    {updateStatus.evaluationType.success && <div className="yc-success-message_sidebar">{updateStatus.evaluationType.success}</div>}
                                </div>
                            </div>
                            <div className="yc-modal-buttons_sidebar">
                                <button type="button" onClick={closeModal} className="yc-confirm-button_sidebar">
                                    닫기
                                </button>
                            </div>
                        </div>
                    </Modal>

                    {/* 방 나가기 확인 모달 */}
                    <Modal
                        isOpen={isExitModalOpen}
                        onRequestClose={closeExitModal}
                        contentLabel="방 나가기 확인 모달"
                        className="yc-custom-modal_sidebar"
                        overlayClassName="yc-custom-overlay_sidebar"
                    >
                        <div className="yc-modal-content_sidebar">
                            <p>{exitModalMessage}</p>
                            <div className="yc-modal-buttons_sidebar">
                                {exitModalType === 'delete' ? (
                                    <>
                                        <button onClick={handleExitConfirm} aria-label="방 삭제 확인" className="yc-confirm-button_sidebar">삭제</button>
                                        <button onClick={closeExitModal} aria-label="방 삭제 취소" className="yc-cancel-button_sidebar">취소</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleExitConfirm} aria-label="방 나가기 확인" className="yc-confirm-button_sidebar">확인</button>
                                        <button onClick={closeExitModal} aria-label="방 나가기 취소" className="yc-cancel-button_sidebar">취소</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Modal>

                    {/* 푸터 버튼 */}
                    {isExitButtonVisible && (
                    <div className="yc-challenge-footer-buttons_sidebar">
                        <button className="yc-challenge-report-btn_sidebar" title="신고" aria-label="신고">
                            신고
                        </button>
                        <div className={isExitDisabled ? 'yc-disabled-link_sidebar' : ''}>
                            <button 
                                className="yc-challenge-exit-btn_sidebar" 
                                title="방 나가기" 
                                onClick={isExitDisabled ? null : handleExitClick} 
                                aria-label="방 나가기"
                                disabled={isExitDisabled}
                            >
                                방 탈퇴
                            </button>
                        </div>
                    </div>
                    )}
                </>
            )}
        </aside>
    );

};

export default YCChallengeSidebar;
