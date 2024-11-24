import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step04 = () => {
    const navigate = useNavigate();
    const { roomNum } = useParams(); // URL에서 roomNum 추출

    const [regions, setRegions] = useState([]); // 지역 데이터
    const [maxParticipants, setMaxParticipants] = useState(''); // 최대인원
    const [minParticipants, setMinParticipants] = useState(''); // 최소인원
    const [entryPoint, setEntryPoint] = useState(''); // 입장포인트
    const [isHonestyEnabled, setIsHonestyEnabled] = useState(false); // 성실도 활성화 여부
    const [honestyScore, setHonestyScore] = useState(''); // 입장 성실도
    const [region, setRegion] = useState(''); // 지역 선택

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

    useEffect(() => {
        // 지역 데이터 가져오기
        getRegions();
    }, []);

    return (
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step4">
                    <StepNav idx={4} /> {/* StepNav 포함 */}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div id="board">
                            <div id="list">
                                <h2>세부 설정</h2>
                                <h4>방에 필요한 세부적인 설정을 할 수 있습니다.</h4>

                                {/* 인원 설정 */}
                                <div id='member-count'>
                                <h3>인원 설정</h3>
                                <div id='box-double'>
                                    {/* 최대 참여 인원 설정 */}
                                    <div>
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
                                    <div>
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
                                <div id='box2'>
                                    <h3>입장 포인트 설정</h3>
                                    <input
                                        placeholder="100,000 pt"
                                        value={entryPoint}
                                        onChange={(e) => setEntryPoint(e.target.value)}
                                    />
                                </div>

                                {/* 입장 성실도 설정 */}
                                <div>
                                    <h3>입장 성실도 설정</h3>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isHonestyEnabled}
                                            onChange={() => setIsHonestyEnabled(!isHonestyEnabled)}
                                        />
                                        입장 성실도 활성화
                                    </label>
                                    <input
                                        placeholder="80"
                                        value={honestyScore}
                                        onChange={(e) => setHonestyScore(e.target.value)}
                                        disabled={!isHonestyEnabled}
                                    />
                                </div>

                                {/* 지역 설정 */}
                                <div id='box3'>
                                    <h3>지역 설정</h3>
                                    <select value={region} onChange={handleRegionChange}>
                                        <option value="">지역 선택</option>
                                        {regions.map(region => (
                                            <option key={region.regionNum} value={region.regionNum}>
                                                {region.regionName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="btn">
                                <button type="submit" id="primary" disabled={!isNextEnabled()}>
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

export default Step04;
