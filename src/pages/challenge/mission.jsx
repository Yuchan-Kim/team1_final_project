import React, { useState } from 'react';
import TopHeader from "../include/DH_Header.jsx";
import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";
import { Doughnut, Line, Bar } from "react-chartjs-2"; 
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


import '../css/Mission.css';
import '../css/Modal.css';



import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";

const Mission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingRule, setIsEditingRule] = useState(false); // 룰셋 수정 모드 상태
  const [ruleText, setRuleText] = useState("산 근처 공원에서 런닝 하실때는 야생의 김유찬을 조심하세요."); // 초기 룰셋 텍스트

  const barChartData = {
    labels: ["미션 A", "미션 B", "미션 C", "미션 D", "미션 E"],
    datasets: [
      {
        label: "완료된 내 미션 수",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "#ff6384",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
          text: "완료 수",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
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
    },
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "날짜",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "전체 달성률 (%)",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
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
    },
  };

  const handleOpenModal = () => setIsModalOpen(true);

  const handleEditRule = () => {
    setIsEditingRule(true);
  };

  const handleSaveRule = () => {
    setIsEditingRule(false);
  };

  const handleRuleChange = (event) => {
    setRuleText(event.target.value);
  };

  const missions = [
    { title: "5키로 감량", status: "제출", description: "인증사진은 이렇게 넣어라 이렇게 안넣으면 승인 거절할거니까 알아서들 잘해라" },
    { title: "스트레칭 하기", status: "제출", description: "인증사진은 이렇게 넣어라 이렇게 안넣으면 승인 거절할거니까 알아서들 잘해라" },
    { title: "500미터 걷기", status: "제출", description: "인증방법 설명" },
    { title: "물 마시기", status: "제출", description: "인증방법 설명" },
    { title: "눈 마사지", status: "제출", description: "인증방법 설명" },
    { title: "눈 마시기", status: "제출", description: "인증방법 설명" }
  ];

  const [fileInputs, setFileInputs] = useState([{}]);
  const [previews, setPreviews] = useState([]);

  const handleAddFileInput = () => {
    if (fileInputs.length < 3) {
      setFileInputs([...fileInputs, {}]);
    } else {
      alert("파일은 최대 3개까지 추가할 수 있습니다."); // 사용자에게 알림
    }
  };

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFileInputs([{}]);
    setPreviews([]);
  };

  return (
    <>
      <TopHeader/>
    <div className="jm-bady">
      {/* Sidebar */}

        <Sidebar />


      {/* Main Content */}
      <div className="jm-mission-body">
      <Header/>

        <h2 className="jm-sub-tatle">미션 제출</h2>

        {/* Progress Bar */}
        <span className="jm-my-count">내 달성율 79%</span>
        <div className="jm-progress-bar">
          <div className="jm-progress" style={{ width: '75%' }}></div>
        </div>

        {/* 룰셋 수정 가능 */}
        <div className='jm-roolset'>
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
              <span>{ruleText}</span>
              <div className="jm-btn-updatimg">
                <button onClick={handleEditRule}>
                  수정
                </button>
              </div>
              </div>
              </div>
          )}
          {/* 추가 그래프 (막대 그래프) */}
          <div className="jm_challenge_statistics_additional-graph">
            <h2>내 미션 통계</h2>
              <Bar
                data={barChartData}
                options={barChartOptions}
              />
            </div>
        </div>
        
        <h2 className="jm-todo">할일</h2>
        {/* Mission List 컨테이너 */}
        <div className="jm-mission-list">
          <div className="jm-missions">
            {missions.map((mission, index) => (
              <div key={index} className="jm-mission">
                <div className="jm-mission-name">
                  <h3>{mission.title}</h3>
                  <button onClick={handleOpenModal}>{mission.status}</button>
                </div>
                <div className="jm-mission-img">
                  <img src="https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" alt="미션 이미지" />
                </div>
                <div className='jm-mission-comment-container'>
                  <p>{mission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="jm-modal-overlay">
          <div className="jm-modal-content">
            <button className="jm-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <span>미션 제출</span>

            {/* 파일 업로드 및 미리보기 */}
            <div className="jm-file-upload-container">
              {fileInputs.map((_, index) => (
                <div key={index} className="jm-file-upload">
                  <div className='jm-file-upload-name'>
                  <input
                    type="file"
                    onChange={(event) => handleFileChange(event, index)}
                  />
                  {index > 0 && (
                    <button className='jm-file-delete-btn' onClick={() => handleRemoveFileInput(index)}>
                      &times;
                    </button>
                  )}
                  </div>
                  {previews[index] && (
                    <div className="jm-image-preview">
                      <img src={previews[index]} alt={`Preview ${index}`} />
                    </div>
                  )}
                </div>
              ))}
              </div>
              <button className="jm-add-file-button" onClick={handleAddFileInput}>
                +
              </button>
            
            <div className='jm-modal-add-ok'>
              <p>미션을 제출하시겠습니까?</p>
              <button onClick={handleCloseModal}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
    <ChatRoom/>
    </>
  );
};

export default Mission;
