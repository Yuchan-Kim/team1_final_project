// src/pages/genebang/Step04.jsx

import React, { useState, useEffect } from 'react';
import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx'; // StepNav 임포트

const Step04 = ({ onSave, onPrevious }) => {

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

            <div id="yc_jy_step" className="yc_jy_wrap">

                <div className="yc_container">

                    <div className="yc_step" id="yc_step4">

                        <YCStepNav idx={2} /> {/* StepNav 포함 */}

                        <div id="yc_board">

                            <div id="yc_list">
                                <h2>세부 설정</h2>
                                <h4>방에 필요한 세부적인 설정을 할 수 있습니다.</h4>

                                <div id='yc_member_count'>
                                    <div>
                                        <h3>인원 설정</h3>
                                    </div>
                                    <div id='yc_box_double'>
                                        <div id='yc_box1'>
                                            <div>
                                                <div className="yc_inputTT">
                                                    <label htmlFor="yc_maxParticipants">최대 참여 인원</label>
                                                </div>
                                                <div className="yc_inputBox">
                                                    <select
                                                        id="yc_maxParticipants"
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
                                        <div id='yc_box1'>
                                            <div>
                                                <div className="yc_inputTT">
                                                    <label htmlFor="yc_minParticipants">최소 참여 인원</label>
                                                </div>
                                                <div className="yc_inputBox">
                                                    <select
                                                        id="yc_minParticipants"
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
                                <div id='yc_box2'>
                                    <h3>입장 포인트 설정</h3>
                                    <h4>방에 입장하기 위해서는 일정량의 포인트가 필요합니다.</h4>
                                    <div id='yc_input_box'>
                                        <input 
                                            placeholder='100,000 pt' 
                                            value={entryPoint}
                                            onChange={(e) => setEntryPoint(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3>입장 성실도 설정</h3>
                                    <div id='yc_box1'>
                                        <div className="yc_toggle_container">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={isHonestyEnabled}
                                                    onChange={() => setIsHonestyEnabled(!isHonestyEnabled)}
                                                />
                                                <span>입장 성실도 설정</span>
                                            </label>
                                        </div>
                                        <div id='yc_input_box'>
                                            <input 
                                                placeholder='4.5' 
                                                value={honestyScore}
                                                onChange={(e) => setHonestyScore(e.target.value)}
                                                disabled={!isHonestyEnabled}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div id='yc_box3'>
                                    <h3>지역 설정</h3>
                                    <h4>모임이 필요한 챌린지를 위해 지역을 설정합니다.</h4>
                                    <div id='yc_input_box'>
                                        <input 
                                            placeholder='전국' 
                                            value={region}
                                            onChange={handleRegionChange}
                                        />
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
                    {/* //yc_step4 */}

                </div>
                {/* //yc_container */}

            </div>
            {/* //yc_jy_step */}

        </>

    );

}

export default Step04;
