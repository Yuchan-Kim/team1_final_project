    import React, { useEffect, useState } from 'react';
    import {Link, useParams } from 'react-router-dom';
    import { useMemo } from 'react';
    import axios from 'axios';
    import TopHeader from "../include/DH_Header.jsx";
    import Footert from "../include/JM-Footer.jsx";
    import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";
    import DatePicker from "react-datepicker"; // 캘린더 라이브러리
    import { Doughnut, Line, Bar } from "react-chartjs-2"; // Bar 차트 추가

    import "react-datepicker/dist/react-datepicker.css"; // 캘린더 스타일

    import '../css/Missioninfo.css';
    import '../css/Footer.css';

    import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
    import Header from "../../yc_pages/JMYC_challenge_header.jsx";

    import {
        Chart as ChartJS,
        ArcElement,
        Tooltip,
        Legend,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Filler,
      } from "chart.js";
      
      // Chart.js 컴포넌트 등록
      ChartJS.register(
        ArcElement, 
        Tooltip, 
        Legend,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        BarElement,
        Title,
        Filler
      );
    const Missioninfo = () => {
        const {roomNum} = useParams();
        const token = localStorage.getItem('token'); 
        const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser'))); 
        const [userAuth, setUserAuth] = useState(null); // 유저 권한 저장
        const [roomEvalType, setRoomEvalType] = useState(null); // 방 평가타입 저장
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

        const [missionApprovals, setMissionApprovals] = useState([]); // 미션 승인 횟수 통계
        const [missionAchievements, setMissionAchievements] = useState([]);
        const [error, setError] = useState(null);
        const [topUsers, setTopUsers] = useState([]);

        // 프로필 모달 상태 관리
        const [isProfileOpen, setProfileOpen] = useState(false);
        const [profileUser, setProfileUser] = useState(null);


      

  const checkUserAuth = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: 'json'
    }).then(response => {
      if (response.data.result === 'success' && response.data.apiData === 1){
        setUserAuth(1);
        console.log("1등록");

      } else if (response.data.result === 'success' && response.data.apiData === 2) {
          setUserAuth(2);
          console.log("2등록");

      } else {
        setUserAuth(0);
        console.log("0등록");

      }
    }).catch(error => {
      console.log(error);
      setError("서버와의 통신에 실��했습니다.");
    });
  }
        // 첫 번째 미션 선택
    const firstMission = missionAchievements.length > 0 ? missionAchievements[0] : null;


    // 도넛 차트 데이터 설정
    const doughnutData = firstMission ? {
        labels: ['완료', '미완료'],
        datasets: [
        {
            label: firstMission.missionName,
            data: [firstMission.achievementRate, 100 - firstMission.achievementRate],
            backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 205, 86, 0.6)'
            ],
            borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 205, 86, 1)',
            ],
            borderWidth: 1,
        },
        ],
    } : null;
    
    const doughnutOptions = {
        responsive: true,
        plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: '그룹 챌린지 달성도',
        },
        },
    };
    
    // Top 5 유저 가져오기
    const fetchTopUsers = () => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/rates/topusers/${roomNum}`, 
            responseType: 'json'
        })
        .then(response =>{
        console.log('Top Users Response:', response.data);
        if (response.data.result === 'success') { 
            setTopUsers(response.data.apiData); 
        } else {
            setError("Top 5 User를 불러오는 데 실패했습니다.");
        }
        })
        .catch(error => {
        setError("서버와의 통신에 실패했습니다.");
        console.error(error);
        });
    };
    
    // 미션 달성률 데이터를 가져오는 함수
    const fetchMissionAchievements = () => {
        axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/rates/achievement/${roomNum}`,
        responseType: 'json'
        })
        .then(response =>{
        console.log('Mission Achievements Response:', response.data);
        if (response.data.result === 'success') {
            setMissionAchievements(response.data.apiData);
        } else {
            setError("미션 달성률을 불러오는 데 실패했습니다.");
        }
        })
        .catch(error => {
        setError("서버와의 통신에 실패했습니다.");
        console.error(error);
        });
    };
    
        // 프로필 모달 열기 함수
        const openProfile = async (userNum) => {
        console.log('openProfile called with:', userNum); // 디버깅용 로그 추가
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rates/profile/${userNum}`);
            console.log('Profile Response:', response.data);
            if (response.data.result === 'success') {
                setProfileUser(response.data.apiData);
                setProfileOpen(true);
            } else {
                setError("프로필 정보를 불러오는 데 실패했습니다.");
            }
        } catch (error) {
            setError("서버와의 통신에 실패했습니다.");
            console.error(error);
        }
    };
    
    // 프로필 모달 닫기 함수
    const closeProfile = () => {
        setProfileOpen(false);
        setProfileUser(null);
    };

    // 미션 승인 횟수 바 차트 데이터 (백엔드에서 가져온 데이터로 설정)
  const missionApprovalBarChartData = {
    labels: missionApprovals.map(mission => mission.missionName), // 미션 이름 레이블
    datasets: [
      {
        label: "미션 승인 횟수",
        data: missionApprovals.map(mission => mission.approvalCount), // 승인 횟수 데이터
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 미션 승인 횟수 바 차트 옵션
  const missionApprovalBarChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "미션",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "승인 횟수",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        ticks: {
          precision: 0, // 정수 표시
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
      title: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    }
    
  };

    // 전체 유저의 미션 승인 횟수 통계 가져오기
  const fetchMissionApprovals = () => {
    axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/rates/approvals/${roomNum}`, // 수정된 URL
        responseType: 'json'
    })
    .then(response =>{
      console.log('Mission Approvals Response:', response.data);
      if (response.data.result === 'success') { 
        setMissionApprovals(response.data.apiData); 
      } else {
        setError("미션 승인 횟수를 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
  };


  // 바 차트 데이터가 존재하는지 확인
  const isBarChartDataAvailable = missionApprovals && missionApprovals.length > 0;

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

        // 방 평가 타입 가져와서 저장
    const getRoomEvalType = () => {
        const token = localStorage.getItem('token');

        if (!token) {
        console.log("토큰이 없습니다. 로그인하세요.");
        return; // 토큰이 없으면 요청을 보내지 않음
        } 

        axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/roomEvalType/${roomNum}`,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        })
        .then(response => {
            console.log('API Response:', response.data); // 전체 응답 출력
            const roomEvalType = response.data?.apiData;
            setRoomEvalType(roomEvalType); // 평가타입 업데이트
            console.log('Room Eval Type:', roomEvalType);
        })
        .catch(error => {
            console.error('Error occurred while fetching user auth:', error);
        });
        
    };

        // 유저권한 정보 가져와서 저장
    const getUserAuth = () => {
        const token = localStorage.getItem('token');

        if (!token) {
        console.log("토큰이 없습니다. 로그인하세요.");
        return; // 토큰이 없으면 요청을 보내지 않음
        } 

        axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/UserAuth/${roomNum}`,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        })
        .then(response => {
            console.log('API Response:', response.data); // 전체 응답 출력
            const userAuth = response.data?.apiData;
            if (userAuth !== undefined && userAuth !== null) {
            setUserAuth(userAuth); // 상태 업데이트
            console.log('user Auth:', userAuth);
            } else {
            console.error('UserAuth is missing in the response.');
            }
        })
        .catch(error => {
            console.error('Error occurred while fetching user auth:', error);
        });
        
    };

        // 참가자 리스트 가져오기
        const getUserList = () => {
            axios.get(`${process.env.REACT_APP_API_URL}/api/roomMain/${roomNum}`)
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
            axios.get(`${process.env.REACT_APP_API_URL}/api/historyList/${roomNum}`, {
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
            axios.post(`${process.env.REACT_APP_API_URL}/api/updateEvaluation`, null, {
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
            getUserAuth(); // 유저 권한정보 가져오기
            getRoomEvalType(); // 방 평가타입 가져오기
            getHistoryList();
            fetchTopUsers();
            fetchMissionAchievements();
            fetchMissionApprovals();
            checkUserAuth();

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

        // 유저와 날짜 기준으로 그룹화
        const grouped = sortedHistories.reduce((acc, history) => {
            const userDateKey = `${history.userNum}_${new Date(history.submitDate).toISOString().split('T')[0]}`;
            if (!acc[userDateKey]) acc[userDateKey] = [];
            acc[userDateKey].push(history);
            return acc;
        }, {});

        return grouped;
    }, [filteredHistories, order]);

        
        return (
            <>
                <TopHeader />
                <div className="yc-chart-container"> 
          
          {/* Top 5 유저 랭킹 */}
          <div className="yc-top-rankings">
            {/* 도넛 차트와 달성률 표시 */}
            {doughnutData && (
              <>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <h4>{firstMission.missionName} 달성률: {firstMission.achievementRate.toFixed(2)}%</h4>
              </>
            )}
            <h3>Top 5 랭킹</h3>
          {topUsers.map((user) => (
            <div key={user.userNum} className="yc-ranking-item">
              <img 
                src={`${process.env.REACT_APP_API_URL}/upload/${user.usingProfilePic}`  || '/images/challenge1.png'} 
                alt={'/images/challenge1.png'} 
                className="yc-ranking-avatar" 
              />
              <div className="yc-ranking-info">
                        <Link
                          to="#"
                          className="yc_challenge_statistics_top5User"
                          onClick={() => openProfile(user.userNum)} // user 객체 대신 userNum을 전달합니다.
                        >
                          {user.userName}
                        </Link>
                <span className="yc-ranking-progress">달성률: {user.achievementRate}%</span>
              </div>
            </div>
          ))}
          </div>
      </div>
                <div className="jm-missioninfo-body">
                    <Sidebar />
                    <div className="jm-missionsinfo">
                        <Header />
                        {/* 미션 승인 횟수 바 차트 섹션 */}
                        <div className="yc_challenge_statistics_bar-chart-section">
                            <h2 className="yc_challenge_statistics_title">미션 승인 횟수</h2>
                            {isBarChartDataAvailable ? (
                                <div className="yc_challenge_statistics_bar-chart">
                                <Bar
                                    data={missionApprovalBarChartData}
                                    options={missionApprovalBarChartOptions}
                                />
                                </div>
                            ) : (
                                <p>미션 승인 데이터가 없습니다.</p>
                            )}
                            </div>
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
                            .map(([userDateKey, userHistories]) => (
                                <div key={`group-${userDateKey}`} className="jm-submission-card">
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

                                                        {history.evalType === "승인대기" &&
                                                        (roomEvalType === 1 || history.userNum !== currentUserNum) &&
                                                        userAuth === roomEvalType ? (
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
                                                                        src={`${process.env.REACT_APP_API_URL}/upload/${imgNames[currentImgIndex].trim()}`}
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
                                                        src={`${process.env.REACT_APP_API_URL}/upload/${selectedMission.evalImgName.split(',')[modalImgIndex].trim()}`}
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
                                    {userAuth === roomEvalType &&
                                    selectedMission.evalType === '승인대기' &&
                                    (roomEvalType === 1 || selectedMission.userNum !== currentUserNum) && (
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
                { (userAuth === 1 ||userAuth === 2)  &&(
                    <ChatRoom roomNum={roomNum}/>
                ) }  
                <Footert />
            </>
        );
    };

    export default Missioninfo;
