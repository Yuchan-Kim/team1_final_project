import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import axios from 'axios';
import TopHeader from "../include/DH_Header.jsx";
import Footert from "../include/JM-Footer.jsx";
import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";
import DatePicker from "react-datepicker"; // 캘린더 라이브러리
import "react-datepicker/dist/react-datepicker.css"; // 캘린더 스타일

import '../css/Missioninfo.css';
import '../css/Footer.css';

import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";

const Missioninfo = () => {
    const token = localStorage.getItem('token'); 
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser'))); 
    const currentUserNum = authUser?.userNum || null; 
    const [currentImgIndexes, setCurrentImgIndexes] = useState({}); // 모든 항목에 대한 이미지 인덱스 상태
    const [modalImgIndex, setModalImgIndex] = useState(0); // 모달창 이미지 인덱스
    const [order, setOrder] = useState('DESC'); // 필터 최신순 기본값 설정
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);
    const [userList, setUserList] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [selectedUserNum, setSelectedUserNum] = useState(""); // 선택된 유저 Num 상태
    const [selectedEvalType, setSelectedEvalType] = useState(""); // 선택된 평가 상태
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜

    // 이미지 이전 버튼 (리스트)
    const handlePrevImage = (evalNum, imgCount) => {
        setCurrentImgIndexes((prevIndexes) => ({
            ...prevIndexes,
            [evalNum]: (prevIndexes[evalNum] > 0 ? prevIndexes[evalNum] : imgCount) - 1
        }));
    };

    // 이미지 다음 버튼 (리스트)
    const handleNextImage = (evalNum, imgCount) => {
        setCurrentImgIndexes((prevIndexes) => ({
            ...prevIndexes,
            [evalNum]: (prevIndexes[evalNum] + 1) % imgCount
        }));
    };

    // 이미지 이전 버튼 (모달)
    const handleModalPrevImage = (imgCount) => {
        setModalImgIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : imgCount - 1));
    };

    // 이미지 다음 버튼 (모달)
    const handleModalNextImage = (imgCount) => {
        setModalImgIndex((prevIndex) => (prevIndex + 1) % imgCount);
    };

    const handleOpenModal = (mission) => {
        setSelectedMission(mission);
        setModalImgIndex(0); // 모달창을 열 때 이미지 인덱스를 초기화
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMission(null);
    };

    // 참가자 리스트 가져오기
    const getUserList = () => {
        axios.get("http://localhost:9000/api/roomMain")
            .then(response => {
                const { userList } = response.data.apiData;
                setUserList(userList || []);
            })
            .catch(error => {
                console.log("Failed to fetch user list:", error);
            });
    };

    // 필터 최신순 오래된순 함수 수정
    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        console.log("Selected order value:", selectedValue); // 선택한 값 확인
        setOrder(event.target.value); // order만 변경, useEffect에서 호출
        getHistoryList(selectedValue); // 선택된 정렬 순서로 히스토리 리스트 가져오기
    };

    useEffect(() => {
        getHistoryList(order); // order 값이 변경될 때마다 호출
    }, [order]);

    // 미션 히스토리 리스트 가져오기 수정
    const getHistoryList = (sortOrder = order) => {
        console.log("Fetching history list with order:", sortOrder); // 호출 시점과 전달된 값 확인
        axios.get("http://localhost:9000/api/historyList", {
            params: {
                order: sortOrder, // 선택된 정렬 순서를 서버로 전달
            }
        })
            .then(response => {
                console.log("Fetched history list:", response.data.apiData);
                setHistoryList(response.data.apiData || []);
                console.log("Selected order:", sortOrder);
            })
            .catch(error => {
                console.error("Failed to fetch mission history:", error);
            });
    };

    // 평가 업데이트 요청
    const handleEvalUpdate = (evalNum, evalType) => {
        axios.post('http://localhost:9000/api/updateEvaluation', null, {
            params: {
                evalNum: evalNum,
                evalType: evalType
            }
        })
        .then(response => {
            console.log(response.data); // 성공 메시지 출력
            alert('Evaluation updated successfully.');
            handleCloseModal(); // 모달 창 닫기
            window.location.reload(); // 화면 새로고침
        })
        .catch(error => {
            console.error('Failed to update evaluation:', error);
            alert('Failed to update evaluation.');
        });
    };

    useEffect(() => {
        getUserList();
        getHistoryList();
    }, []);

    

    // 필터링된 히스토리 리스트
const filteredHistories = useMemo(() => {
    return historyList.filter(history => {
        const userFilter = selectedUserNum ? history.userNum === parseInt(selectedUserNum, 10) : true;
        const evalTypeFilter = selectedEvalType ? history.evalType === selectedEvalType : true;
        const dateFilter = selectedDate
            ? new Date(history.submitDate).setHours(0, 0, 0, 0) === selectedDate.setHours(0, 0, 0, 0)
            : true;

        return userFilter && evalTypeFilter && dateFilter;
    });
}, [historyList, selectedUserNum, selectedEvalType, selectedDate]);

    // 그룹화 및 정렬된 히스토리 리스트
    const groupedHistories = useMemo(() => {
    // 날짜 기준으로 먼저 정렬
    const sortedHistories = filteredHistories.sort((a, b) => {
        const dateA = new Date(a.submitDate);
        const dateB = new Date(b.submitDate);
        return order === 'DESC' ? dateB - dateA : dateA - dateB;
    });

    // 유저 기준 그룹화
    const grouped = sortedHistories.reduce((acc, history) => {
        const userNum = history.userNum;
        if (!acc[userNum]) acc[userNum] = [];
        acc[userNum].push(history);
        return acc;
    }, {});

    return grouped;
}, [filteredHistories, order]);

    
    return (
        <>
            <TopHeader />
            <div className="jm-missioninfo-body">
                <Sidebar />
                <div className="jm-missionsinfo">
                    <Header />
                    <div className='jm-mission-history'>
                        <h2 className='jm-history-tatle'>제출 히스토리</h2>
                        {/* 날짜 선택 필터 */}
                        <div className="jm-datepicker-container">
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="날짜를 선택하세요"
                                isClearable
                            />
                        </div>
                        
                        <div className='jm-option-box'>
                            {/* 유저 필터링 셀렉트 */}
                            <select 
                                className="jm-challenge-select" 
                                value={selectedUserNum} 
                                onChange={(e) => setSelectedUserNum(e.target.value)}
                            >
                                <option value="">전체</option>
                                {userList.map((user, index) => (
                                    <option key={index} value={user.userNum}>
                                        {user.userName}
                                    </option>
                                ))}
                            </select>

                            {/* 평가 상태 필터링 셀렉트 */}
                            <select 
                                className="jm-challenge-select" 
                                value={selectedEvalType} 
                                onChange={(e) => setSelectedEvalType(e.target.value)}
                            >
                                <option value="">전체 평가 상태</option>
                                <option value="승인대기">승인 대기</option>
                                <option value="승인완료">승인 완료</option>
                                <option value="미승인">미승인</option>
                            </select>

                            <select 
                            className="jm-challenge-select"
                            value={order}
                            onChange={handleSelectChange}>
                                <option value="DESC">최신 순</option>
                                <option value="ASC">오래된 순</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* 필터링된 히스토리 출력 */}
                    {Object.entries(groupedHistories)
                        .sort(([, historiesA], [, historiesB]) => {
                            const dateA = new Date(historiesA[0].submitDate);
                            const dateB = new Date(historiesB[0].submitDate);
                            return order === 'DESC' ? dateB - dateA : dateA - dateB;
                        })
                        .map(([userNum, userHistories]) => (
                            <div key={`user-${userNum}`} className="jm-submission-card">
                                <div className="jm-userinfo-container">
                                    {userHistories.length > 0 && (
                                        <>
                                            <span className="jm-day">{userHistories[0].submitDate || '날짜 없음'}</span>
                                            <span className="jm-approval-button">{userHistories[0].evalType || '승인 확인불가'}</span>
                                            <div className="jm-user-profile-container">
                                                <div className="jm-user-profile-img-card">
                                                    <img src="https://via.placeholder.com/100" className="yc_challenge_profile-pic" alt="Profile Pic" />
                                                </div>
                                                <div className="jm-user-profile-name">
                                                    <span className="jm-submission-title">
                                                        {userHistories[0].userName || '이름 없음'}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="jm-task-list">
                                        {userHistories.map((history, index) => {
                                            const imgNames = history.evalImgName ? history.evalImgName.split(',') : [];
                                            const currentImgIndex = currentImgIndexes[history.evalNum] || 0;

                                            return (
                                                <div key={`history-${history.evalNum}-${index}`} className="jm-task-card">
                                                    <span className="jm-task-title">{history.missionName}</span>

                                                    {history.evalType === "승인대기" && history.userNum !== currentUserNum ? (
                                                        <button className="jm-btn-primary" onClick={() => handleOpenModal(history)}>
                                                            승인대기
                                                        </button>
                                                    ) : (
                                                        <button className="jm-btn-primary" onClick={() => handleOpenModal(history)}>
                                                            더보기
                                                        </button>
                                                    )}

                                                    {imgNames.length > 0 && (
                                                        <div className="jm-task-images">
                                                            <div className="jm-image-container">
                                                                <img
                                                                    key={`img-${currentImgIndex}`}
                                                                    className="jm-task-img"
                                                                    src={`http://localhost:9000/upload/${imgNames[currentImgIndex].trim()}`}
                                                                    alt={`제출된 이미지 ${currentImgIndex + 1}`}
                                                                />
                                                                {imgNames.length > 1 && (
                                                                    <div className="jm-slider-buttons">
                                                                        <button
                                                                            className="jm-slider-btn prev"
                                                                            onClick={() => handlePrevImage(history.evalNum, imgNames.length)}
                                                                        >
                                                                            ◀
                                                                        </button>
                                                                        <button
                                                                            className="jm-slider-btn next"
                                                                            onClick={() => handleNextImage(history.evalNum, imgNames.length)}
                                                                        >
                                                                            ▶
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="jm-task-comment-container">
                                                        <p className="jm-task-comment">{history.submitComment}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}



                    {/* Modal 컨테이너 */}
            {isModalOpen && selectedMission && (
                <div className="jm-info-modal-overlay">
                    <div className="jm-modal-content">
                        <div className='jm-modal-user-profile-container'>
                            <button className="jm-close-button" onClick={handleCloseModal}>
                                &times;
                            </button>
                            <div className="jm-modal-user-profile-img-card">
                                <img src="https://via.placeholder.com/100" className="yc_challenge_profile-pic" alt="Profile Pic" />
                            </div>
                            <div className='jm-modal-user-profile-name'>
                                <span className="jm-modal-submission-title">{selectedMission.userName}</span>
                            </div>
                        </div>
                        <h3 className='jm-modal-mission-tatle'>{selectedMission.missionName}</h3>

                        {/* 이미지 슬라이더 */}
                        <div className="jm-info-modal-img">
                            {selectedMission.evalImgName && (
                                <div className="jm-modal-task-images">
                                    <div className="jm-modal-image-container">
                                        <img
                                            className="jm-modal-task-img"
                                            src={`http://localhost:9000/upload/${selectedMission.evalImgName.split(',')[modalImgIndex].trim()}`}
                                            alt={`이미지 ${modalImgIndex + 1}`}
                                        />
                                        {selectedMission.evalImgName.split(',').length > 1 && (
                                            <div className="jm-modal-slider-buttons">
                                                <button
                                                    className="jm-modal-slider-btn prev"
                                                    onClick={() =>
                                                        handleModalPrevImage(selectedMission.evalImgName.split(',').length)
                                                    }
                                                >
                                                    ◀
                                                </button>
                                                <button
                                                    className="jm-modal-slider-btn next"
                                                    onClick={() =>
                                                        handleModalNextImage(selectedMission.evalImgName.split(',').length)
                                                    }
                                                >
                                                    ▶
                                                </button>
                                                
                                            </div>
                                        )}
                                    </div>
                                    <div className='jm-modal-comment-container'>
                                        <p>{selectedMission.submitComment}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 승인 및 거절 버튼 */}
                        {selectedMission.evalType === '승인대기' && selectedMission.userNum !== currentUserNum && (
                            <div className="jm-info-modal-button">
                                <button
                                    className="jm-info-modal-button-ok"
                                    onClick={() => handleEvalUpdate(selectedMission.evalNum, '승인완료')}
                                >
                                    승인
                                </button>
                                <button
                                    className="jm-info-modal-button-no"
                                    onClick={() => handleEvalUpdate(selectedMission.evalNum, '미승인')}
                                >
                                    거절
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
                    {/* Modal 컨테이너 끝 */}

                </div>
            </div>
            <ChatRoom />
            <Footert />
        </>
    );
};

export default Missioninfo;
