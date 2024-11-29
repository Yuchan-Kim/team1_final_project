import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCamera,
  faPlus,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import MobileBottomMenu from '../ham_mobile/MobileBottomMenu';
import '../../ham_asset/css/ham_M-mission.css';
const MobileMission = () => {
  const { roomNum } = useParams();
  const token = localStorage.getItem('token');

  const [userAuth, setUserAuth] = useState(null);
  const [missionList, setMissionList] = useState([]);
  const [getRule, setGetRule] = useState('');
  const [isEditingRule, setIsEditingRule] = useState(false);
  const [ruleText, setRuleText] = useState('');
  // 미션제출 상태
  const [selectedMission, setSelectedMission] = useState(null);
  const [fileInputs, setFileInputs] = useState([null]);
  const [previews, setPreviews] = useState([]);
  const [comment, setComment] = useState('');
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMission, setModalMission] = useState(null);
  // 제출된 미션 상태
  const [submittedMissions, setSubmittedMissions] = useState([]);
  // 컴포넌트 마운트 시 상태 확인
  useEffect(() => {
    console.log('Component mounted');
    console.log('Room Number:', roomNum);
    console.log('Token:', token ? 'exists' : 'missing');
  }, []);

  // 유저 권한 확인
  useEffect(() => {
    const checkUserAuth = async () => {
      console.log('Checking user auth...');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        console.log('User auth response:', response.data);
        setUserAuth(response.data.apiData);
      } catch (error) {
        console.error('User auth check failed:', error);
        console.log('Error response:', error.response?.data);
      }
    };

    checkUserAuth();
  }, [roomNum, token]);

  // 미션 리스트와 유의사항 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      console.log('Fetching initial data...');
      try {
        // 미션 리스트 가져오기
        console.log('Fetching mission list...');
        const missionsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/missionList/${roomNum}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        console.log('Mission list response:', missionsResponse.data);
        setMissionList(missionsResponse.data.apiData || []);

        // 유의사항 가져오기
        console.log('Fetching rules...');
        const rulesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getRule/${roomNum}`
        );
        console.log('Rules response:', rulesResponse.data);
        setGetRule(rulesResponse.data.apiData?.missionInstruction || '');
        setRuleText(rulesResponse.data.apiData?.missionInstruction || '');
      } catch (error) {
        console.error('Initial data fetch failed:', error);
        console.log('Error response:', error.response?.data);
      }
    };

    fetchInitialData();
  }, [roomNum, token]);
  // 유의사항 저장 핸들러
  const handleSaveRule = async () => {
    if (!token || userAuth !== 1) return;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/rules/${roomNum}`,
        { ruleText },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setGetRule(ruleText);
      setIsEditingRule(false);
    } catch (error) {
      console.error('유의사항 저장 실패:', error);
      alert('유의사항 저장에 실패했습니다.');
    }
  };
  // 상태 변경 모니터링
  useEffect(() => {
    console.log('Current userAuth:', userAuth);
    console.log('Current missionList:', missionList);
    console.log('Current rule:', getRule);
    console.log('Current selected mission:', selectedMission);
  }, [userAuth, missionList, getRule, selectedMission]);

  // 파일 관련 핸들러
  const handleFileChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const newFileInputs = [...fileInputs];
      newFileInputs[index] = file;
      setFileInputs(newFileInputs);

      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previews];
        newPreviews[index] = reader.result;
        setPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFileInput = () => {
    if (fileInputs.length < 3) {
      setFileInputs([...fileInputs, null]);
      setPreviews([...previews, null]);
    } else {
      alert("사진은 최대 3개까지만 추가할 수 있습니다.");
    }
  };

  const handleRemoveFileInput = (index) => {
    setFileInputs(fileInputs.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // 미션 제출
  const handleSubmitMission = async () => {
    console.log('Submitting mission...');
    console.log('Selected mission:', selectedMission);
    console.log('Files:', fileInputs);
    console.log('Comment:', comment);

    if (!selectedMission) {
      alert('미션을 선택해주세요.');
      return;
    }

    if (!fileInputs[0]) {
      alert('최소 1개의 사진을 첨부해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('missionNumber', selectedMission.missionNum);
    formData.append('comment', comment);
    fileInputs.forEach((file, index) => {
      if (file) {
        formData.append('files', file);
      }
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/submitMissionWithFiles`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (response.data.result === 'success') {
        // 제출된 미션 목록 업데이트
        setSubmittedMissions([...submittedMissions, selectedMission.missionNum]);
        alert('미션이 성공적으로 제출되었습니다.');

        // 폼 초기화
        setSelectedMission(null);
        setFileInputs([null]);
        setPreviews([]);
        setComment('');
      }
    } catch (error) {
      console.error('Mission submission failed:', error);
      alert('미션 제출에 실패했습니다.');
    }
  };


  // 컴포넌트 마운트 시 제출된 미션 정보 가져오기 
  useEffect(() => {
    const fetchSubmittedMissions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/submittedMissions/${roomNum}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        setSubmittedMissions(response.data.apiData || []);
      } catch (error) {
        console.error('Failed to fetch submitted missions:', error);
      }
    };

    fetchSubmittedMissions();
  }, [roomNum, token]);

  console.log('Rendering component with:', {
    userAuth,
    missionList: missionList.length,
    hasRule: !!getRule,
    selectedMission: !!selectedMission
  });

  // 모달 열기 핸들러
  const openModal = (mission, e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setModalMission(mission);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const closeModal = () => {
    setIsModalOpen(false);
    setModalMission(null);
  };

  return (
    <div className="hmk_mobile_home-wrap">
      <div className="hmk_mobile_home-fixed-top">
        {/* 유의사항 카드 */}
        <div className="hmk_mobile_home-card">
          <div className="hmk_mobile_home-rules">
            <div className="hmk_mobile_home-stat-title">유의사항</div>
            {isEditingRule && userAuth === 1 ? (
              <div className="hmk_mobile_mission-edit">
                <textarea
                  className="hmk_mobile_mission-textarea"
                  value={ruleText}
                  onChange={(e) => setRuleText(e.target.value)}
                  placeholder="유의사항을 입력하세요"
                />
                <div className="hmk_mobile_home-grid">
                  <button
                    className="hmk_mobile_home-grid-item hmk_active"
                    onClick={handleSaveRule}
                  >
                    저장
                  </button>
                  <button
                    className="hmk_mobile_home-grid-item"
                    onClick={() => setIsEditingRule(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="hmk_mobile_home-stat-value">
                  {getRule || "등록된 유의사항이 없습니다."}
                </p>
                {userAuth === 1 && (
                  <button
                    className="hmk_mobile_home-grid-item"
                    onClick={() => setIsEditingRule(true)}
                  >
                    수정
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="hmk_mobile_home-content">
        {/* 미션 리스트 */}
        <div className="hmk_mobile_home-grid-list">
          {missionList.map((mission) => (
            <div
              key={mission.missionNum}
              className={`hmk_challenge-card ${selectedMission?.missionNum === mission.missionNum ? 'selected' : ''
                } ${submittedMissions.includes(mission.missionNum) ? 'submitted' : ''}`}
              onClick={() => {
                if (!submittedMissions.includes(mission.missionNum)) {
                  setSelectedMission(mission);
                }
              }}
            >
              <div className="hmk_challenge-details">
                <h4 className="hmk_challenge-title">{mission.missionName}</h4>
                <p className="hmk_mobile_home-stat-title">{mission.missionMethod}</p>
                {submittedMissions.includes(mission.missionNum) && (
                  <div className="hmk_mission-submitted-badge">제출 완료</div>
                )}
                <button
                  className="hmk_mobile_home-grid-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalMission(mission);
                    setIsModalOpen(true);
                  }}
                >
                  상세보기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 선택된 미션 제출 폼 */}
        {selectedMission && (
          <div className="hmk_mobile_home-card">
            <div className="hmk_mobile_home-stat-title">미션 제출</div>
            <div className="hmk_challenge-title">{selectedMission.missionName}</div>

            <div className="hmk_mobile_mission-photos">
              {fileInputs.map((_, index) => (
                <div key={index} className="hmk_mobile_mission-photo-item">
                  <input
                    type="file"
                    id={`file-${index}`}
                    className="hmk_mobile_mission-photo-input"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                  />
                  {previews[index] ? (
                    <div className="hmk_mobile_mission-preview">
                      <img src={previews[index]} alt={`미리보기 ${index + 1}`} />
                      <button
                        className="hmk_mobile_mission-delete"
                        onClick={() => handleRemoveFileInput(index)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-${index}`}
                      className="hmk_mobile_mission-upload"
                    >
                      <FontAwesomeIcon icon={faCamera} className="hmk_mobile_home-icon" />
                    </label>
                  )}
                </div>
              ))}
              {fileInputs.length < 3 && (
                <div
                  className="hmk_mobile_mission-photo-item"
                  onClick={handleAddFileInput}
                >
                  <div className="hmk_mobile_mission-upload">
                    <FontAwesomeIcon icon={faPlus} className="hmk_mobile_mission-photo-input" />
                  </div>
                </div>
              )}
            </div>

            <textarea
              className="hmk_mobile_mission-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="미션에 대한 코멘트를 입력하세요"
            />

            <button
              className="hmk_mobile_home-grid-item hmk_active"
              onClick={handleSubmitMission}
            >
              미션 제출하기
            </button>
          </div>
        )}
      </div>
      {isModalOpen && modalMission && (
        <div className="hmk_mobile_home-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="hmk_mobile_home-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="hmk_mobile_home-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="hmk_mobile_home-modal-content">
              {modalMission.image && (
                <img
                  src={modalMission.image}
                  alt={modalMission.missionName}
                  className="hmk_mobile_home-modal-image"
                />
              )}
              <h3 className="hmk_mobile_home-stat-title">
                {modalMission.missionName}
              </h3>
              <p className="hmk_mobile_home-stat-value">
                {modalMission.missionMethod}
              </p>
            </div>
          </div>
        </div>
      )}
      <MobileBottomMenu />
    </div>
  );
};

export default MobileMission;