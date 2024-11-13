// Step08.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

const Step08 = () => {

    /*---라우터 관련-------------------------------*/
    const navigate = useNavigate();

    /*---상태 관리-------------------------*/
    const [selectedBox, setSelectedBox] = useState(null);

    /*---이벤트 핸들러 -------------------------*/
    const handlePrevious = () => {
        navigate('/genebang/step7'); // "이전" 버튼을 이전 단계로 변경
    };
    const handleNext = () => {
        navigate('/genebang/step9');
    };

    const handleAccept = (boxId) => {
        if (selectedBox === boxId) {
            // If the clicked box is already selected, unselect it
            setSelectedBox(null);
        } else {
            // Otherwise, select the clicked box
            setSelectedBox(boxId);
        }
    };


    return (
        <>
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div id="aside"></div>
                    <div className="step" id="step8">
                        <StepNav idx={8} />
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
                                <button id="secondary" onClick={handlePrevious}>이전</button>
                                <button 
                                    id="primary" 
                                    onClick={handleNext} 
                                    
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

export default Step08;
