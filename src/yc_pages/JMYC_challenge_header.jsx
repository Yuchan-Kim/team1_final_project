// JMYCChallengeHeader.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

import '../yc_assets/yc_css/jmyc_challenge_header.css'; 

import { FaExclamationCircle } from 'react-icons/fa'; // 느낌표 아이콘

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';

// 남은 시간 계산 함수 (밀리초 단위)
const calculateTimeDifference = (endDate) => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return 0; // Invalid Date 처리
    return end - now;
}

// 시간 포맷팅 함수
const formatTimeLeft = (difference) => {
    if (difference <= 0) return "종료됨";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const JMYCChallengeHeader = () => {
    const navigate = useNavigate();
    const { roomNum } = useParams();
    const token = localStorage.getItem('token');

    // ----------------------
    // 상태 관리
    // ----------------------
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [roomData, setRoomData] = useState({
        roomTitle: "",
        roomStartDate: null,
        roomTypeName: "",
        categoryName: "",
        roomKeyword: "",
        regionName: "",
        roomStatusNum: 1,
        periodType: 0,
    });

    const [timeLeft, setTimeLeft] = useState("");
    const [userAuthorization, setUserAuthorization] = useState(0);

    const [showPointInfo, setShowPointInfo] = useState(false);

    // 모달 상태
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showStartRecruitModal, setShowStartRecruitModal] = useState(false);
    const [showStartChallengeModal, setShowStartChallengeModal] = useState(false);
    const [showExtendCalendar, setShowExtendCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showExtendConfirmModal, setShowExtendConfirmModal] = useState(false);
    // 추가된 모달 상태
    const [showExtendTimeModal, setShowExtendTimeModal] = useState(false);
    const [showStartChallengePromptModal, setShowStartChallengePromptModal] = useState(false);
    const [showChallengeStartedModal, setShowChallengeStartedModal] = useState(false);
    const [showChallengeEndModal, setShowChallengeEndModal] = useState(false);
    const [hasShownChallengeStartedModal, setHasShownChallengeStartedModal] = useState(false);

    // ----------------------
    // 날씨 관련 상태 변수 추가
    // ----------------------
    const [weatherData, setWeatherData] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // ----------------------
    // 날씨 데이터 가져오기 함수
    // ----------------------
    const fetchWeatherData = async (latitude, longitude) => {
        try {
            const API_KEY = "d34033ce5a7c862984974f178d1598ca"; // 실제 API 키 사용 권장
    
            console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`);
            
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather`,
                {
                    params: {
                        lat: latitude,
                        lon: longitude,
                        appid: API_KEY,
                        units: 'metric',
                        lang: 'kr'
                    }
                }
            );
    
            console.log('Weather API Response:', response.data);
            setWeatherData(response.data);
        } catch (error) {
            console.error("날씨 정보를 가져오는 중 오류 발생:", error);
        }
    };
    

    // 위치 정보 가져오기 함수
    const getUserLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(latitude, longitude);
                },
                (error) => {
                    console.error("위치 정보를 가져오는 중 오류 발생:", error);
                    setLocationError(error);
                    // 기본 위치로 설정 (서울)
                    fetchWeatherData(37.5665, 126.9780); // 서울의 위도와 경도
                }
            );
        } else {
            console.error("Geolocation을 지원하지 않는 브라우저입니다.");
            setLocationError(new Error("Geolocation not supported"));
            // 기본 위치로 설정 (서울)
            fetchWeatherData(37.5665, 126.9780); // 서울의 위도와 경도
        }
    };

    // 타이머 참조
    const timerRef = useRef(null);

    // ----------------------
    // 모달 스타일
    // ----------------------
    const customModalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            padding: '20px',
            borderRadius: '8px',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1200,
        },
    };

    // ----------------------
    // 헬퍼 함수
    // ----------------------

    // 내일 날짜 계산 함수
    const getTomorrow = () => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // 시간 초기화
        return tomorrow;
    };

    // ----------------------
    // 이벤트 핸들러
    // ----------------------

    // ------ 참가 핸들러 ------
    const handleJoinClick = () => {
        if (token != null){
            setShowJoinModal(true);
        } else {
            navigate("/user/loginform");
        }
    };

    const handleConfirmJoin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/challenge/join/${roomNum}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                setUserAuthorization(2); // 참가한 상태로 설정
                setShowJoinModal(false);
                getRoomHeaderInfo();

                alert('참가가 성공적으로 완료되었습니다.');
                // 추가: 챌린지가 시작되었을 때 모달 표시
                if (roomData.roomStatusNum === 3 && (userAuthorization === 1 || userAuthorization === 2) && !hasShownChallengeStartedModal) {
                    setShowChallengeStartedModal(true);
                    setHasShownChallengeStartedModal(true);
                }
            } else {
                alert(`참가 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('참가 중 오류 발생:', error);
            alert('참가 중 오류가 발생했습니다.');
        }
    };

    const handleCancelJoin = () => {
        setShowJoinModal(false);
    };

    // ------ 모집 시작 핸들러 ------
    const handleStartRecruitClick = () => {
        setShowStartRecruitModal(true);
    };

    const handleConfirmStartRecruit = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/start-recruit/${roomNum}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                setRoomData(prevData => ({ ...prevData, roomStatusNum: 2 }));
                setShowStartRecruitModal(false);
                getRoomHeaderInfo();

                alert('모집이 성공적으로 시작되었습니다.');
            } else {
                alert(`모집 시작 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('모집 시작 중 오류 발생:', error);
            alert('모집 시작 중 오류가 발생했습니다.');
        }
    };

    const handleCancelStartRecruit = () => {
        setShowStartRecruitModal(false);
    };

    // ------ 챌린지 시작 핸들러 ------
    const handleStartChallengeClick = () => {
        setShowStartChallengeModal(true);
    };

    const handleConfirmStartChallenge = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/start-challenge/${roomNum}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                // 서버에서 받은 roomStartDate 사용
                const newRoomStartDate = response.data.apiData.roomStartDate ? new Date(response.data.apiData.roomStartDate) : null;
                setRoomData(prevData => ({
                    ...prevData,
                    roomStatusNum: 3,
                    roomStartDate: newRoomStartDate
                }));
                setShowStartChallengeModal(false);
                alert('챌린지가 성공적으로 시작되었습니다.');

                // 최신 데이터 다시 가져오기
                await getRoomHeaderInfo();

                // 챌린지가 시작되었음을 사용자에게 알림
                if ((userAuthorization === 1 || userAuthorization === 2) && !hasShownChallengeStartedModal) {
                    setShowChallengeStartedModal(true);
                    setHasShownChallengeStartedModal(true);
                }
            } else {
                alert(`챌린지 시작 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('챌린지 시작 중 오류 발생:', error);
            alert('챌린지 시작 중 오류가 발생했습니다.');
        }
    };

    const handleCancelStartChallenge = () => {
        setShowStartChallengeModal(false);
    };

    // ------ 챌린지 종료 핸들러 ------
    const handleEndChallengeClick = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/end-challenge/${roomNum}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                setRoomData(prevData => ({ ...prevData, roomStatusNum: 4 }));
                setShowChallengeEndModal(false);
                getRoomHeaderInfo();

                alert('챌린지가 성공적으로 종료되었습니다.');
                // 추가: 챌린지가 완전히 종료되었으므로 필요한 후속 조치
            } else {
                alert(`챌린지 종료 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('챌린지 종료 중 오류 발생:', error);
            alert('챌린지 종료 중 오류가 발생했습니다.');
        }
    };

    const handleCancelEndChallenge = () => {
        setShowChallengeEndModal(false);
    };


    // ------ 연장 버튼 핸들러 ------
    const handleExtendClick = () => {
        setShowExtendCalendar(true);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleCalendarConfirm = () => {
        if (!selectedDate) {
            alert('날짜와 시간을 선택해주세요.');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간 초기화

        if (selectedDate <= today) {
            alert('오늘 이후의 날짜를 선택해주세요.');
            return;
        }

        setShowExtendCalendar(false);
        setShowExtendConfirmModal(true);
    };

    const handleConfirmExtend = async () => {
        if (!selectedDate) return;

        try {
            // ISO 형식 유지
            const updatedStartDate = selectedDate.toISOString().slice(0, 19).replace('T', ' ');

            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/header/${roomNum}`, {
                roomStartDate: updatedStartDate
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                const newRoomStartDate = response.data.apiData.roomStartDate ? new Date(response.data.apiData.roomStartDate) : null; // 서버에서 받은 roomStartDate 사용
                setRoomData(prevData => ({
                    ...prevData,
                    roomStartDate: newRoomStartDate,
                    roomStatusNum: 1 // 상태 초기화
                }));
                setTimeLeft(formatTimeLeft(calculateTimeDifference(newRoomStartDate)));
                getRoomHeaderInfo();
                alert('시작 시간이 성공적으로 업데이트되었습니다.');
            } else {
                alert(`시작 시간 업데이트 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('시작 시간 업데이트 중 오류 발생:', error);
            alert('시작 시간 업데이트 중 오류가 발생했습니다.');
        }

        setShowExtendConfirmModal(false);
    };

    const handleCancelExtend = () => {
        setShowExtendConfirmModal(false);
    };

    // ------ 포인트 지급 안내 토글 ------
    const togglePointInfo = () => {
        setShowPointInfo(!showPointInfo);
    };

    // ----------------------
    // 데이터 가져오기 함수
    // ----------------------
    const getRoomHeaderInfo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/header/${roomNum}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                const data = response.data.apiData;
                setRoomData({
                    roomTitle: data.roomTitle,
                    roomStartDate: data.roomStartDate ? new Date(data.roomStartDate) : null, // null 유지
                    roomTypeName: data.roomTypeName,
                    categoryName: data.categoryName,
                    roomKeyword: data.roomKeyword,
                    regionName: data.regionName,
                    roomStatusNum: data.roomStatusNum,
                    periodType: data.periodType,
                });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('데이터를 불러오는 중 오류 발생:', error);
            setError("데이터를 불러오는 데 실패했습니다.");
        }
    }

    // 사용자 인증 상태 조회 함수
    const checkUser = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                const userAuth = response.data.apiData; // enteredUserAuth 값 (0, 1, 2)
                setUserAuthorization(userAuth);

                // roomStatusNum이 1이고 시간이 만료된 경우, 호스트에게 연장 모달 표시
                if (roomData.roomStatusNum === 1 && calculateTimeDifference(roomData.roomStartDate) <= 0 && userAuth === 1) {
                    setShowExtendTimeModal(true);
                }

                // roomStatusNum이 2이고 시간이 만료된 경우, 호스트에게 챌린지 시작 촉구 모달 표시
                if (roomData.roomStatusNum === 2 && calculateTimeDifference(roomData.roomStartDate) <= 0 && userAuth === 1) {
                    setShowStartChallengePromptModal(true);
                }

                // roomStatusNum이 3이고 챌린지가 시작되었을 때, userAuthorization이 1 또는 2인 사용자에게 한 번만 알림
                if (roomData.roomStatusNum === 3 && (userAuth === 1 || userAuth === 2) && !hasShownChallengeStartedModal) {
                    setShowChallengeStartedModal(true);
                    setHasShownChallengeStartedModal(true);
                }

                // roomStatusNum이 3이고 시간이 만료된 경우, 호스트에게 챌린지 종료 촉구 모달 표시
                if (roomData.roomStatusNum === 3 && roomData.roomStartDate) {
                    const endDate = new Date(roomData.roomStartDate.getTime() + roomData.periodType * 24 * 60 * 60 * 1000);
                    if (calculateTimeDifference(endDate) <= 0 && userAuth === 1) {
                        setShowChallengeEndModal(true);
                    }
                }

            } else {
                setUserAuthorization(0);
            }
        } catch (error) {
            console.error('사용자 인증 중 오류 발생:', error);
            setUserAuthorization(0);
        }
    }

    // ----------------------
    // 남은 시간 실시간 업데이트 및 조건 검사
    // ----------------------
    useEffect(() => {
        // 기존 타이머 클리어
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const updateTimer = () => {
            let difference = 0;
            if (roomData.roomStatusNum === 3 && roomData.roomStartDate) { // 챌린지 진행 중
                const endDate = new Date(roomData.roomStartDate.getTime() + roomData.periodType * 24 * 60 * 60 * 1000);
                difference = calculateTimeDifference(endDate);
            } else if (roomData.roomStartDate) { // 챌린지 시작 전
                difference = calculateTimeDifference(roomData.roomStartDate);
            } else { // roomStartDate가 null인 경우
                difference = 0;
            }

            if (difference <= 0) {
                setTimeLeft("종료됨");
                clearInterval(timerRef.current);
            } else {
                setTimeLeft(formatTimeLeft(difference));
            }
        };

        // 타이머 설정
        timerRef.current = setInterval(updateTimer, 1000);
        // 초기 실행
        updateTimer();

        return () => clearInterval(timerRef.current);
    }, [roomData.roomStartDate, roomData.roomStatusNum, roomData.periodType]);

    // ----------------------
    // 데이터 가져오기 및 사용자 인증 확인
    // ----------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getRoomHeaderInfo();
                await checkUser();
                getUserLocation(); // 위치 정보 가져오기

            } catch (error) {
                setError("데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [roomNum]);

    // 남은 시간이 6시간이 되었을 때 실행되는 함수
    const handleSixHoursLeft = async () => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/challenge/delete-room/${roomNum}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                alert('남은 인원이 최소 인원 미만이어서 챌린지가 삭제되었습니다.');
                navigate('/'); // 홈으로 이동
            } else {
                alert(`챌린지 삭제 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('챌린지 삭제 중 오류 발생:', error);
            alert('챌린지 삭제 중 오류가 발생했습니다.');
        }
    };

    // 카운트다운이 끝났을 때 실행되는 함수
    const handleCountdownEnd = async () => {
        if (roomData.roomStatusNum === 2 && userAuthorization > 0) {
            try {
                const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/end-challenge/${roomNum}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.result === 'success') {
                    setRoomData(prevData => ({ ...prevData, roomStatusNum: 3 }));
                    alert('챌린지가 종료되었습니다.');
                    // 최신 데이터 다시 가져오기
                    await getRoomHeaderInfo();
                } else {
                    alert(`챌린지 종료 실패: ${response.data.message}`);
                }
            } catch (error) {
                console.error('챌린지 종료 중 오류 발생:', error);
                alert('챌린지 종료 중 오류가 발생했습니다.');
            }
        }
    };

    // periodType 카운트다운이 끝났을 때 실행되는 함수
    const handlePeriodCountdownEnd = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/challenge/complete-period/${roomNum}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.result === 'success') {
                setRoomData(prevData => ({ ...prevData, roomStatusNum: 4 }));
                alert('챌린지가 완전히 종료되었습니다.');
            } else {
                alert(`챌린지 완전 종료 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('챌린지 완전 종료 중 오류 발생:', error);
            alert('챌린지 완전 종료 중 오류가 발생했습니다.');
        }
    };

    // ----------------------
    // 렌더링
    // ----------------------
    return (
        <div className="jm-challenge-header">
            {/* 로딩 및 에러 상태 처리 */}
            {loading ? (
                <div>로딩 중...</div>
            ) : error ? (
                <div>오류: {error}</div>
            ) : (
                <>
                    {/* Room Header */}
                    <div className="jm-room-header">
                        {/* 날씨 정보 표시 */}
                        {weatherData && (
                            <div className="yc-weather-info">
                                <p>현재 위치: {weatherData.name}</p>
                                <p>온도: {weatherData.main.temp}°C</p>
                                <p>날씨: {weatherData.weather[0].description}</p>
                                <img
                                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                    alt="날씨 아이콘"
                                />
                            </div>
                        )}

                        {/* 위치 정보 오류 처리 */}
                        {locationError && (
                            <div className="location-error">
                                위치 정보를 가져오는 데 실패했습니다. 기본 위치의 날씨 정보를 표시합니다.
                            </div>
                        )}
                        {/* 제목과 시간을 감싸는 컨테이너 */}
                        <div className="yc-header-info">
                            <h1 className="jm-c-title">{roomData.roomTitle}</h1>
                            {roomData.roomStartDate ? (
                                roomData.roomStatusNum < 3 ? (
                                    <p className="jm-c-time">
                                        {roomData.roomStatusNum === 1 ? "시작까지: " : "종료까지: "} {timeLeft}
                                        {userAuthorization === 1 && (
                                            <button 
                                                className="extend-button" 
                                                onClick={handleExtendClick}
                                                disabled={
                                                    roomData.roomStartDate &&
                                                    (
                                                        roomData.roomStatusNum === 3
                                                            ? calculateTimeDifference(new Date(roomData.roomStartDate.getTime() + roomData.periodType * 24 * 60 * 60 * 1000)) <= 0
                                                            : calculateTimeDifference(roomData.roomStartDate) <= 0
                                                    )
                                                }
                                                title={
                                                    roomData.roomStartDate &&
                                                    (
                                                        roomData.roomStatusNum === 3
                                                            ? calculateTimeDifference(new Date(roomData.roomStartDate.getTime()+ roomData.periodType * 24 * 60 * 60 * 1000)) <= 0
                                                            : calculateTimeDifference(roomData.roomStartDate) <= 0
                                                    )
                                                        ? "남은 시간이 없어 연장할 수 없습니다."
                                                        : "연장"
                                                }
                                            >
                                                연장
                                            </button>
                                        )}
                                    </p>
                                ) : (
                                    <p className="jm-c-time">종료까지: {timeLeft}</p>
                                )
                            ) : (
                                <p className="jm-c-time">종료됨</p>
                            )}
                        </div>

                        

                        
                       {/* 버튼 영역 */}
                        {userAuthorization === 1 ? ( // 방장인 경우
                            roomData.roomStatusNum === 1 ? ( // roomStatusNum이 1일 때 모집 시작 버튼
                                <button 
                                    className="jm-c-start host" 
                                    onClick={handleStartRecruitClick}
                                    disabled={
                                        roomData.roomStartDate &&
                                        (
                                            roomData.roomStatusNum === 3
                                                ? calculateTimeDifference(new Date(roomData.roomStartDate.getTime() + roomData.periodType * 24 * 60 * 60 * 1000)) <= 0
                                                : calculateTimeDifference(roomData.roomStartDate) <= 0
                                        )
                                    }
                                    title={
                                        roomData.roomStartDate &&
                                        (
                                            roomData.roomStatusNum === 3
                                                ? calculateTimeDifference(new Date(roomData.roomStartDate.getTime() + roomData.periodType * 24 * 60 * 60 * 1000)) <= 0
                                                : calculateTimeDifference(roomData.roomStartDate) <= 0
                                        )
                                            ? "남은 시간이 없어 모집을 시작할 수 없습니다."
                                            : "모집 시작"
                                    }
                                >
                                    <span className="emoji"></span>
                                    <span className="label">모집 시작</span>
                                </button>
                            ) : roomData.roomStatusNum === 2 ? ( // roomStatusNum이 2일 때 챌린지 시작 버튼
                                <button 
                                    className="jm-c-start host" 
                                    onClick={handleStartChallengeClick}
                                    disabled={
                                        roomData.roomStartDate &&
                                        (
                                            roomData.roomStatusNum === 3
                                                ? calculateTimeDifference(new Date(roomData.roomStartDate.getTime() + roomData.periodType * 24 * 60 * 60 * 1000)) <= 0
                                                : calculateTimeDifference(roomData.roomStartDate) <= 0
                                        )
                                    }
                                    title={
                                        roomData.roomStartDate &&
                                        (
                                            roomData.roomStatusNum === 3
                                                ? calculateTimeDifference(new Date(roomData.roomStartDate.getTime() + roomData.periodType * 24 * 60 * 60 * 1000)) <= 0
                                                : calculateTimeDifference(roomData.roomStartDate) <= 0
                                        )
                                            ? "남은 시간이 없어 챌린지를 시작할 수 없습니다."
                                            : "챌린지 시작"
                                    }
                                >
                                    <span className="emoji"></span>
                                    <span className="label">챌린지 시작</span>
                                </button>
                            )  : null // roomStatusNum이 4 이상일 때 버튼 숨김
                        ) : (
                            userAuthorization === 0 && roomData.roomStatusNum === 2 && roomData.roomStartDate && ( // 일반 사용자가 아직 참여하지 않았고 roomStatusNum이 3 미만일 때
                                <button className="jm-c-start" onClick={handleJoinClick}>
                                    <span className="emoji"></span>
                                    <span className="label">+ 참가</span>
                                </button>
                            )
                        )}

                    </div>

                    {/* Room Header Bottom Section */}
                    <div className='jm-room-header-bottom'>
                        {/* Tags */}
                        <div className="jm-tags">
                            <span className="jm-tag-box">#{roomData.roomTypeName}</span>
                            <span className="jm-tag-box">#{roomData.categoryName}</span>
                            <span className="jm-tag-box">#{roomData.roomKeyword}</span>
                            <span className="jm-tag-box">#{roomData.regionName}</span>
                        </div>

                        {/* 포인트 지급 안내 버튼 */}
                        <div>
                            <button className="jm-hd-point-info-btn" onClick={togglePointInfo}>
                                <p>포인트 지급 안내</p>
                                <FaExclamationCircle className="jm-info-icon" />
                            </button>

                            {/* 포인트 지급 정보 */}
                            {showPointInfo && (
                                <div className="jm-challenge-point-info">
                                    <h2>포인트 지급</h2>
                                    <div className="jm-challenge-point">
                                        <p>
                                            <span>내 달성율 100% 배팅포인트의 120% 지급</span>
                                        </p>
                                        <p>
                                            <span>내 달성율 85% 이상 배팅포인트의 100% 지급</span>
                                        </p>
                                        <p>
                                            <span>내 달성율 85% 미만 배팅포인트 %삭감</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 모달들 */}
                    {/* 참가 확인 모달 */}
                    <Modal
                        isOpen={showJoinModal}
                        onRequestClose={handleCancelJoin}
                        style={customModalStyles}
                        contentLabel="참여 모달"
                        ariaHideApp={false}
                    >
                        <div className="yc-modal-header">
                            <p>참여 하시겠습니까?</p>
                            <div className="yc-modal-buttons-header">
                                <button className="yc-modal-confirm-header" onClick={handleConfirmJoin}>확인</button>
                                <button className="yc-modal-cancel-header" onClick={handleCancelJoin}>취소</button>
                            </div>
                        </div>
                    </Modal>

                    {/* 모집 시작 확인 모달 */}
                    <Modal
                        isOpen={showStartRecruitModal}
                        onRequestClose={handleCancelStartRecruit}
                        style={customModalStyles}
                        contentLabel="모집 시작 모달"
                        ariaHideApp={false}
                    >
                        <div className="yc-modal-header">
                            <p>맴버 모집을 시작 하시겠습니까?</p>
                            <div className="yc-modal-buttons-header">
                                <button className="yc-modal-confirm-header" onClick={handleConfirmStartRecruit}>확인</button>
                                <button className="yc-modal-cancel-header" onClick={handleCancelStartRecruit}>취소</button>
                            </div>
                        </div>
                    </Modal>

                    {/* 챌린지 시작 확인 모달 */}
                    <Modal
                        isOpen={showStartChallengeModal}
                        onRequestClose={handleCancelStartChallenge}
                        style={customModalStyles}
                        contentLabel="챌린지 시작 모달"
                        ariaHideApp={false}
                    >
                        <div className="yc-modal-header">
                            <p>챌린지를 시작하시겠습니까?</p>
                            <div className="yc-modal-buttons-header">
                                <button className="yc-modal-confirm-header" onClick={handleConfirmStartChallenge}>확인</button>
                                <button className="yc-modal-cancel-header" onClick={handleCancelStartChallenge}>취소</button>
                            </div>
                        </div>
                    </Modal>

                    {/* 시작 시간 연장 캘린더 모달 */}
                    <Modal
                        isOpen={showExtendCalendar}
                        onRequestClose={() => setShowExtendCalendar(false)}
                        style={customModalStyles}
                        contentLabel="시작 시간 연장 모달"
                        ariaHideApp={false}
                    >
                        <div className="yc-modal-header-date">
                            <p>새로운 시작 시간을 선택하세요:</p>
                            <DatePicker 
                                selected={selectedDate}
                                onChange={handleDateChange}
                                showTimeSelect
                                timeIntervals={15}
                                dateFormat="yyyy-MM-dd HH:mm"
                                inline
                                minDate={getTomorrow()} // 내일 날짜부터 선택 가능
                            />
                            <div className="yc-modal-buttons-header">
                                <button className="yc-modal-confirm-header" onClick={handleCalendarConfirm}>확인</button>
                                <button className="yc-modal-cancel-header" onClick={() => setShowExtendCalendar(false)}>취소</button>
                            </div>
                        </div>
                    </Modal>

                    {/* 시작 시간 변경 확인 모달 */}
                    <Modal
                        isOpen={showExtendConfirmModal}
                        onRequestClose={handleCancelExtend}
                        style={customModalStyles}
                        contentLabel="시작 시간 변경 확인 모달"
                        ariaHideApp={false}
                    >
                        <div className="yc-modal-header">
                            <p>선택한 날짜로 시작 시간을 변경하시겠습니까?</p>
                            <div className="yc-modal-buttons-header">
                                <button className="yc-modal-confirm-header" onClick={handleConfirmExtend}>확인</button>
                                <button className="yc-modal-cancel-header" onClick={handleCancelExtend}>취소</button>
                            </div>
                        </div>
                    </Modal>

                    {/* 챌린지 종료 확인 모달 */}
                    <Modal
                        isOpen={showChallengeEndModal}
                        onRequestClose={handleCancelEndChallenge}
                        style={customModalStyles}
                        contentLabel="챌린지 종료 모달"
                        ariaHideApp={false}
                    >
                        <div className="yc-modal-header">
                            <p>챌린지가 종료되었습니다! 챌린지 종료 버튼을 눌러주세요.</p>
                            <div className="yc-modal-buttons-header">
                                <button className="yc-modal-confirm-header" onClick={handleEndChallengeClick}>챌린지 종료</button>
                                <button className="yc-modal-cancel-header" onClick={handleCancelEndChallenge}>취소</button>
                            </div>
                        </div>
                    </Modal>

                    {/* 챌린지 시작 알림 모달 */}
                    <Modal
                        isOpen={showChallengeStartedModal}
                        onRequestClose={() => setShowChallengeStartedModal(false)}
                        style={customModalStyles}
                        contentLabel="챌린지 시작 알림 모달"
                        ariaHideApp={false}
                    >
                        <div className="yc-modal-header">
                            <p>챌린지가 시작되었습니다!</p>
                            <div className="yc-modal-buttons-header">
                                <button className="yc-modal-confirm-header" onClick={() => setShowChallengeStartedModal(false)}>확인</button>
                            </div>
                        </div>
                    </Modal>

                </>
            )}
        </div>
    );

};

export default JMYCChallengeHeader;
