import React, { useState } from 'react';
import '../css/Mission.css';
import '../css/Modal.css';

import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";

const Mission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingRule, setIsEditingRule] = useState(false); // 룰셋 수정 모드 상태
  const [ruleText, setRuleText] = useState("산 근처 공원에서 런닝 하실때는 야생의 김유찬을 조심하세요."); // 초기 룰셋 텍스트

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
    { title: "스트레칭 하기", status: "제출", description: "인증방법 설명" },
    { title: "500미터 걷기", status: "제출", description: "인증방법 설명" },
    { title: "물 마시기", status: "제출", description: "인증방법 설명" },
    { title: "눈 마사지", status: "제출", description: "인증방법 설명" },
    { title: "눈 마시기", status: "제출", description: "인증방법 설명" }
  ];

  const [fileInputs, setFileInputs] = useState([{}]);
  const [previews, setPreviews] = useState([]);

  const handleAddFileInput = () => {
    setFileInputs([...fileInputs, {}]);
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
    <div className="jm-bady">
      {/* Sidebar */}
      <div className="jm-Sidenav">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="jm-mission-body">
      <Header/>

        <h2 className="jm-sub-tatle">미션 제출</h2>

        {/* Progress Bar */}
        <h2 className="jm-todo">할일</h2>
        <span className="jm-my-count">내 달성율 79%</span>
        <div className="jm-progress-bar">
          <div className="jm-progress" style={{ width: '75%' }}></div>
        </div>

        {/* 룰셋 수정 가능 */}
        <div className='jm-roolset'>
          {isEditingRule ? (
            <div>
              <div>
              <input
                type="text"
                value={ruleText}
                onChange={handleRuleChange}
                className="jm-rule-input"
              />
              </div>
              <div className='jm-rool-add-button'>
              <button className="jm-btn-save" onClick={handleSaveRule}>
                저장
              </button>
              </div>
            </div>
          ) : (
            <div>
              <span>{ruleText}</span>
              <button className="jm-btn-updatimg" onClick={handleEditRule}>
                수정
              </button>
            </div>
          )}
        </div>

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
                  <img src="https://example.com/image.jpg" alt="미션 이미지" />
                </div>
                <p>{mission.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Goal Section */}
        <div className="jm-final-goal">
          <h2>최종 목표</h2>
          <div className="jm-goals">
            <div className='jm-goal-box'>
            <div className="jm-goal-tatle">
              <div className="jm-goal-name">
                <h3>최종목표</h3><br/>
                <p>인증 가능 시간 27일 남음</p>
              </div>
              <p>5키로 빼기!</p>
            </div>
            <div className="jm-goal-mission">
              <div className="jm-mission-name">
                <h3>5키로 빼기</h3>
                <button onClick={handleOpenModal}>제출</button>
              </div>
              <div className="jm-mission-img">
                <img src="https://example.com/image.jpg" alt="미션 이미지" />
              </div>
              <p>시작 몸무게와 현재 몸무게 사진을 올려주세요 (2장)</p>
            </div>
            </div>
            <div className="jm-goup-tatle-box">
              <div className="jm-goal-name">
                <h3>그룹 챌린지</h3><br/>
                <p>인증 가능 시간 27일 남음</p>
              </div>
              <p>전원 500m 걷기 2</p>
            </div>

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
                  <input
                    type="file"
                    onChange={(event) => handleFileChange(event, index)}
                  />
                  {index > 0 && (
                    <button onClick={() => handleRemoveFileInput(index)}>
                      &times;
                    </button>
                  )}
                  {previews[index] && (
                    <div className="jm-image-preview">
                      <img src={previews[index]} alt={`Preview ${index}`} />
                    </div>
                  )}
                </div>
              ))}
              <button className="jm-add-file-button" onClick={handleAddFileInput}>
                + 파일 추가
              </button>
            </div>

            <p>미션을 제출하시겠습니까?</p>
            <div className='jm-modal-add-ok'>
              <button onClick={handleCloseModal}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mission;
