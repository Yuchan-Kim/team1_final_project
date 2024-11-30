 import React, { useEffect, useState } from 'react';
  import { Link,useParams } from 'react-router-dom';
  import axios from 'axios';
  import TopHeader from "../include/DH_Header.jsx";
  import Footert from "../include/JM-Footer.jsx";
  import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";
  import Calendar from "../../pages/challenge/JM-calendar.jsx";
  import { Bar } from "react-chartjs-2"; 
  import YCProfileInfo from "../../yc_pages/YC_profile_info.jsx";
  import { Doughnut, Line } from "react-chartjs-2"; // Bar 차트 추가

  import '../css/Mission.css';
  import '../css/Modal.css';

  import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
  import Header from "../../yc_pages/JMYC_challenge_header.jsx";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
  const Mission = () => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰을 가져옴
    const {roomNum} = useParams(); // 방넘버 저장
    const [userAuth, setUserAuth] = useState(null); // 유저 권한 저장
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingRule, setIsEditingRule] = useState(false); // 룰셋 수정 모드 상태
    const [ruleText, setRuleText] = useState(); // 초기 룰셋 텍스트
    const [selectedMission, setSelectedMission] = useState(null);
    const [selectedMissionIndex, setSelectedMissionIndex] = useState(null); // 선택된 항목 인덱스
    const [selectedMissionTitle, setSelectedMissionTitle] = useState(''); // 선택된 미션 제목 상태 추가
    const [selectedMissionNumber, setSelectedMissionNumber] = useState(null); // 선택된 미션 넘버 상태
    const [getRule, setGetRule] = useState([]); // 유의사항 1개 가져오기
    const [missionList, setMissionList] = useState([]) // 미션리스트 가져오기
    const [calendarEvents, setCalendarEvents] = useState([]); // 캘린더 이벤트 추가
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [fileInputs, setFileInputs] = useState([{}]); // 사진 업로드
    const [previews, setPreviews] = useState([]); // 사진 프리뷰
    const [users, setUsers] = useState([]);


    const [missionApprovals, setMissionApprovals] = useState([]); // 미션 승인 횟수 통계
    const [missionAchievements, setMissionAchievements] = useState([]);
    const [error, setError] = useState(null);
    const [topUsers, setTopUsers] = useState([]);

    // 프로필 모달 상태 관리
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [profileUser, setProfileUser] = useState(null);

    // 제출 폼 초기화
    const resetMissionForm = () => {
      setSelectedMissionIndex(null);
      setSelectedMissionTitle('');
      setSelectedMissionNumber(null);
      setFileInputs([{}]);
      setPreviews([]);
      document.querySelector('.jm-add-comment-box').value = ''; // 코멘트 입력란 초기화
  };

    // 유저의 미션 승인 횟수 통계 가져오기
    const fetchMissionApprovals = () => {
      axios({
          method: 'get',
          url: `${process.env.REACT_APP_API_URL}/api/rates/myapprovals/${roomNum}`, // 수정된 URL
          headers: {
            
            'Authorization': `Bearer ${token}`
        },
          responseType: 'json'
      })
      .then(response =>{
        console.log('Mission Approvals Response:', response.data);
        if (response.data.result === 'success') { 
          setMissionApprovals(response.data.apiData); 
          console.log('Mission Approvals Response:', response.data.apiData);
        } else {
          setError("미션 승인 횟수를 불러오는 데 실패했습니다.");
        }
      })
      .catch(error => {
        setError("서버와의 통신에 실패했습니다.");
        console.error(error);
      });
    };

    // 미션 승인 횟수 바 차트 데이터 (백엔드에서 가져온 데이터로 설정)
    const missionApprovalBarChartData = {
      labels: missionApprovals.map(mission => mission.missionName), // 미션 이름 레이블
      datasets: [
        {
          label: "미션 승인 횟수",
          data: missionApprovals.map(mission => mission.userSubmissionCount), // 승인 횟수 데이터
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


  // 전체 유저 목록 가져오기
    const fetchUsers = () => {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/rates/myInfo/${roomNum}`, 
        responseType: 'json',
        headers: {
            
          'Authorization': `Bearer ${token}`
      },
    })
    .then(response => {
      console.log('Users Response:', response.data);
      if (response.data.result === 'success') {
        
          setUsers(response.data.apiData);
        
      } else {
        setError("유저 목록을 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
    };

    
    // 제출 미션 선택 핸들러
    const handleSelectMission = (index, mission) => {
      if (mission.isSubmitted) {
        alert("이미 제출된 미션입니다.");
        return; // 이미 제출된 미션은 선택 불가
      }
      resetMissionForm(); // 폼 초기화
      setSelectedMissionIndex(index);
      setSelectedMissionTitle(mission.missionName); // 미션 제목 업데이트
      setSelectedMissionNumber(mission.missionNum); // 미션 넘버 업데이트
    };

    const handleOpenModal = () => setIsModalOpen(true);
    // 모달 열기 함수
    const openModal = (mission) => {
      setSelectedMission(mission);
      setIsModalOpen(true);
    };
    // 모달 닫기 함수
    const closeModal = () => {
      setIsModalOpen(false);
      setFileInputs([{}]);
      setPreviews([]);
    };

    // 파일 추가 핸들러
    const handleAddFileInput = () => {
      if (fileInputs.length < 3) {
        setFileInputs([...fileInputs, {}]);
      } else {
        alert("사진은 최대 3개까지 추가할 수 있습니다."); // 사용자에게 알림
      }
    };

    // 사진 업로드 함수
    const handleRemoveFileInput = (index) => {
      setFileInputs(fileInputs.filter((_, i) => i !== index));
      setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleFileChange = (event, index) => {
      const files = [...fileInputs];
      files[index] = event.target.files[0];
      setFileInputs(files);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result;
        setPreviews(newPreviews);
      };
      if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
      }
    };

    // 유의사항 수정버튼 핸들러
    const handleEditRule = () => {
      setIsEditingRule(true);
    };
    // 새유의사항 저장 핸들러
    const handleRuleChange = (event) => {
      setRuleText(event.target.value);
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
          } else {
            console.error('UserAuth is missing in the response.');
          }
        })
        .catch(error => {
          console.error('Error occurred while fetching user auth:', error);
        });
    };
    
    // 유의사항 수정, 등록
    const handleSaveRule = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("토큰이 없습니다. 로그인하세요.");
        return; // 토큰이 없으면 요청을 보내지 않음
      }
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/rules/${roomNum}`, {
          ruleText: ruleText, // 유의사항 텍스트를 보냄
        })
        .then((response) => {
          console.log("Rule saved successfully:", response.data.apiData);
          setIsEditingRule(false); // 저장 성공 시 수정 모드 종료
          window.location.reload();  // 새로고침
        })
        .catch((error) => {
          console.error("Failed to save rule:", error);
          alert("유의사항 저장에 실패했습니다. 다시 시도해주세요.");
        });
    };

    // 유의사항 1개 가져오기
    const getRules = () => {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/getRule/${roomNum}`,   
        responseType: 'json' 
      }).then(response => {
        setGetRule(response.data.apiData || []);
      }).catch(error => {
        console.error("Failed to fetch mission list:", error);
      });
    };

    // 캘린더에서 이벤트 클릭 시 동작
    const handleEventClick = (event) => {
      setSelectedEvent(event);
      alert(`미션: ${event.title}\n설명: ${event.extendedProps.description}`);
    };

    // 미션 리스트 가져오기
    const getMissionList = () => {
      axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/missionList/${roomNum}`,
        headers: {
          'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
          'Content-Type': 'application/json'
        },
        responseType: 'json' 
      })
      .then(response => {
        const missions = response.data.apiData || [];
        
        // 각 미션에 대해 isSubmitted 플래그 설정
        const updatedMissions = missions.map(mission => ({
          ...mission,
          isSubmitted: mission.evalNum ? true : false // evalNum이 존재하면 true, 아니면 false
        }));
        
        setMissionList(updatedMissions); // 미션 리스트 상태 업데이트
      })
      .catch(error => {
        console.error("Failed to fetch mission list:", error);
        alert("미션 리스트를 가져오는 데 실패했습니다.");
      });
    };
    


    // 미션 제출
    const handleSubmitMission = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("토큰이 없습니다. 로그인하세요.");
        return;  // 오류가 있으면 함수 중단
      }
      if (!selectedMissionNumber) {
        alert("미션을 선택하세요.");
        return;
      }
      const comment = document.querySelector('.jm-add-comment-box').value;
      const formData = new FormData();
      formData.append('missionNumber', selectedMissionNumber); // 미션 넘버 추가
      formData.append('comment', comment || "기본 코멘트");

      fileInputs.forEach((file) => {
        if (file) {
          formData.append('files', file);
        }
      });
      axios.post(`${process.env.REACT_APP_API_URL}/api/submitMissionWithFiles`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        if (response.data.result === "success") {
        console.log("Mission submitted successfully:", response.data);
        alert("미션 제출이 완료되었습니다.");
        resetMissionForm(); // 폼 초기화
        getMissionList(); // 미션 리스트 갱신
        } else {
          console.log(response.data.message);
      }
      })
      .catch(error => {
        console.error("Failed to submit mission:", error);
        alert("미션 제출에 실패했습니다.");
      });
    };


    
    useEffect(() => {
      console.log('Updated userAuth state:', userAuth);
    }, [userAuth]);
    

    useEffect(() => {
      getMissionList(); // 미션리스트 가져오기
      getRules(); // 유의사항 1개 가져오기
      getUserAuth(); // 유저 권한정보 가져오기
      fetchTopUsers();
      fetchMissionApprovals();
      fetchMissionAchievements();
      fetchUsers();
      console.log(setMissionList);
    }, []);

  


    return (
      <>
        <TopHeader/>

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
                  src={`${process.env.REACT_APP_API_URL}/upload/${user.usingProfilePic}` || '/images/challenge1.png'} 
                  alt={`${user.userName} 프로필`} 
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
      <div className="jm-bady">
        {/* Sidebar */}

          <Sidebar />


        {/* Main Content */}
        <div className="jm-mission-body">
        <Header/>

          <h2 className="jm-sub-tatle">미션 제출</h2>

          <div className="jm-mission-container-top">
          <div className="jm-mission-progress-bar-container">
          {/* Progress Bar */}
          <span className="jm-my-count">내 달성율:  {users.achievementRate} %</span>
          <div className="jm-progress-bar">
            <div className="jm-progress" style={{ width: users.achievementRate }}></div>
          </div>
          {/* 룰셋 수정 가능 */}
            {isEditingRule ? (
              <div className="jm-roolset-contents-box">
                <h3>유의 사항</h3>
              <textarea
                  placeholder={ruleText}
                  value={ruleText}
                  onChange={handleRuleChange}
              ></textarea>
              
              <div className="jm-btn-updatimg">
              <button onClick={handleSaveRule}>
                  등록
              </button>
              </div>
            </div>
            ) : (
              <div className='jm-roolset-update-contents-box'>
                <div className='jm-roolset-contents-box'>
                <h3>유의 사항</h3>
                <span>{getRule?.missionInstruction || "방 소개 없음"}</span>
                {/* enteredUserAuth가 1인 사용자에게만 수정 버튼 노출 */}
                {userAuth === 1 && (
                <div className="jm-btn-updatimg">
                  <button onClick={handleEditRule}>
                    수정
                  </button>
                </div>
                )}
                </div>
                </div>
            )}
            {/* 추가 그래프 (막대 그래프) */}
            <div className="jm_challenge_statistics_additional-graph">
              <h2>내 미션 통계</h2>
                <Bar
                  data={missionApprovalBarChartData}
                  options={missionApprovalBarChartOptions}
                />
              </div>
          </div>

          <div className="jm-calendar-container">
            <Calendar className="jm-calendar"/>
          </div>
          </div>
          
          <h2 className="jm-todo">할일</h2>
          <div className='jm-todo-user-add-form'>
            <div className='jm-mission-add-list'>
              {missionList.map((mission, index) => (
                <div
                key={index}
                className={`jm-mission-items ${selectedMissionIndex === index ? 'selected' : ''}`}
                onClick={() => handleSelectMission(index, mission)} // 미션 제목 전달
                style={{
                  pointerEvents: mission.isSubmitted ? 'none' : 'auto', // 제출된 미션 비활성화
                  opacity: mission.isSubmitted ? 0.5 : 1 // 제출된 미션 희미하게 표시
                }}
              >
                  <h2>{mission.missionName}</h2>
                  {mission.isSubmitted && <span className="submitted-label">제출 완료</span>}
                  <div className='jm-view-button-container'>
                    <button
                      className="jm-view-button"
                      onClick={(e) => {
                        e.stopPropagation(); // 이벤트 전파 막기
                        openModal(mission); // 모달 열기
                      }}
                    >
                      더보기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className='jm-user-mission-add-fom'>
            <h2>미션 제출하기</h2>
            <p>선택된 미션: <strong>{selectedMissionTitle || "미션을 선택하세요"}</strong></p>
              <div className="jm-add-mission-img-form">
                {fileInputs.map((_, index) => (
                  <div key={index} className="jm-file-upload">
                    <label htmlFor={`file-input-${index}`} className="jm-file-label">
                      {previews[index] ? (
                        <img src={previews[index]} alt={`Preview ${index}`} className="jm-image-preview" />
                      ) : (
                        <span className="jm-placeholder-text">이미지 선택</span>
                      )}
                    </label>
                    <input
                      type="file"
                      id={`file-input-${index}`}
                      className="jm-hidden-file-input"
                      onChange={(event) => handleFileChange(event, index)}
                    />
                    {index > 0 && (
                      <button className='jm-file-delete-btn' onClick={() => handleRemoveFileInput(index)}>
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="jm-add-file-button" onClick={handleAddFileInput}>
                +
              </button>
              <div className="jm-comment-add-btn-container">
                <input className='jm-add-comment-box' type="text" placeholder="코멘트를 입력하세요" />
                <button  className="jm-add-user-mission-btn" onClick={handleSubmitMission}>제출</button>
                <button  className="jm-add-user-mission-btn" onClick={handleOpenModal}>수정</button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 모달 창 */}
      {isModalOpen && selectedMission && (
        <div className="yc-modal-overlay_roomMain" onClick={closeModal}>
          <div className="yc-modal_roomMain" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            {/* 닫기 아이콘 */}
            <button className="yc-modal-close_roomMain" onClick={closeModal} aria-label="닫기">              <FontAwesomeIcon icon={faTimes} />
            </button>
            {/* 모달 내용 */}
            <div className="yc-modal-content_roomMain">
              <img src={selectedMission.image} alt={`${selectedMission.title} 상세 이미지`} className="yc-modal-image_roomMain" />
              <div className="yc-modal-description_roomMain">
                <h2 id="modal-title">{selectedMission.missionName}</h2>
                <p>{selectedMission.missionMethod}</p>
                {/* 추가 정보가 있다면 여기에 추가 */}
              </div>
            </div>
          </div>
        </div>
      )}
      <YCProfileInfo
              isOpen={isProfileOpen}
              onClose={closeProfile}
              user={profileUser} // 선택된 유저 정보 전달
        />
      <ChatRoom roomNum={roomNum}/>

      {/* 푸터 */}
        <Footert/>
      {/* 푸터 끝 */}
      </>
    );
  };

  export default Mission;