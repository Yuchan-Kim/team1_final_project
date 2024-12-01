import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCamera,
  faPlus,
  faImage,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import MobileBottomMenu from '../ham_mobile/MobileBottomMenu';
import Alert from '../ham_common/ham_alert';
import '../../ham_asset/css/ham_M-mission.css';
const MobileMission = () => {
  const navigate = useNavigate();
  const { roomNum } = useParams();
  const token = localStorage.getItem('token');

  const [userAuth, setUserAuth] = useState(null);
  const [roomTitle, setRoomTitle] = useState('');
  const [missionList, setMissionList] = useState([]);
  const [getRule, setGetRule] = useState('');
  const [isEditingRule, setIsEditingRule] = useState(false);
  const [ruleText, setRuleText] = useState('');
  // 참가 모달 관련 상태
  const [showJoinModal, setShowJoinModal] = useState(false);
  // 미션제출 상태
  const [selectedMission, setSelectedMission] = useState(null);
  const [fileInputs, setFileInputs] = useState([null]);
  const [previews, setPreviews] = useState([]);
  const [comment, setComment] = useState('');
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMission, setModalMission] = useState(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  const [alertState, setAlertState] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });

  // 컴포넌트 마운트 시 상태 확인
  useEffect(() => {
    console.log('State changed:', {
      userAuth,
      showJoinModal,
      token,
      roomNum
    });
  }, [userAuth, showJoinModal, token, roomNum]);

  // 유저 권한 확인
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const userAuthValue = response.data.apiData;
        console.log('User auth value:', userAuthValue);
        setUserAuth(userAuthValue);

        // userAuthValue가 0인 경우에만 참가 모달 표시
        if (userAuthValue === 0) {
          setShowJoinModal(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUserAuth(0);
        setShowJoinModal(true);
      }
    };

    if (token && roomNum) {
      checkUserAuth();
    }
  }, [roomNum, token]);

  // 디버깅을 위한 추가 useEffect
  useEffect(() => {
    console.log('User auth changed:', {
      userAuth,
      showJoinModal,
      shouldShowModal: userAuth === 0
    });
  }, [userAuth, showJoinModal]);

  // 미션 리스트와 유의사항 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. 방 정보 가져오기
        const roomResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/challenge/${roomNum}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (roomResponse.data.result === 'success') {
          const roomInfo = roomResponse.data.apiData[0];
          setRoomTitle(roomInfo.roomTitle);
        }

        // 2. 미션 리스트 가져오기
        const missionsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/missionList/${roomNum}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        const updatedMissions = missionsResponse.data.apiData.map(mission => ({
          ...mission,
          isSubmitted: mission.evalNum ? true : false
        }));
        setMissionList(updatedMissions);

        // 3. 유의사항 가져오기
        const rulesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/getRule/${roomNum}`
        );
        setGetRule(rulesResponse.data.apiData?.missionInstruction || '');
        setRuleText(rulesResponse.data.apiData?.missionInstruction || '');

      } catch (error) {
        console.error('Initial data fetch failed:', error);
      }
    };

    if (userAuth !== null && userAuth !== 0) {
      fetchInitialData();
    }
  }, [roomNum, token, userAuth]);

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

  const showAlert = (message, type = 'success') => {
    setAlertState({
      isOpen: true,
      message,
      type
    });
  };

  // 참가 관련 핸들러
  const handleConfirmJoin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/challenge/join/${roomNum}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.result === "success") {
        showAlert(response.data.message || "참가가 성공적으로 완료되었습니다.", 'success');
        setShowJoinModal(false);

        const authResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/challenge/user/${roomNum}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserAuth(authResponse.data.apiData);
      } else {
        showAlert(response.data.message || "인원이 다 차서 참여할 수 없습니다.", 'error');
      }
    } catch (error) {
      console.error("참가 중 오류 발생:", error);
      showAlert("참가 중 오류가 발생했습니다.", 'error');
    }
  };

  const handleCancelJoin = () => {
    setShowJoinModal(false);  // 모달 닫기
    navigate('/mobile/recruiting');  // 방 목록 페이지로 이동
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
        // 미션 리스트 업데이트
        setMissionList(prevList =>
          prevList.map(mission =>
            mission.missionNum === selectedMission.missionNum
              ? { ...mission, isSubmitted: true }
              : mission
          )
        );

        alert('미션이 성공적으로 제출되었습니다.');
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
    <div className="hmk_mobile_mission-wrap">
      <div className="hmk_mobile_mission-fixed-top">
        {/* 유의사항 카드 */}
        <div className="hmk_mobile_mission-card">
          <div className="hmk_mobile_mission-rules">
            <div className="hmk_mobile_mission-stat-title-wrapper">
              <h2 className="hmk_mobile_mission-stat-title">{roomTitle}</h2>
              {userAuth === 1 && (
                <div className="hmk_edit-icon-wrapper" onClick={() => setIsEditingRule(true)}>
                  <FontAwesomeIcon icon={faPen} className="hmk_edit-icon" />
                  <span className="hmk_edit-tooltip">수정하기</span>
                </div>
              )}
            </div>
            {isEditingRule ? (
              <div className="hmk_mobile_mission-edit">
                <textarea
                  className="hmk_mobile_mission-textarea"
                  value={ruleText}
                  onChange={(e) => setRuleText(e.target.value)}
                  placeholder="유의사항을 입력하세요"
                />
                <div className="hmk_mobile_mission-grid">
                  <button
                    className="hmk_mobile_mission-grid-item hmk_active"
                    onClick={handleSaveRule}
                  >
                    저장
                  </button>
                  <button
                    className="hmk_mobile_mission-grid-item"
                    onClick={() => setIsEditingRule(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="hmk_rule-button-wrapper">
                <button
                  className="hmk_view-rule-button"
                  onClick={() => setIsRuleModalOpen(true)}
                >
                  유의사항 확인하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hmk_mobile_mission-content">
        {/* 미션 리스트 */}
        <div className="hmk_mobile_mission-grid-list">
            {missionList.length === 0 ? (
              <div className="hmk_mission-empty">
                <p>제출할 미션이 없습니다.</p>
              </div>
            ) : (
              missionList.map((mission) => (
                <div
                  key={mission.missionNum}
                  className={`hmk_challenge-card ${selectedMission?.missionNum === mission.missionNum ? 'selected' : ''
                    } ${mission.isSubmitted ? 'submitted' : ''}`}
                  onClick={() => {
                    if (!mission.isSubmitted) {
                      setSelectedMission(mission);
                    }
                  }}
                >
                  <div className="hmk_challenge-details">
                    <h4 className="hmk_challenge-mission-title">{mission.missionName}</h4>
                    <p className="hmk_mobile_mission-stat-mission-content">{mission.missionMethod}</p>
                    {mission.isSubmitted && (
                      <div className="hmk_mission-submitted-badge">제출 완료</div>
                    )}
                    <button
                      className="hmk_mobile_mission-grid-item"
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
              ))
            )}
        </div>

        {/* 선택된 미션 제출 폼 */}
        {selectedMission && (
          <div className="hmk_mobile_mission-submitcard">
            <div className="hmk_mobile_mission-stat-submit-title">미션 제출</div>
            <div className="hmk_challenge-submit-content">{selectedMission.missionName}</div>

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
                      <FontAwesomeIcon icon={faCamera} className="hmk_mobile_mission-icon" />
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
              className="hmk_mobile_mission-grid-item hmk_active"
              onClick={handleSubmitMission}
            >
              미션 제출하기
            </button>
          </div>
        )}
      </div>
      {isRuleModalOpen && (
        <div className="hmk_mobile_mission-rulmodal-overlay" onClick={() => setIsRuleModalOpen(false)}>
          <div
            className="hmk_mobile_mission-rulmodal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="hmk_mobile_mission-rulmodal-close"
              onClick={() => setIsRuleModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="hmk_mobile_mission-rulmodal-content">
              <h3 className="hmk_mobile_mission-rulstat-title">유의사항</h3>
              <div className="hmk_mobile_mission-rule-content">
                {getRule || "등록된 유의사항이 없습니다."}
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && modalMission && (
        <div className="hmk_mobile_mission-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="hmk_mobile_mission-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="hmk_mobile_mission-modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="hmk_mobile_mission-modal-content">
              {modalMission.image && (
                <img
                  src={modalMission.image}
                  alt={modalMission.missionName}
                  className="hmk_mobile_mission-modal-image"
                />
              )}
              <h3 className="hmk_mobile_mission-stat-title">
                {modalMission.missionName}
              </h3>
              <p className="hmk_mobile_mission-stat-value">
                {modalMission.missionMethod}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* 참가 모달 추가 */}
      {/* 참가 모달 */}
      {showJoinModal && (
        <div className="hmk_mission-join-modal-overlay">
          <div className="hmk_mission-join-modal">
            <h2>{roomTitle || '챌린지'} 방에 참가하시겠습니까?</h2>
            <div className="hmk_mission-join-buttons">
              <button
                className="hmk_mission-join-confirm"
                onClick={handleConfirmJoin}
              >
                참가
              </button>
              <button
                className="hmk_mission-join-cancel"
                onClick={handleCancelJoin}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <Alert
        isOpen={alertState.isOpen}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        autoClose={true}
      />
      <MobileBottomMenu />
    </div>
  );
};

export default MobileMission;