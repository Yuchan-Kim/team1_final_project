import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

const Step06 = () => {

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/genebang/step10');
    };
    const handleNext = () => {
        navigate('/genebang/step7');
    };

    // 미리보기 이미지를 저장할 상태
    const [missions, setMissions] = useState([{ id: 1, inputCount: 1, imagePreviews: [null] }]);

    // 파일 선택 시 이미지 미리보기 업데이트
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

    // 이미지 삭제 함수
    const handleImageDelete = (missionId, index) => {
        setMissions(missions.map(mission => {
            if (mission.id === missionId) {
                const updatedImagePreviews = [...mission.imagePreviews];
                updatedImagePreviews[index] = null;  // 해당 인덱스의 이미지를 삭제
                return { ...mission, imagePreviews: updatedImagePreviews };
            }
            return mission;
        }));
    };

    // "이미지 추가" 버튼 클릭 시 input 필드 하나 추가
    const handleAddImageInput = (missionId) => {
        setMissions(missions.map(mission => {
            if (mission.id === missionId && mission.inputCount < 5) {
                return { ...mission, inputCount: mission.inputCount + 1, imagePreviews: [...mission.imagePreviews, null] };
            }
            return mission;
        }));
    };

    // "미션 추가" 버튼 클릭 시 새로운 미션을 추가 (최대 3개)
    const handleAddMission = () => {
        if (missions.length < 3) {
            setMissions([
                ...missions,
                { id: missions.length + 1, inputCount: 1, imagePreviews: [null] } // 새 미션 추가
            ]);
        }
    };

    // 미션 삭제 함수 (미션 1은 삭제되지 않도록 조건 추가)
    const handleDeleteMission = (missionId) => {
        if (missionId !== 1) { // 미션 1은 삭제하지 않도록
            setMissions(missions.filter(mission => mission.id !== missionId));
        }
    };

    return (
        <>
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div className="step" id="step6">
                        <StepNav idx={6} />

                        <div id="board">
                            <div id="list">
                                {/* 미션 리스트 */}
                                {missions.map((mission, missionIndex) => (
                                    <div id="mission" key={mission.id}>
                                        <div className="mission-header">
                                            <div>
                                                <h2>{`미션 ${missionIndex + 1} 생성`}</h2> {/* 미션 번호 표시 */}
                                                <h4>미션은 최대 3개까지 생성할 수 있습니다.</h4>
                                            </div>

                                            {/* 미션 추가/삭제 버튼 */}
                                            <div id="mission-btn-list">
                                                {/* 미션 추가 버튼 */}
                                                <div id="mission-btn">
                                                    <button onClick={handleAddMission}>미션 추가</button>
                                                </div>

                                                {/* 미션 삭제 버튼 (미션 1은 삭제할 수 없음) */}
                                                {mission.id !== 1 && (
                                                    <div id="mission-btn">
                                                        <button onClick={() => handleDeleteMission(mission.id)}>미션 삭제</button>
                                                    </div>
                                                )}

                                            </div>
                                            {/* //미션 추가/삭제 버튼 */}


                                        </div>

                                        <div className="input-button-group">
                                            <div id="input-box">
                                                <input placeholder="AI 추천 미션" />
                                            </div>
                                            <div>
                                                <button onClick={() => handleAddImageInput(mission.id)}>이미지 추가</button>
                                            </div>
                                        </div>

                                        <div id="mission-img">
                                            {/* 동적으로 input 필드를 렌더링 */}
                                            {[...Array(mission.inputCount)].map((_, index) => (
                                                <div key={index} style={{ position: 'relative' }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(mission.id, index, e)}
                                                        style={{ display: 'none' }}
                                                        id={`imageInput-${mission.id}-${index}`}
                                                    />
                                                    <label htmlFor={`imageInput-${mission.id}-${index}`} style={{ display: 'block', cursor: 'pointer' }}>
                                                        {/* 이미지 미리보기 */}
                                                        {mission.imagePreviews[index] ? (
                                                            <div style={{ position: 'relative' }}>
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
                                                                <button
                                                                    onClick={() => handleImageDelete(mission.id, index)}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '5px',
                                                                        right: '5px',
                                                                        background: 'rgba(255, 0, 0, 0.5)',
                                                                        border: 'none',
                                                                        borderRadius: '50%',
                                                                        color: '#fff',
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        fontSize: '14px',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
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
                                                    </label>
                                                </div>
                                            ))}
                                        </div>

                                        <div id="mission-textarea">
                                            <textarea placeholder="인증 방법을 입력해주세요"></textarea>
                                        </div>
                                    </div>
                                ))}
                                {/* //미션 리스트 */}

                                {/* 최종 목표 설정 부분은 한 번만 출력 */}
                                <div id='mission' key="final-goal">
                                    <div id='mission-head'>
                                        <h2>최종 목표를 설정 하시겠습니까?</h2>
                                        <h4>생성된 방에 대한 최종 목표를 설정할 수 있습니다. 그리고 최종 목표는 방장이 평가합니다.</h4>
                                    </div>

                                    <div className='input-button-group'>
                                        <div>
                                            <div id='mission-title '>최종 목표 설정 (100자 이내)</div>
                                            <div id='input-box'><input placeholder='value' /></div>
                                        </div>
                                        <div>
                                            <div id='mission-title'>최종 목표 평가일</div>
                                            <div id='input-box'><input placeholder='value' /></div>
                                        </div>
                                        <div>
                                            <button>이미지 추가</button>
                                        </div>
                                    </div>

                                    <div id="mission-img">
                                        {/* 이미지 미리보기 */}
                                        {[...Array(1)].map((_, index) => (
                                            <div key={index} style={{ position: 'relative' }}>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id={`imageInput-final-${index}`}
                                                />
                                                <label htmlFor={`imageInput-final-${index}`} style={{ display: 'block', cursor: 'pointer' }}>
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
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div id="mission-textarea">
                                        <textarea placeholder="인증 방법을 입력해주세요"></textarea>
                                    </div>
                                </div>
                                {/* //최종 목표 설정 */}

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
                                {/* //미션 유의 사항 */}


                            </div>

                            <div className="btn">
                                <button id="seconday" onClick={handleCancel}>취소</button>
                                <button id="primary" onClick={handleNext}>다음</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step06;
