// src/pages/genebang/Step11.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



import '../../css/reset.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step11 = ({ onNext, onPrevious }) => {

    const navigate = useNavigate();

    const authUserNum = 10;
    // const authUser = JSON.parse(localStorage.getItem('authUser'));

    const [roomNum, setRoomNum] = useState();

    const [regions, setRegions] = useState([]);
    
    /*---상태관리 변수들---*/
    const [maxParticipants, setMaxParticipants] = useState('');
    const [minParticipants, setMinParticipants] = useState('');
    const [minOptions, setMinOptions] = useState([]);
    const [region, setRegion] = useState('');

    /*---최대 참여 인원이 변경될 때 최소 참여 인원 옵션 업데이트---*/
    useEffect(() => {
        if (maxParticipants) {
            const options = [];
            const min = 2;
            const max = parseInt(maxParticipants, 10);
            for (let i = min; i <= max; i++) {
                options.push(i);
            }
            setMinOptions(options);
            // 자동으로 최소 참여 인원을 설정하거나 초기화
            if (minParticipants > max || minParticipants === '') {
                setMinParticipants(min);
            }
        } else {
            setMinOptions([]);
            setMinParticipants('');
        }
    }, [maxParticipants, minParticipants]);

    /*---버튼 활성화 조건---*/
    const isNextEnabled = () => {
        if (!maxParticipants || !minParticipants) {
            return false;
        }
        return true;
    };

    /*---이벤트 핸들러---*/
    const handleMaxChange = (e) => {
        setMaxParticipants(e.target.value);
    };

    const handleMinChange = (e) => {
        setMinParticipants(e.target.value);
    };

    const handleRegionChange = (e) => {
        setRegion(e.target.value);
        console.log(region);
    };



    const handleSubmit = (e) => {

        console.log(minParticipants);
        console.log(maxParticipants);
        console.log(region);

        e.preventDefault();

        const formData = new FormData();

        formData.append('roomMaxNum', maxParticipants);
        formData.append('roomMinNum', minParticipants);
        formData.append('regionNum', region);


        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step44`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                // navigate('/genebang/step5');
            })
            .catch(error => {
                console.error(error);
                alert('생성 중 오류가 발생했습니다.');
            });


    };






    return (
        <>
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div className="step" id="step4"> {/* id 수정: step4 -> step11 */}

                        <StepNav idx={4} /> {/* StepNav 포함: idx=4로 설정 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">

                            <div id="board">
                                <div id="list">
                                    <div>
                                        <h2>세부 설정</h2>
                                        <h4>일반 선택 시 필요한 추가 설정을 진행합니다.</h4>
                                    </div>

                                    {/* 인원 설정 */}
                                    <div id='member-count'>
                                        <div>
                                            <h3>인원 설정</h3>
                                        </div>
                                        <div id='box-double'>
                                            {/* 최대 참여 인원 */}
                                            <div id='box1'>
                                                <div>
                                                    <div className="inputTT">
                                                        <label htmlFor="maxParticipants">최대 참여 인원</label>
                                                    </div>
                                                    <div className="inputBox">
                                                        <select
                                                            id="maxParticipants"
                                                            value={maxParticipants}
                                                            onChange={handleMaxChange}
                                                        >
                                                            <option value="">선택</option>
                                                            {Array.from({ length: 19 }, (_, i) => i + 2).map((num) => (
                                                                <option key={num} value={num}>{num}명</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 최소 참여 인원 */}
                                            <div id='box1'>
                                                <div>
                                                    <div className="inputTT">
                                                        <label htmlFor="minParticipants">최소 참여 인원</label>
                                                    </div>
                                                    <div className="inputBox">
                                                        <select
                                                            id="minParticipants"
                                                            value={minParticipants}
                                                            onChange={handleMinChange}
                                                            disabled={!maxParticipants}
                                                        >
                                                            <option value="">선택</option>
                                                            {minOptions.map((num) => (
                                                                <option key={num} value={num}>{num}명</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    

                                    

                                    {/* 지역 설정 */}
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
                                    {/* "Secondary" 버튼을 "이전"으로 변경 */}
                                    <button id="secondary" onClick={onPrevious}>이전</button>
                                    {/* "Next" 버튼 활성화 조건에 따라 클릭 가능 */}
                                    <button
                                        id="primary"
                                        onClick={isNextEnabled() ? onNext : null}
                                        disabled={!isNextEnabled()}
                                        className={!isNextEnabled() ? 'disabled' : ''}
                                        aria-disabled={!isNextEnabled()}
                                    >
                                        다음
                                    </button>
                                </div>
                            </div>
                            {/* //board */}

                        </form>

                    </div>
                    {/* //step  */}
                </div>
                {/* //container  */}
            </div>
            {/* //wrap */}
        </>
    );
}

export default Step11;
