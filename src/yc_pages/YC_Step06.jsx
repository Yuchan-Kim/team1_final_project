// src/pages/genebang/Step06.jsx

import React, { useState } from 'react';
import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx'; // StepNav 임포트

const Step06 = ({ onSave, onPrevious }) => {
    const [missions, setMissions] = useState([{ id: 1, inputCount: 1, imagePreviews: [null] }]);
    const [finalGoalImages, setFinalGoalImages] = useState([null]);
    const [isFinalGoalActive, setIsFinalGoalActive] = useState(false);

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

    const toggleFinalGoalActivation = () => {
        setIsFinalGoalActive(prevState => !prevState);
    };

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        // 모든 미션과 최종 목표에 대한 유효성 검사 추가 가능
        return true; // 필요에 따라 조건 설정
    };

    return (
        <>
            <div id="yc_jy_step" className="yc_jy_wrap">
                <div className="yc_container">
                    <div className="yc_step" id="yc_step6">
                        <YCStepNav idx={4} /> {/* StepNav 포함 */}
                        <div id="yc_board">
                            <div id="yc_list">
                                <div id='yc_mission_btn_plus'>
                                    <div id="yc_mission_btn">
                                        <button onClick={handleAddMission}>미션 추가</button>
                                    </div>
                                </div>

                                {/* 미션 리스트 */}
                                {missions.map((mission, missionIndex) => (
                                    <div id="yc_mission" key={mission.id}>
                                        <div className="yc_mission_header">
                                            <div>
                                                <h2>{`미션 ${missionIndex + 1} 생성`}</h2>
                                                <h4>미션은 최대 5개까지 생성할 수 있습니다.</h4>
                                            </div>
                                            <div id="yc_mission_btn_list">
                                                {mission.id !== 1 && (
                                                    <div id="yc_mission_btn">
                                                        <button onClick={() => handleDeleteMission(mission.id)}>미션 삭제</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="yc_input_button_group">
                                            <div id="yc_input_box">
                                                <input placeholder="AI 추천 미션" />
                                            </div>
                                            <div>
                                                <button onClick={() => handleAddImageInput(mission.id)}>이미지 추가</button>
                                            </div>
                                        </div>

                                        <div id="yc_mission_img">
                                            {[...Array(mission.inputCount)].map((_, index) => (
                                                <div key={index} style={{ position: 'relative' }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(mission.id, index, e)}
                                                        style={{ display: 'none' }}
                                                        id={`yc_imageInput-${mission.id}-${index}`}
                                                    />
                                                    <label htmlFor={`yc_imageInput-${mission.id}-${index}`} style={{ display: 'block', cursor: 'pointer' }}>
                                                        <div style={{ position: 'relative' }}>
                                                            {mission.imagePreviews[index] ? (
                                                                <img
                                                                    src={mission.imagePreviews[index]}
                                                                    alt={`미리보기 ${index}`}
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
                                                            {/* X 버튼 항상 보이기 */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();  // label 클릭이 전파되지 않도록
                                                                    handleImageDelete(mission.id, index);
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '5px',
                                                                    right: '5px',
                                                                    background: 'transparent',
                                                                    border: 'none',
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

                                        <div id="yc_mission_textarea">
                                            <textarea placeholder="인증 방법을 입력해주세요"></textarea>
                                        </div>
                                    </div>
                                ))}

                                {/* 최종 목표 설정 */}
                                <div id='yc_mission' key="final-goal">
                                    <div id='yc_mission_head'>
                                        <h2>최종 목표를 설정 하시겠습니까?</h2>
                                        <h4>생성된 방에 대한 최종 목표를 설정할 수 있습니다. 그리고 최종 목표는 방장이 평가합니다.</h4>
                                        <div>
                                            <button id='yc_finalgoal_button' onClick={toggleFinalGoalActivation}>
                                                {isFinalGoalActive ? '최종 목표 비활성화' : '최종 목표 활성화'}
                                            </button>
                                        </div>
                                    </div>

                                    {isFinalGoalActive && (
                                        <div>
                                            <div className='yc_input_button_group'>
                                                <div>
                                                    <div id='yc_mission_title'>최종 목표 설정 (100자 이내)</div>
                                                    <div id='yc_input_box'><input placeholder='최종 목표를 입력하세요' /></div>
                                                </div>
                                                <div>
                                                    <div id='yc_mission_title'>최종 목표 평가일</div>
                                                    <div id='yc_input_box'><input placeholder='YYYY-MM-DD' /></div>
                                                </div>
                                                <div>
                                                    <button onClick={handleAddFinalGoalImage}>이미지 추가</button>
                                                </div>
                                            </div>

                                            <div id="yc_mission_img">
                                                {finalGoalImages.map((image, index) => (
                                                    <div key={index} style={{ position: 'relative' }}>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFinalGoalImageChange(index, e)}
                                                            style={{ display: 'none' }}
                                                            id={`yc_imageInput-final-${index}`}
                                                        />
                                                        <label htmlFor={`yc_imageInput-final-${index}`} style={{ display: 'block', cursor: 'pointer' }}>
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

                                            <div id="yc_mission_textarea">
                                                <textarea placeholder="인증 방법을 입력해주세요"></textarea>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* 미션 유의 사항 */}
                                <div id='yc_mission_content'>
                                    <div>
                                        <h2>미션에 대한 유의사항을 적어주세요.</h2>
                                        <h4>미션 인증 방법에 대해 구체적인 추가사항을 적을 수 있습니다.</h4>
                                        <div id='yc_mission_textarea'>
                                            <textarea>이곳에 입력하세요.</textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* //yc_list */}

                            <div className="yc_btn">
                                <button 
                                    id="yc_primary" 
                                    onClick={() => onSave()}
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                        {/* //yc_board */}
                    </div>
                    {/* //yc_step6 */}
                </div>
                {/* //yc_container */}
            </div>
            {/* //yc_jy_step */}
        </>
    );

};

export default Step06;
