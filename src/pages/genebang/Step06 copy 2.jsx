// src/pages/genebang/Step06.jsx
import React, { useState } from 'react';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step06 = ({ onNext, onPrevious }) => {

    const [missions, setMissions] = useState([{ id: 1, title: '미션 1', inputCount: 1, imagePreviews: [null] }]);
    const [selectedMissionIndex, setSelectedMissionIndex] = useState(null);
    const [fileInputs, setFileInputs] = useState([null]); // 파일 업로드 배열
    const [previews, setPreviews] = useState([null]); // 이미지 미리보기 배열
    const [finalGoalImages, setFinalGoalImages] = useState([null]);
    const [isFinalGoalActive, setIsFinalGoalActive] = useState(false);

    // 최종 목표 활성화/비활성화 토글
    const toggleFinalGoalActivation = () => {
        setIsFinalGoalActive(prevState => !prevState); // 현재 상태를 반전시킴
    };

    // 미션 이미지 변경
    const handleImageChange = (missionId, index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMissions(missions.map(mission => {
                    if (mission.id === missionId) {
                        const updatedImagePreviews = [...mission.imagePreviews];
                        updatedImagePreviews[index] = reader.result;
                        return { ...mission, imagePreviews: updatedImagePreviews };
                    }
                    return mission;
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // 미션 이미지 삭제 (배열에서 이미지 삭제 후, inputCount 조정)
    const handleImageDelete = (missionId, index) => {
        setMissions(missions.map(mission => {
            if (mission.id === missionId) {
                // 이미지 미리보기를 삭제한 후, imagePreviews 배열에서 해당 이미지를 제거
                const updatedImagePreviews = mission.imagePreviews.filter((_, i) => i !== index);

                // inputCount를 하나 감소시킴 (이미지 삭제 후)
                const updatedInputCount = mission.inputCount - 1;

                return { ...mission, imagePreviews: updatedImagePreviews, inputCount: updatedInputCount };
            }
            return mission;
        }));
    };

    const handleAddImageInput = (missionId) => {
        setMissions(missions.map(mission => {
            if (mission.id === missionId && mission.inputCount < 3) {
                return { ...mission, inputCount: mission.inputCount + 1, imagePreviews: [...mission.imagePreviews, null] };
            }
            return mission;
        }));
    };

    const handleAddMission = () => {
        if (missions.length < 5) {
            setMissions([ ...missions, { id: missions.length + 1, inputCount: 1, imagePreviews: [null] } ]); 
        }
    };

    const handleDeleteMission = (missionId) => {
        if (missionId !== 1) {
            setMissions(missions.filter(mission => mission.id !== missionId));
        }
    };

    const handleFinalGoalImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedFinalGoalImages = [...finalGoalImages];
                updatedFinalGoalImages[index] = reader.result;
                setFinalGoalImages(updatedFinalGoalImages);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddFinalGoalImage = () => {
        if (finalGoalImages.length < 3) {
            setFinalGoalImages([...finalGoalImages, null]);
        }
    };

    const handleSelectMission = (index) => {
        setSelectedMissionIndex(index);
    };

    const openModal = (mission) => {
        console.log('Open modal for', mission);
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPreviews = [...previews];
                updatedPreviews[index] = reader.result;
                setPreviews(updatedPreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddFileInput = () => {
        setFileInputs([...fileInputs, null]);
        setPreviews([...previews, null]);
    };

    const handleRemoveFileInput = (index) => {
        setFileInputs(fileInputs.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const isNextEnabled = () => {
        return true; // 필요에 따라 조건 설정
    };

    return (
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step6">
                    <StepNav idx={6} />
                    <div id="board">
                        <div id="list">
                            <div id="mission-btn-plus">
                                <div id="mission-btn">
                                    <button onClick={handleAddMission}>미션 추가</button>
                                </div>
                            </div>

                            <div className='jm-todo-user-add-form'>
                                <div className='jm-mission-add-list'>
                                    {missions.map((mission, index) => (
                                        <div
                                            key={mission.id}
                                            className={`jm-mission-items ${selectedMissionIndex === index ? 'selected' : ''}`}
                                            onClick={() => handleSelectMission(index)}
                                        >
                                            <h2>{mission.title}</h2>
                                            <div className='jm-view-button-container'>
                                                <button
                                                    className="jm-view-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        openModal(mission); 
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
                                    <button className="jm-add-file-button" onClick={handleAddFileInput}>+</button>
                                </div>
                            </div>

                            {/* 최종 목표 설정 */}
                            <div id='mission' key="final-goal">
                                <div id='mission-head'>
                                    <h2>최종 목표를 설정 하시겠습니까?</h2>
                                    <h4>생성된 방에 대한 최종 목표를 설정할 수 있습니다. 그리고 최종 목표는 방장이 평가합니다.</h4>
                                    <div>
                                        <button id='finalgoal-button' onClick={toggleFinalGoalActivation}>
                                            {isFinalGoalActive ? '최종 목표 비활성화' : '최종 목표 활성화'}
                                        </button>
                                    </div>
                                </div>

                                {isFinalGoalActive && (
                                    <div>
                                        <div className='input-button-group'>
                                            <div>
                                                <div id='mission-title '>최종 목표 설정 (100자 이내)</div>
                                                <div id='input-box'><input placeholder='최종 목표를 입력하세요' /></div>
                                            </div>
                                            <div>
                                                <div id='mission-title'>최종 목표 평가일</div>
                                                <div id='input-box'><input placeholder='YYYY-MM-DD' /></div>
                                            </div>
                                            <div>
                                                <button onClick={handleAddFinalGoalImage}>이미지 추가</button>
                                            </div>
                                        </div>

                                        <div id="mission-img">
                                            {finalGoalImages.map((image, index) => (
                                                <div key={index} style={{ position: 'relative' }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFinalGoalImageChange(index, e)}
                                                        style={{ display: 'none' }}
                                                        id={`imageInput-final-${index}`}
                                                    />
                                                    <label htmlFor={`imageInput-final-${index}`} style={{ display: 'block', cursor: 'pointer' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            {image ? (
                                                                <img
                                                                    src={image}
                                                                    alt={`최종 목표 미리보기 ${index}`}
                                                                    style={{
                                                                        width: '200px',
                                                                        height: '200px',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '8px'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div style={{
                                                                    width: '200px',
                                                                    height: '200px',
                                                                    backgroundColor: '#f0f0f0',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    borderRadius: '8px'
                                                                }}>
                                                                    사진
                                                                </div>
                                                            )}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFinalGoalImages(finalGoalImages.filter((_, i) => i !== index));
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '5px',
                                                                    right: '5px',
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    borderRadius: '50%',
                                                                    color: '#000',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    fontSize: '14px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <div id="mission-textarea">
                                            <textarea placeholder="인증 방법을 입력해주세요"></textarea>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 미션 유의 사항 */}
                            <div id='mission-content'>
                                <div>
                                    <h2>미션에 대한 유의사항을 적어주세요.</h2>
                                    <h4>미션 인증 방법에 대해 구체적인 추가사항을 적을 수 있습니다.</h4>
                                    <div id='mission-textarea'>
                                        <textarea>이곳에 입력하세요.</textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn">
                            <button id="secondary" onClick={onPrevious}>이전</button>
                            <button
                                id="primary"
                                onClick={onNext}
                                disabled={!isNextEnabled()}
                                className={!isNextEnabled() ? 'disabled' : ''}
                                aria-disabled={!isNextEnabled()}
                            >
                                다음
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step06;
