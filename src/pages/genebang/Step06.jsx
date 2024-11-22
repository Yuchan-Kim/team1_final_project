import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step06 = ({ onNext, onPrevious }) => {
    const navigate = useNavigate();
    const authUserNum = 10;

    const [roomNum, setRoomNum] = useState();

    const [selectedMissionIndex, setSelectedMissionIndex] = useState(null);
    const [missions, setMissions] = useState([{ id: 1, title: '미션 1', inputCount: 1, imagePreviews: [null], imageFiles: [] }]);
    
    const [isFinalGoalActive, setIsFinalGoalActive] = useState(false);
    const [finalGoalImages, setFinalGoalImages] = useState([null]);

    //미션 유의사항
    const [missionInstruction, setMissionInstruction] = useState(''); 


    // 최종 목표 활성화/비활성화 토글
    const toggleFinalGoalActivation = () => {
        setIsFinalGoalActive(prevState => !prevState);
    };

    // const handleLogoImageChange = (e, setPreview) => {
    //     const logoFile = e.target.files[0];
    //     if (logoFile) {
    //         setLogoFile(logoFile)
    //         const pimageUrl = URL.createObjectURL(logoFile);
    //         setLogoPreview(pimageUrl);
    //         updateVenderData({ logoPreview:pimageUrl});
    //     }
    // };

    // 미션 이미지 변경
    const handleImageChange = (missionId, index, e) => {
        const file = e.target.files[0];  // 선택한 파일을 가져옵니다.
        if (file) {
            setMissions(missions.map(mission => {
                if (mission.id === missionId) {
                    const updatedImagePreviews = [...mission.imagePreviews];
                    updatedImagePreviews[index] = URL.createObjectURL(file);
                    
                    const updatedImageFiles = [...mission.imageFiles];
                    updatedImageFiles[index] = file;
                    return { ...mission, imagePreviews: updatedImagePreviews , imageFiles : updatedImageFiles };
                }
                return mission;
            }));
        }
    };
    // const handleImageChange = (missionId, index, e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setMissions(missions.map(mission => {
    //                 if (mission.id === missionId) {
    //                     const updatedImagePreviews = [...mission.imagePreviews];
    //                     updatedImagePreviews[index] = reader.result;
    //                     return { ...mission, imagePreviews: updatedImagePreviews };
    //                 }
    //                 return mission;
    //             }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // 미션 이미지 삭제
    const handleImageDelete = (missionId, index) => {
        setMissions(missions.map(mission => {
            if (mission.id === missionId) {
                const updatedImagePreviews = mission.imagePreviews.filter((_, i) => i !== index);
                const updatedImageFiles = mission.imageFiles.filter((_, i) => i !== index);

                const updatedInputCount = mission.inputCount - 1;
                return { ...mission, imagePreviews: updatedImagePreviews, inputCount: updatedInputCount , imageFiles : updatedImageFiles };
            }
            return mission;
        }));
    };

    // 미션 이미지 추가
    const handleAddImageInput = (missionId) => {
        setMissions(missions.map(mission => {
            if (mission.id === missionId && mission.inputCount < 3) {
                return { ...mission, inputCount: mission.inputCount + 1, imagePreviews: [...mission.imagePreviews, null] , imageFiles: [...mission.imageFiles, null]  };
            }
            return mission;
        }));
    };

    // 미션 추가
    const handleAddMission = () => {
        if (missions.length < 4) {
            setMissions([...missions, { id: missions.length + 1, title: `미션 ${missions.length + 1}`, inputCount: 1, imagePreviews: [null] , imageFiles: []}]);
        }
    };

    // 미션 삭제
    const handleDeleteMission = (missionId) => {
        if (missionId !== 1) { // 첫 번째 미션은 삭제할 수 없도록 함
            setMissions(missions.filter(mission => mission.id !== missionId));
        }
    };

    // 최종 목표 이미지 변경
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

    // 최종 목표 이미지 추가
    const handleAddFinalGoalImage = () => {
        if (finalGoalImages.length < 3) {
            setFinalGoalImages([...finalGoalImages, null]);
        }
    };

    // 미션 선택
    const handleSelectMission = (index) => {
        setSelectedMissionIndex(index);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        // roomNum과 missionInstruction 전송
        formData.append('roomNum', roomNum);
        formData.append('missionInstruction', missionInstruction);

        const data = [];
        
        missions.forEach((mission, index) => {

            // imageFiles 배열의 각 파일을 개별적으로 추가
            mission.imageFiles.forEach((file, fileIndex) => {
                data.push({
                    id: mission.id,
                    title : mission.title,
                    imgCnt : fileIndex + 1,
                });
                formData.append('file',file);
            });
        });

        const blob = new Blob([JSON.stringify(data)], {type: "application/json"}) ;
        formData.append("data",blob);

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
    
        // 서버로 POST 요청
        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step6`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(response => {
            console.log(response);
            navigate('/genebang/step7');
        })
        .catch(error => {
            console.error(error);
            alert('생성 중 오류가 발생했습니다.');
        });
    };

    useEffect( ()=>{

        axios({

            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/genebang/checkroom/${authUserNum}`,

            responseType: 'json' //수신타입
        }).then(response => {
            console.log(response.data); //수신데이타
            setRoomNum( response.data.apiData );
            console.log(roomNum);

        }).catch(error => {
            console.log(error);
            alert('생성 중인 방이 없습니다')
            navigate('/');

        });


    }, [] );













    return (
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step6">
                    <StepNav idx={6} />

                    <form onSubmit={handleSubmit} encType="multipart/form-data">


                        <div id="board">
                            <div id="list">
                                {/* 미션 추가 버튼 */}
                                <div id="mission-btn-plus">
                                    <div id="mission-btn">
                                        <button type="button" onClick={handleAddMission}>미션 추가</button>
                                    </div>
                                </div>

                                {/* 미션 입력 */}
                                <div id="mission-input">
                                    <div className="jm-todo-user-add-form">
                                        <h2>미션 제출하기</h2>
                                        <div className="jm-mission-add-list">
                                            {missions.map((mission, index) => (
                                                <div className="jm-mission-add-item" key={mission.id}>
                                                    <div className="jm-mission-items_tit">
                                                        <input
                                                            type="text"
                                                            placeholder="미션 제목"
                                                            value={mission.title}
                                                            onChange={(e) => {
                                                                const updatedMissions = missions.map(m => m.id === mission.id ? { ...m, title: e.target.value } : m);
                                                                setMissions(updatedMissions);
                                                            }}
                                                            className={`jm-mission-items`}
                                                            onClick={() => handleSelectMission(index)}
                                                        />
                                                        <div className="jm-view-button-container">
                                                            <button type="button" className="closeBtn" onClick={() => handleDeleteMission(mission.id)}>X</button>
                                                        </div>
                                                    </div>

                                                    <div className="jm-user-mission-add-fom">
                                                        <div className="jm-add-mission-img-form">
                                                            {/* 이미지 업로드 */}
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
                                                                    {/* 첫 번째 이미지는 삭제 버튼이 나타나지 않도록 조건 추가 */}
                                                                    {imgIndex > 0 && preview && (
                                                                        <button type="button"
                                                                            className="jm-file-delete-btn"
                                                                            onClick={() => handleImageDelete(mission.id, imgIndex)}
                                                                        >
                                                                            &times;
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* 이미지 추가 버튼 */}
                                                        {mission.inputCount < 3 && (
                                                            <button  type="button" className="jm-add-file-button" onClick={() => handleAddImageInput(mission.id)}>+</button>
                                                        )}
                                                    </div>

                                                    <div className="mission-textarea">
                                                        <textarea placeholder="인증 방법을 입력해주세요"></textarea>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 최종 목표 설정 */}
                                <div id="mission" key="final-goal">
                                    <div id="mission-head">
                                        <h2>최종 목표를 설정 하시겠습니까?</h2>
                                        <h4>생성된 방에 대한 최종 목표를 설정할 수 있습니다. 그리고 최종 목표는 방장이 평가합니다.</h4>
                                        <div>
                                            <button id="finalgoal-button" onClick={toggleFinalGoalActivation}>
                                                {isFinalGoalActive ? '최종 목표 비활성화' : '최종 목표 활성화'}
                                            </button>
                                        </div>
                                    </div>

                                    {isFinalGoalActive && (
                                        <div>
                                            <div className="input-button-group">
                                                <div>
                                                    <div id="mission-title ">최종 목표 설정 (100자 이내)</div>
                                                    <div id="input-box"><input placeholder="최종 목표를 입력하세요" /></div>
                                                </div>
                                                <div>
                                                    <div id="mission-title">최종 목표 평가일</div>
                                                    <div id="input-box"><input placeholder="YYYY-MM-DD" /></div>
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
                                        </div>
                                    )}
                                </div>

                                {/* 미션 유의 사항 */}
                                <div id="mission-content">
                                    <div>
                                        <h2>미션에 대한 유의사항을 적어주세요.</h2>
                                        <h4>미션 인증 방법에 대해 구체적인 추가사항을 적을 수 있습니다.</h4>
                                        <div id="mission-textarea">
                                            <textarea
                                                placeholder='이곳에 입력하세요.'
                                                onChange={(e) => setMissionInstruction(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 네비게이션 버튼 */}
                            <div className="btn">
                                <button id="secondary" onClick={onPrevious}>이전</button>
                                <button
                                    type="submit"
                                    id="primary"
                                    onClick={onNext}
                                    disabled={missions.length === 0 || !missions.every(m => m.inputCount > 0)}  // 모든 미션에 이미지가 추가되어야만 활성화
                                    className={missions.length === 0 || !missions.every(m => m.inputCount > 0) ? 'disabled' : ''}
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    </form>



                </div>
            </div>
        </div>
    );
};

export default Step06;
