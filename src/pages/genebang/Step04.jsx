import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { StepNav } from '../include/StepNav'; // StepNav 임포트
import Footert from "../include/JM-Footer.jsx";

import '../../css/reset.css';
import '../css/Step04.css';

const Step04 = () => {
    const navigate = useNavigate();
    const { roomNum } = useParams(); // URL에서 roomNum 추출

    const [regions, setRegions] = useState([]); // 지역 데이터
    const [maxParticipants, setMaxParticipants] = useState(''); // 최대인원
    const [minParticipants, setMinParticipants] = useState(''); // 최소인원
    const [entryPoint, setEntryPoint] = useState(50); // 입장포인트 기본값 50
    const [isHonestyEnabled, setIsHonestyEnabled] = useState(false); // 성실도 활성화 여부
    const [honestyScore, setHonestyScore] = useState(''); // 입장 성실도
    const [region, setRegion] = useState(''); // 지역 선택
    const [roomType, setRoomType] = useState(null); // 방 타입 저장
    const [userPoints, setUserPoints] = useState(0); // 유저 보유 포인트
    const [userScore, setUserScore] = useState(0); // 유저 보유 포인트


    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        if (!entryPoint || !maxParticipants || !minParticipants) {
            return false;
        }
        if (isHonestyEnabled && !honestyScore) {
            return false;
        }
        return true;
    };

    // 포인트 입력 필드 제한
    const handleEntryPointChange = (e) => {
        const value = e.target.value.trim(); // 입력값 가져오기
    
        // 사용자가 입력을 비우면 허용 (중간 입력 단계)
        if (value === "") {
            setEntryPoint(""); 
            return;
        }
    
        // 숫자인 경우만 처리
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue)) {
            setEntryPoint(numericValue);
        }
    };
    
    const handleEntryPointBlur = () => {
        // 포커스를 벗어났을 때 유효성 검사 실행
        if (entryPoint === "" || entryPoint < 50) {
            alert("입력값은 최소 50 이상이어야 합니다.");
            setEntryPoint(50); // 최소값으로 설정
        } else if (entryPoint > userPoints) {
            alert(`입력한 포인트가 보유한 포인트를 초과했습니다. 최대 ${userPoints}으로 설정됩니다.`);
            setEntryPoint(userPoints); // 최대값으로 설정
        }
    };

// 성실도 입력 필드 제한
const handleHonestyScoreChange = (e) => {
    const value = e.target.value; // 문자열로 입력값 가져오기
    if (!/^\d*\.?\d*$/.test(value)) { // 숫자와 소수점만 허용하는 정규식
        return;
    }

    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue > userScore) {
        alert(`입력한 성실도가 보유한 성실도를 초과했습니다. 최대 ${userScore}으로 설정됩니다.`);
        setHonestyScore(userScore.toFixed(2)); // 최대값으로 설정
        return;
    }

    setHonestyScore(value); // 유효한 값만 설정
};

    // 지역 변경 핸들러
    const handleRegionChange = (e) => {
        setRegion(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!isNextEnabled()) {
            alert("모든 필드를 입력하세요.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
    
        try {
            // Axios 요청
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/genebang/step4`, // API URL
                null, // POST 요청 본문 없이 쿼리 파라미터로 전송
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더 추가
                        'Content-Type': 'application/x-www-form-urlencoded', // 쿼리 파라미터 전송
                    },
                    params: {
                        roomNum: parseInt(roomNum, 10), // URL에서 추출한 roomNum 사용
                        roomMaxNum: parseInt(maxParticipants, 10), // 최대 참여 인원
                        roomMinNum: parseInt(minParticipants, 10), // 최소 참여 인원
                        roomEnterPoint: parseInt(entryPoint, 10), // 입장 포인트
                        roomEnterRate: isHonestyEnabled ? parseInt(honestyScore, 10) : 0, // 성실도
                        regionNum: parseInt(region, 10), // 지역 번호
                    },
                }
            );
    
            // 응답 처리
            if (response.data.result === 'success') {
                alert("상세정보가 성공적으로 저장되었습니다.");
                navigate(`/genebang/step5/${roomNum}`); // 다음 스텝으로 이동
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error("데이터 전송 중 오류 발생:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };
    

    // 지역 데이터 가져오기
    const getRegions = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/Regions`)
            .then(response => {
                if (response.data && Array.isArray(response.data.apiData)) {
                    setRegions(response.data.apiData);
                } else {
                    console.error('지역 데이터가 올바르지 않습니다.');
                    setRegions([]);
                }
            })
            .catch(error => {
                console.error('지역 데이터 가져오기 중 오류 발생:', error);
                setRegions([]);
            });
    };

    // 방 타입 가져오기
    const getRoomType = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/step4/roomType/${roomNum}`);
            if (response.data && response.data.result === 'success') {
                const roomTypeNum = response.data.apiData; // roomTypeNum 데이터 추출
                console.log("받은 roomTypeNum:", roomTypeNum);
                setRoomType(roomTypeNum); // 상태 업데이트
            } else {
                console.error('방 타입 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('방 타입 데이터 가져오기 중 오류 발생:', error);
        } finally {
           
        }
    };

    // 유저 포인트 가져오기
    const getUserPoints = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/room/points`,
                {   headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더 추가
                    },
                }
            );
            if (response.data && response.data.result === 'success') {
                setUserPoints(response.data.apiData);
            } else {
                console.error('유저 포인트 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('유저 포인트 데이터 가져오기 중 오류 발생:', error);
        }
    };

    // 유저 성실도 가져오기
    const getUserScore = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/room/score`,
                {   headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더 추가
                    },
                }
            );
            if (response.data && response.data.result === 'success') {
                setUserScore(response.data.apiData);
            } else {
                console.error('유저 포인트 정보를 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('유저 포인트 데이터 가져오기 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        // 지역 데이터 가져오기
        getRegions();
        // 방 타입 가져오기
        getRoomType();
        // 유저 포인트 가져오기
        getUserPoints();
        // 유저 성실도 가져오기
        getUserScore();
    }, []);

    return (
        <>
        <div id="jm-step4" className="jm-step4-wrap">
            <div id="jm-step4-container">
                <div className="jm-step4-step">
                    <StepNav idx={4} /> {/* StepNav 포함 */}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div id="jm-step4-board">
                            <div id="jm-step4-list">
                                <h2>세부 설정</h2>
                                <h4>방에 필요한 세부적인 설정을 할 수 있습니다.</h4>

                                {/* 인원 설정 */}
                                <div id="jm-step4-member-count">
                                    <h3>인원 설정</h3>
                                    <div id="jm-step4-box-double">
                                        {/* 최대 참여 인원 설정 */}
                                        <div className='jm-step4-maxuser'>
                                            <label>최대 참여 인원</label>
                                            <select
                                                value={maxParticipants}
                                                onChange={(e) => {
                                                    setMaxParticipants(e.target.value);
                                                    if (parseInt(minParticipants, 10) > parseInt(e.target.value, 10)) {
                                                        setMinParticipants(''); // 최소 참여 인원이 최대 참여 인원보다 클 경우 초기화
                                                    }
                                                }}
                                            >
                                                <option value="">선택</option>
                                                {[...Array(19)].map((_, i) => (
                                                    <option key={i + 2} value={i + 2}>
                                                        {i + 2}명
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* 최소 참여 인원 설정 */}
                                        <div className='jm-step4-minuser'>
                                            <label>최소 참여 인원</label>
                                            <select
                                                value={minParticipants}
                                                onChange={(e) => setMinParticipants(e.target.value)}
                                                disabled={!maxParticipants} // 최대 참여 인원이 선택되지 않으면 비활성화
                                            >
                                                <option value="">선택</option>
                                                {maxParticipants &&
                                                    [...Array(parseInt(maxParticipants, 10) - 1)].map((_, i) => (
                                                        <option key={i + 2} value={i + 2}>
                                                            {i + 2}명
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* 입장 포인트 설정 */}
                                {roomType !== 1 && (
                                    <div id="jm-step4-box2">
                                        <h3>입장 포인트 설정</h3>
                                        <input
                                            placeholder={`최대 ${userPoints} pt`}
                                            value={roomType === 1 ? '' : entryPoint} // 룸 넘버가 1이면 비워둠
                                            onChange={handleEntryPointChange}
                                            onBlur={(e) => {
                                                if (roomType === 1) {
                                                    setEntryPoint(null); // 룸 넘버가 1일 경우 null로 설정
                                                } else {
                                                    handleEntryPointBlur(e);
                                                }
                                            }}
                                        />
                                    </div>
                                )}

                                {/* 입장 성실도 설정 */}
                                {roomType !== 1 && (
                                    <div>
                                        <h3>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={roomType === 1 ? false : isHonestyEnabled} // 룸 넘버가 1이면 항상 false
                                                    onChange={() => {
                                                        if (roomType !== 1) {
                                                            setIsHonestyEnabled(!isHonestyEnabled);
                                                        }
                                                    }}
                                                />
                                                입장 성실도 설정
                                            </label>
                                        </h3>
                                        <input
                                            className='jm-step4-Score'
                                            placeholder={`최대 ${userScore}`}
                                            value={roomType === 1 ? '' : honestyScore} // 룸 넘버가 1이면 비워둠
                                            onChange={handleHonestyScoreChange}
                                            disabled={!isHonestyEnabled || roomType === 1} // 룸 넘버가 1일 경우 항상 비활성화
                                        />
                                    </div>
                                )}
                                
                                {/* 지역 설정 */}
                                <div id="jm-step4-box3">
                                    <h3>지역 설정</h3>
                                    <select value={region} onChange={handleRegionChange}>
                                        <option value="">지역 선택</option>
                                        {regions.map((region) => (
                                            <option key={region.regionNum} value={region.regionNum}>
                                                {region.regionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="jm-step4-btn">
                                <button id="jm-step4-secondary" onClick={() => navigate(`/genebang/step3/${roomNum}`)}>이전</button>
                                <button type="submit" id="jm-step4-primary" disabled={!isNextEnabled()}>
                                    다음
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <Footert />
        </>
    );
};

export default Step04;
