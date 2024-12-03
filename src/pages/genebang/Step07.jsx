import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { StepNav } from '../include/StepNav';
import Footert from "../include/JM-Footer.jsx";

import '../../css/reset.css';
import '../css/Step07.css';

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

    // 이미지 추가 버튼 핸들러
    const handleAddImageInput = (missionId) => {
        setMissions((prevMissions) =>
            prevMissions.map((mission) => {
                if (mission.id === missionId) {
                    if (mission.imageFiles.length >= 3) {
                        alert('이미지는 최대 3개까지 추가할 수 있습니다.');
                        return mission; // 아무 변화도 없이 반환
                    }
                    return {
                        ...mission,
                        imagePreviews: [...mission.imagePreviews, null],
                        imageFiles: [...mission.imageFiles, null],
                    };
                }
                return mission;
            })
        );
    };
    // 이미지 삭제 버튼 핸들러
    const handleRemoveImage = (missionId, index) => {
        setMissions((prevMissions) =>
            prevMissions.map((mission) => {
                if (mission.id === missionId) {
                    const updatedImagePreviews = mission.imagePreviews.filter((_, i) => i !== index);
                    const updatedImageFiles = mission.imageFiles.filter((_, i) => i !== index);
                    return { ...mission, imagePreviews: updatedImagePreviews, imageFiles: updatedImageFiles };
                }
                return mission;
            })
        );
    };

    // 미션 추가 버튼 핸들러
    const handleAddMission = () => {
        setMissions((prevMissions) => {
            if (prevMissions.length >= 4) {
                alert('최대 4개의 미션만 추가할 수 있습니다.');
                return prevMissions;
            }
            return [
                ...prevMissions,
                {
                    id: prevMissions.length + 1,
                    title: '',
                    missionName: '새로운 미션 제목',
                    imagePreviews: [null],
                    imageFiles: [],
                    method: '',
                },
            ];
        });
    };

    // 미션 삭제 버튼 핸들러
    const handleRemoveMission = (missionId) => {
        setMissions((prevMissions) =>
            prevMissions.filter((mission) => mission.id !== missionId)
        );
    };

    // AI 추천 미션 가져오기
    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/genebang/generatePlaceholder/${roomNum}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const initialMissions = response.data.apiData || [];
                setMissions(
                    initialMissions.map((mission, index) => ({
                        id: index + 1,
                        title: '',
                        missionName: mission.missionName || '새로운 미션 제목',
                        imagePreviews: [null],
                        imageFiles: [],
                        method: '',
                    }))
                );
            } catch (error) {
                console.error('Failed to fetch missions:', error);
            }
        };

        fetchMissions();
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
        <div id="jm-step7" className="jm-step7-wrap">
            <div id="jm-step7-container">
                <div className="jm-step7-step" id="jm-step7-step">
                    <StepNav idx={7} />
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div id="jm-step7-board">
                            <div id="jm-step7-list">
                                <div id="jm-step7-mission-btn-plus">
                                    <div id="jm-step7-mission-btn">
                                        <button type="button" onClick={handleAddMission}>미션 추가</button>
                                    </div>
                                </div>
                                <div id="jm-step7-mission-input">
                                    <div className="jm-step7-todo-user-add-form">
                                        <h2>미션 생성하기</h2>
                                        <div className="jm-step7-mission-add-list">
                                            {missions.map((mission, index) => (
                                                <div className="jm-step7-mission-add-item" key={mission.id}>
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            className="jm-step7-remove-mission-button"
                                                            onClick={() => handleRemoveMission(mission.id)}
                                                        >x
                                                        </button>
                                                    )}
                                                    <input
                                                        type="text"
                                                        placeholder={mission.missionName}
                                                        value={mission.title}
                                                        onChange={(e) => {
                                                            setMissions((prevMissions) =>
                                                                prevMissions.map((m) =>
                                                                    m.id === mission.id ? { ...m, title: e.target.value } : m
                                                                )
                                                            );
                                                        }}
                                                        className="jm-step7-mission-items"
                                                    />
                                                    <div className="jm-step7-add-mission-img-form">
                                                        {mission.imagePreviews.map((preview, imgIndex) => (
                                                            <div key={imgIndex} className="jm-step7-file-upload">
                                                                <label htmlFor={`file-input-${mission.id}-${imgIndex}`} className="jm-step7-file-label">
                                                                    {preview ? (
                                                                        <img src={preview} alt={`Preview ${imgIndex}`} className="jm-step7-image-preview" />
                                                                    ) : (
                                                                        <span className="jm-step7-placeholder-text">이미지 선택</span>
                                                                    )}
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id={`file-input-${mission.id}-${imgIndex}`}
                                                                    className="jm-step7-hidden-file-input"
                                                                    onChange={(e) => handleImageChange(mission.id, imgIndex, e)}
                                                                />
                                                                {imgIndex > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        className="jm-step7-file-delete-btn"
                                                                        onClick={() => handleRemoveImage(mission.id, imgIndex)}
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                         <button
                                                        type="button"
                                                        className="jm-step7-add-file-button"
                                                        onClick={() => handleAddImageInput(mission.id)}
                                                        disabled={mission.imageFiles.length >= 3}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <textarea
                                                        className='jm-step7-mission-text-box'
                                                        value={mission.method}
                                                        placeholder="인증 방법을 입력해주세요 100자 이내)"
                                                        onChange={(e) => {
                                                            setMissions((prevMissions) =>
                                                                prevMissions.map((m) =>
                                                                    m.id === mission.id ? { ...m, method: e.target.value } : m
                                                                )
                                                            );
                                                        }}
                                                    ></textarea>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div id="jm-step7-mission-content">
                                    <textarea
                                        placeholder="이곳에 입력하세요."
                                        value={missionInstruction}
                                        onChange={(e) => setMissionInstruction(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="jm-step7-btn">
                                <button id="jm-step7-secondary" onClick={() => navigate(`/genebang/step6/${roomNum}`)}>이전</button>
                                <button type="submit" id="jm-step7-primary">다음</button>
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