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
    const isMenuDisabled = roomStatusNum !== 4;

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
                const data = response.data.apiData;
                console.log(data);
                setFormData({
                    regionNum: response.data.apiData[0].regionNum,
                    roomKeyword: response.data.apiData[0].roomKeyword,
                    roomTitle: response.data.apiData[0].roomTitle,
                    roomThumbnail: response.data.apiData[0].roomThumbnail,
                    roomMinNum: response.data.apiData[0].roomMinNum,
                    roomMaxNum: response.data.apiData[0].roomMaxNum,
                    roomEnterPoint: response.data.apiData[0].roomPoint,
                    roomEnterRate: response.data.apiData[0].roomRate,
                    evaluationType: response.data.apiData[0].evaluationType
                });
                console.log(setFormData.regionNum, setFormData.roomMinNum);
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
            setExitModalMessage('챌린지를 그만 두시겠습니까? 챌린지가 진행 중입니다. 방장을 다른 사용자에게 위임합니다.');
            setExitModalType('transfer_norefund');
        } else {
            return;
        }
        setIsExitModalOpen(true);
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
        <aside className="yc_challenge_sidebar">
            {isLoading ? (
                <div className="loading-spinner">로딩 중...</div>
            ) : (
                <>
                    {error && <div className="yc_error_message">{error}</div>}

                    <nav className="yc_challenge_menu">
                        <ul>
                            <li className="yc_challenge_sidebar_home">
                                <Link to={`/cmain/${roomNum}`} aria-label="홈">
                                    <FaHome size={24} />
                                    <span className="menu-text">홈</span>
                                </Link>
                            </li>
                            <li className="yc_challenge_sidebar_notice">
                                <Link to={`/board/${roomNum}`} aria-label="공지사항">
                                    <FaBullhorn size={24} />
                                    <span className="menu-text">공지사항</span>
                                </Link>
                            </li>
                            <li className={`yc_challenge_sidebar_mission-detail ${isDisabled ? 'disabled' : ''}`}>
                                <Link
                                    to={`/missioninfo/${roomNum}`}
                                    aria-label="미션 상세"
                                    onClick={(e) => isDisabled && e.preventDefault()}
                                    className={isDisabled ? 'disabled-link' : ''}
                                    title={isDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
                                >
                                    <FaTasks size={24} />
                                    <span className="menu-text">미션 히스토리 / 채점</span>
                                </Link>
                            </li>
                            <li className={`yc_challenge_sidebar_submission-status ${isDisabled ? 'disabled' : ''}`}>
                                <Link
                                    to={`/mission/${roomNum}`}
                                    aria-label="미션 제출"
                                    onClick={(e) => isDisabled && e.preventDefault()}
                                    className={isDisabled ? 'disabled-link' : ''}
                                    title={isDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
                                >
                                    <FaUpload size={24} />
                                    <span className="menu-text">미션 제출</span>
                                </Link>
                            </li>
                            <li className={`yc_challenge_sidebar_user-status ${isDisabled ? 'disabled' : ''}`}>
                                <Link
                                    to={`/stat/${roomNum}`}
                                    aria-label="유저 현황"
                                    onClick={(e) => isDisabled && e.preventDefault()}
                                    className={isDisabled ? 'disabled-link' : ''}
                                    title={isDisabled ? '챌린지에 참여해야 이용할 수 있습니다.' : ''}
                                >
                                    <FaUserFriends size={24} />
                                    <span className="menu-text">유저 현황</span>
                                </Link>
                            </li>

                            {/* 관리 메뉴: enteredUserAuth === 1인 관리자만 접근 가능 */}
                            {(enteredUserAuth === 1 && (roomStatusNum === 1 || roomStatusNum === 2)) && (
                                <li className="yc_challenge_sidebar_manage">
                                    <Link
                                        onClick={openModal}
                                        aria-label="관리"
                                        className="manage-button"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <FaCogs size={24} />
                                        <span className="menu-text">관리</span>
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
                        className="custom-modal"
                        overlayClassName="custom-overlay"
                    >
                        <div className="modal-content">
                            <h2>방 관리</h2>
                            {formError && <div className="error-message">{formError}</div>}
                            {successMessage && <div className="success-message">{successMessage}</div>}
                            <div className="manage-sections">
                                {/* 지역 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>지역 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="regionNum">지역:</label>
                                        <select
                                            id="regionNum"
                                            name="regionNum"
                                            value={formData.regionNum}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {/* 실제 지역 데이터로 대체 */}
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
                                    >
                                        {updateStatus.regionNum.loading ? '업데이트 중...' : '지역 업데이트'}
                                    </button>
                                    {updateStatus.regionNum.error && <div className="error-message">{updateStatus.regionNum.error}</div>}
                                    {updateStatus.regionNum.success && <div className="success-message">{updateStatus.regionNum.success}</div>}
                                </div>

                                {/* 방 키워드 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>방 키워드 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="roomKeyword">방 키워드:</label>
                                        <input
                                            type="text"
                                            id="roomKeyword"
                                            name="roomKeyword"
                                            value={formData.roomKeyword}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomKeyword')}
                                        disabled={updateStatus.roomKeyword.loading}
                                    >
                                        {updateStatus.roomKeyword.loading ? '업데이트 중...' : '키워드 업데이트'}
                                    </button>
                                    {updateStatus.roomKeyword.error && <div className="error-message">{updateStatus.roomKeyword.error}</div>}
                                    {updateStatus.roomKeyword.success && <div className="success-message">{updateStatus.roomKeyword.success}</div>}
                                </div>

                                {/* 방 제목 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>방 제목 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="roomTitle">방 제목:</label>
                                        <input
                                            type="text"
                                            id="roomTitle"
                                            name="roomTitle"
                                            value={formData.roomTitle}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomTitle')}
                                        disabled={updateStatus.roomTitle.loading}
                                    >
                                        {updateStatus.roomTitle.loading ? '업데이트 중...' : '제목 업데이트'}
                                    </button>
                                    {updateStatus.roomTitle.error && <div className="error-message">{updateStatus.roomTitle.error}</div>}
                                    {updateStatus.roomTitle.success && <div className="success-message">{updateStatus.roomTitle.success}</div>}
                                </div>

                                {/* 방 썸네일 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>방 썸네일 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="roomThumbnail">방 썸네일:</label>
                                        <input
                                            type="file"
                                            id="roomThumbnail"
                                            name="roomThumbnail"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        {previewImage && (
                                            <div className="image-preview">
                                                <img src={previewImage} alt="방 썸네일 미리보기" />
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomThumbnail')}
                                        disabled={updateStatus.roomThumbnail.loading}
                                    >
                                        {updateStatus.roomThumbnail.loading ? '업데이트 중...' : '썸네일 업데이트'}
                                    </button>
                                    {updateStatus.roomThumbnail.error && <div className="error-message">{updateStatus.roomThumbnail.error}</div>}
                                    {updateStatus.roomThumbnail.success && <div className="success-message">{updateStatus.roomThumbnail.success}</div>}
                                </div>

                                {/* 최소 참가 인원 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>최소 참가 인원 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="roomMinNum">최소 참가 인원:</label>
                                        <input
                                            type="number"
                                            id="roomMinNum"
                                            name="roomMinNum"
                                            value={formData.roomMinNum}
                                            onChange={handleInputChange}
                                            min="2"
                                            max= {formData.roomMaxNum}
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('roomMinNum')}
                                        disabled={updateStatus.roomMinNum.loading}
                                    >
                                        {updateStatus.roomMinNum.loading ? '업데이트 중...' : '최소 인원 업데이트'}
                                    </button>
                                    {updateStatus.roomMinNum.error && <div className="error-message">{updateStatus.roomMinNum.error}</div>}
                                    {updateStatus.roomMinNum.success && <div className="success-message">{updateStatus.roomMinNum.success}</div>}
                                </div>

                                
                                
                                {/* 방 참가 포인트 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>방 참가 포인트 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="roomEnterPoint">방 참가 포인트:</label>
                                        <input
                                            type="number"
                                            id="roomEnterPoint"
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
                                    >
                                        {updateStatus.roomEnterPoint.loading ? '업데이트 중...' : '참가 포인트 업데이트'}
                                    </button>
                                    {updateStatus.roomEnterPoint.error && <div className="error-message">{updateStatus.roomEnterPoint.error}</div>}
                                    {updateStatus.roomEnterPoint.success && <div className="success-message">{updateStatus.roomEnterPoint.success}</div>}
                                </div>

                                {/* 방 참가 비율 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>방 참가 비율 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="roomEnterRate">방 참가 비율 (%):</label>
                                        <input
                                            type="number"
                                            id="roomEnterRate"
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
                                    >
                                        {updateStatus.roomEnterRate.loading ? '업데이트 중...' : '참가 비율 업데이트'}
                                    </button>
                                    {updateStatus.roomEnterRate.error && <div className="error-message">{updateStatus.roomEnterRate.error}</div>}
                                    {updateStatus.roomEnterRate.success && <div className="success-message">{updateStatus.roomEnterRate.success}</div>}
                                </div>

                                {/* 평가 유형 수정 섹션 */}
                                <div className="manage-section">
                                    <h3>평가 유형 수정</h3>
                                    <div className="form-group">
                                        <label htmlFor="evaluationType">평가 유형:</label>
                                        <select
                                            id="evaluationType"
                                            name="evaluationType"
                                            value={formData.evaluationType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {/* 실제 평가 유형으로 대체 */}
                                            <option value="">평가 유형 선택</option>
                                            <option value="방장">방장</option>
                                            <option value="유저">유저</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => handleSectionUpdate('evaluationType')}
                                        disabled={updateStatus.evaluationType.loading}
                                    >
                                        {updateStatus.evaluationType.loading ? '업데이트 중...' : '평가 유형 업데이트'}
                                    </button>
                                    {updateStatus.evaluationType.error && <div className="error-message">{updateStatus.evaluationType.error}</div>}
                                    {updateStatus.evaluationType.success && <div className="success-message">{updateStatus.evaluationType.success}</div>}
                                </div>
                            </div>
                            <button type="button" onClick={closeModal} className="close-modal-button">
                                닫기
                            </button>
                        </div>
                    </Modal>

                    {/* 방 나가기 확인 모달 */}
                    <Modal
                        isOpen={isExitModalOpen}
                        onRequestClose={closeExitModal}
                        contentLabel="방 나가기 확인 모달"
                        className="custom-modal"
                        overlayClassName="custom-overlay"
                    >
                        <div className="modal-content">
                            <p>{exitModalMessage}</p>
                            <div className="modal-buttons">
                                {exitModalType === 'delete' ? (
                                    <>
                                        <button onClick={handleExitConfirm} aria-label="방 삭제 확인">삭제</button>
                                        <button onClick={closeExitModal} aria-label="방 삭제 취소">취소</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={handleExitConfirm} aria-label="방 나가기 확인">확인</button>
                                        <button onClick={closeExitModal} aria-label="방 나가기 취소">취소</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Modal>

                    {/* 푸터 버튼 */}
                    {isExitButtonVisible && (
                    <div className="yc_challenge_footer-buttons">
                        <button className="yc_challenge_report-btn" title="신고" aria-label="신고">
                            신고
                        </button>
                        <div className={isExitDisabled ? 'disabled-link' : ''}>
                            <button 
                                className="yc_challenge_exit-btn" 
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
