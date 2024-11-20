// src/pages/genebang/Step08.jsx


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step08 = ({ onNext, onPrevious }) => {

    /*---상태 관리-------------------------*/
    const [selectedBox, setSelectedBox] = useState(null);

    /*---이벤트 핸들러 -------------------------*/
    const handleAccept = (boxId) => {
        if (selectedBox === boxId) {
            // 이미 선택된 박스면 선택 해제
            setSelectedBox(null);
        } else {
            // 새로운 박스 선택
            setSelectedBox(boxId);
        }
    };

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        return selectedBox !== null;
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append('evaluationType', selectedBox); 


        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step8`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                // navigate('/genebang/step9');
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
                    <div className="step" id="step8">
                        <StepNav idx={8} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div id="board">
                                <div id="list">
                                    <h2>AI 추천 그룹 챌린지</h2>
                                    <h4>사용자가 입력한 미션을 기반으로 그룹 챌린지를 제시합니다.</h4>
                                    <h4>AI는 실수할 수 있습니다.</h4>

                                    <div id='ai-select'>
                                        {/* AI Box 1 */}
                                        <div
                                            id='ai-box'
                                            className={selectedBox === 1 ? 'selected' : selectedBox ? 'disabled' : ''}
                                        >
                                            <div id='ai-title'>
                                                <div>AI 추천 챌린지 (난이도: 하)</div>
                                                <div id='ai-point'>200,000pt</div>
                                            </div>
                                            <div>Supporting line text lorem ipsum dolor sit</div>
                                            <div>amet, consectetur</div>
                                            <div>
                                                <button
                                                    onClick={() => handleAccept(1)}
                                                    disabled={selectedBox !== null && selectedBox !== 1}
                                                >
                                                    {selectedBox === 1 ? '취소' : '수락'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* AI Box 2 */}
                                        <div
                                            id='ai-box'
                                            className={selectedBox === 2 ? 'selected' : selectedBox ? 'disabled' : ''}
                                        >
                                            <div id='ai-title'>
                                                <div>AI 추천 챌린지 (난이도: 중)</div>
                                                <div id='ai-point'>200,000pt</div>
                                            </div>
                                            <div>Supporting line text lorem ipsum dolor sit</div>
                                            <div>amet, consectetur</div>
                                            <div>
                                                <button
                                                    onClick={() => handleAccept(2)}
                                                    disabled={selectedBox !== null && selectedBox !== 2}
                                                >
                                                    {selectedBox === 2 ? '취소' : '수락'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* AI Box 3 */}
                                        <div
                                            id='ai-box'
                                            className={selectedBox === 3 ? 'selected' : selectedBox ? 'disabled' : ''}
                                        >
                                            <div id='ai-title'>
                                                <div>AI 추천 챌린지 (난이도: 상)</div>
                                                <div id='ai-point'>200,000pt</div>
                                            </div>
                                            <div>Supporting line text lorem ipsum dolor sit</div>
                                            <div>amet, consectetur</div>
                                            <div>
                                                <button
                                                    onClick={() => handleAccept(3)}
                                                    disabled={selectedBox !== null && selectedBox !== 3}
                                                >
                                                    {selectedBox === 3 ? '취소' : '수락'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* //list */}

                                <div className="btn">
                                    <button id="secondary" onClick={onPrevious}>이전</button>
                                    <button 
                                        id="primary" 
                                        onClick={onNext} 
                                        aria-disabled={!isNextEnabled()}
                                    >
                                        다음
                                    </button>
                                </div>

                            </div>
                            {/* //board */}
                        
                        </form>

                    </div>
                    {/* //step */}
                </div>
                {/* //container */}
            </div>
            {/* //wrap */}
        </>
    );
}

export default Step08;
