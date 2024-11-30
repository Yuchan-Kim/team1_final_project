import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav';
import Header from '../include/DH_Header';
import Footert from "../include/JM-Footer.jsx";

const Step07 = ({ onNext, onPrevious }) => {
    const { roomNum } = useParams();
    const navigate = useNavigate();
    const [aiChallenges, setAiChallenges] = useState([]); // AI 추천 챌린지 데이터
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [missionInstruction, setMissionInstruction] = useState('');
    const [missions, setMissions] = useState([]); // 미션 리스트

    const handleImageChange = (missionId, index, e) => {
        const file = e.target.files[0];
        if (file) {
            setMissions(missions.map(mission => {
                if (mission.id === missionId) {
                    const updatedImagePreviews = [...mission.imagePreviews];
                    updatedImagePreviews[index] = URL.createObjectURL(file);

                    const updatedImageFiles = [...mission.imageFiles];
                    updatedImageFiles[index] = file;
                    return { ...mission, imagePreviews: updatedImagePreviews, imageFiles: updatedImageFiles };
                }
                return mission;
            }));
        }
    };

    const handleAddImageInput = (missionId) => {
        setMissions(missions.map(mission => {
            if (mission.id === missionId && mission.inputCount < 3) {
                return { 
                    ...mission, 
                    inputCount: mission.inputCount + 1, 
                    imagePreviews: [...mission.imagePreviews, null], 
                    imageFiles: [...mission.imageFiles, null] 
                };
            }
            return mission;
        }));
    };

    // 미션 추가 버튼 핸들러
    const handleAddMission = () => {
        if (missions.length < 4) {
            setMissions([...missions, { 
                id: missions.length + 1, 
                title: '', 
                placeholder: '새로운 미션 제목', // Placeholder 기본 값
                inputCount: 1, 
                imagePreviews: [null], 
                imageFiles: [], 
                method: '' 
            }]);
        } else if (missions.length >= 4) {
            alert('최대 4개의 미션만 추가할 수 있습니다.');
        }
    };

    // 미션 삭제 버튼 핸들러
    const handleRemoveMission = (missionId) => {
        if (missions.length > 1) {
            setMissions(missions.filter(mission => mission.id !== missionId));
        }
    };

    // AI 추천 미션 가져오기
    useEffect(() => {
        const fetchDataAndGenerateChallenges = async () => {
            try {
                setLoading(true);
                const aiResponse = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/genebang/generatePlaceholder/${roomNum}`,
                    {}, // 빈 본문 전송
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const challenges = aiResponse.data.apiData; // 서버에서 전달된 missionName 리스트
                console.log('AI 생성된 챌린지: ', challenges);

                // AI 챌린지를 고유 ID와 함께 저장
                const challengesWithId = challenges.map((challenge, index) => ({
                    missionName: challenge.missionName, // 전달받은 missionName
                    id: index + 1, // 고유 ID 추가
                }));

                setAiChallenges(challengesWithId);

                // missions 초기화: 첫 번째 missionName을 포함한 기본 데이터 세팅
                setMissions(
                    challengesWithId.map((challenge) => ({
                        id: challenge.id,
                        title: '',
                        missionName: challenge.missionName || '새로운 미션 제목',
                        inputCount: 1,
                        imagePreviews: [null],
                        imageFiles: [],
                        method: '',
                    }))
                );

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('챌린지 생성 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchDataAndGenerateChallenges();
    }, [roomNum]);

    // 유의사항 저장 + 미션 등록
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("로그인이 필요합니다.");
                navigate('/login');
                return;
            }

            const roomData = new URLSearchParams();
            roomData.append('roomNum', roomNum);
            roomData.append('missionInstruction', missionInstruction);

            const roomResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/genebang/saveInstruction`,
                roomData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (roomResponse.data.result !== 'success') {
                alert(`유의사항 저장 실패: ${roomResponse.data.message}`);
                return;
            }

            for (const mission of missions) {
                const formData = new FormData();
                formData.append('roomNum', roomNum);
                formData.append('missionName', mission.title || mission.placeholder);
                formData.append('missionMethod', mission.method);
                formData.append('missionTypeNum', 1);

                mission.imageFiles.forEach((file, index) => {
                    if (file) {
                        formData.append(`files`, file);
                    }
                });

                const missionResponse = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/genebang/saveMission`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (missionResponse.data.result !== 'success') {
                    alert(`미션 저장 실패: ${missionResponse.data.message}`);
                    return;
                }
            }

            alert("모든 데이터가 성공적으로 저장되었습니다.");
            navigate(`/genebang/step8/${roomNum}`);
        } catch (error) {
            console.error("데이터 전송 중 오류 발생:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step6">
                    <StepNav idx={7} />
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div id="board">
                            <div id="list">
                                <div id="mission-btn-plus">
                                    <div id="mission-btn">
                                        <button type="button" onClick={handleAddMission}>미션 추가</button>
                                    </div>
                                </div>
                                <div id="mission-input">
                                    <div className="jm-todo-user-add-form">
                                        <h2>미션 제출하기</h2>
                                        <div className="jm-mission-add-list">
                                            {missions.map((mission, index) => (
                                                <div className="jm-mission-add-item" key={mission.id}>
                                                    <input
                                                        type="text"
                                                        placeholder={mission.missionName}
                                                        value={mission.title}
                                                        onChange={(e) => {
                                                            const updatedMissions = missions.map(m => 
                                                                m.id === mission.id ? { ...m, title: e.target.value } : m
                                                            );
                                                            setMissions(updatedMissions);
                                                        }}
                                                        className="jm-mission-items"
                                                    />
                                                    <div className="jm-add-mission-img-form">
                                                        {mission.imagePreviews.map((preview, imgIndex) => (
                                                            <div key={imgIndex} className="jm-file-upload">
                                                                <label htmlFor={`file-input-${mission.id}-${imgIndex}`} className="jm-file-label">
                                                                    {preview ? (
                                                                        <img src={preview} alt={`Preview ${imgIndex}`} className="jm-image-preview" />
                                                                    ) : (
                                                                        <span className="jm-placeholder-text">이미지 선택</span>
                                                                    )}
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id={`file-input-${mission.id}-${imgIndex}`}
                                                                    className="jm-hidden-file-input"
                                                                    onChange={(e) => handleImageChange(mission.id, imgIndex, e)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="jm-add-file-button"
                                                        onClick={() => handleAddImageInput(mission.id)}
                                                    >
                                                        이미지 추가
                                                    </button>
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            className="jm-remove-mission-button"
                                                            onClick={() => handleRemoveMission(mission.id)}
                                                        >
                                                            미션 삭제
                                                        </button>
                                                    )}
                                                    <textarea
                                                        value={mission.method}
                                                        placeholder="인증 방법을 입력해주세요"
                                                        onChange={(e) => {
                                                            const updatedMissions = missions.map(m => 
                                                                m.id === mission.id ? { ...m, method: e.target.value } : m
                                                            );
                                                            setMissions(updatedMissions);
                                                        }}
                                                    ></textarea>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div id="mission-content">
                                    <textarea
                                        placeholder='이곳에 입력하세요.'
                                        value={missionInstruction}
                                        onChange={(e) => setMissionInstruction(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="btn">
                            <button id="secondary" onClick={() => navigate(`/genebang/step6/${roomNum}`)}>이전</button>
                                <button type="submit" id="primary">다음</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Footert/>
        </>
    );
};

export default Step07;