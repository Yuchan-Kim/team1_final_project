// src/pages/genebang/Step04.jsx
import React, { useState } from 'react';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step04 = ({ onNext, onPrevious }) => {

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
    const [maxParticipants, setMaxParticipants] = useState('');
    const [minParticipants, setMinParticipants] = useState('');
    const [entryPoint, setEntryPoint] = useState('');
    const [isHonestyEnabled, setIsHonestyEnabled] = useState(false);
    const [honestyScore, setHonestyScore] = useState('');

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
    const [region, setRegion] = useState('');

    const handleRegionChange = (e) => {
        setRegion(e.target.value);
    };

    /*---이벤트 핸들러 -------------------------*/
    return (

        <>

            <div id="jy_step" className="jy_wrap">

                <div id="container">

                    <div className="step" id="step4">

                        <StepNav idx={4} /> {/* StepNav 포함 */}

                        <div id="board">

                            <div id="list">
                                <h2>세부 설정</h2>
                                <h4>방에 필요한 세부적인 설정을 할 수 있습니다.</h4>

                                <div id='member-count'>
                                    <div>
                                        <h3>인원 설정</h3>
                                    </div>
                                    <div id='box-double'>
                                        <div id='box1'>
                                            <div>
                                                <div className="inputTT">
                                                    <label htmlFor="maxParticipants">최대 참여 인원</label>
                                                </div>
                                                <div className="inputBox">
                                                    <select
                                                        id="maxParticipants"
                                                        value={maxParticipants}
                                                        onChange={(e) => {
                                                            setMaxParticipants(e.target.value);
                                                            if (minParticipants > e.target.value) {
                                                                setMinParticipants('');
                                                            }
                                                        }}
                                                    >
                                                        <option value="">선택</option>
                                                        {[...Array(19)].map((_, i) => (
                                                            <option key={i + 2} value={i + 2}>{i + 2}명</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div id='box1'>
                                            <div>
                                                <div className="inputTT">
                                                    <label htmlFor="minParticipants">최소 참여 인원</label>
                                                </div>
                                                <div className="inputBox">
                                                    <select
                                                        id="minParticipants"
                                                        value={minParticipants}
                                                        onChange={(e) => setMinParticipants(e.target.value)}
                                                        disabled={!maxParticipants}
                                                    >
                                                        <option value="">선택</option>
                                                        {maxParticipants && [...Array(maxParticipants - 1)].map((_, i) => (
                                                            <option key={i + 2} value={i + 2}>{i + 2}명</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div id='box2'>
                                    <h3>입장 포인트 설정</h3>
                                    <h4>방에 입장하기 위해서는 일정량의 포인트가 필요합니다.</h4>
                                    <div id='input-box'>
                                        <input 
                                            placeholder='100,000 pt' 
                                            value={entryPoint}
                                            onChange={(e) => setEntryPoint(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3>입장 성실도 설정</h3>
                                    <div id='box1'>
                                        <div className="toggle-container">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={isHonestyEnabled}
                                                    onChange={() => setIsHonestyEnabled(!isHonestyEnabled)}
                                                />
                                                <span>입장 성실도 설정</span>
                                            </label>
                                        </div>
                                        <div id='input-box'>
                                            <input 
                                                placeholder='4.5' 
                                                value={honestyScore}
                                                onChange={(e) => setHonestyScore(e.target.value)}
                                                disabled={!isHonestyEnabled}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div id='box3'>
                                    <h3>지역 설정</h3>
                                    <h4>모임이 필요한 챌린지를 위해 지역을 설정합니다.</h4>
                                    <div id='input-box'>
                                        <input 
                                            placeholder='전국' 
                                            value={region}
                                            onChange={handleRegionChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* //list */}

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
                        {/* //board */}

                    </div>
                    {/* //step */}

                </div>
                {/* //container */}

            </div>
            {/* //wrap */}

        </>

    );

}

export default Step04;
