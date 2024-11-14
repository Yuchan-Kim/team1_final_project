// src/pages/genebang/Step10.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

const Step10 = ({ onCancel, onDiscard, onSave }) => {
    return (
        <>
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div id="aside">
                        {/* 필요에 따라 aside 내용 추가 */}
                    </div>
                    {/* //aside */}

                    <div className="step" id="step10">
                        <div id="board">
                            <div id="list">
                                <div>
                                    <h2>작성한 내용은 임시저장 됩니다</h2>
                                </div>
                            </div>
                            {/* //list */}

                            <div className="btn">
                                {/* 취소 버튼: 이전 화면으로 이동 */}
                                <button id="secondary" onClick={onCancel}>취소</button>
                                
                                {/* 버리기 버튼: 모달 닫기 */}
                                <button id="secondary" onClick={onDiscard}>버리기</button>
                                
                                {/* 저장하기 버튼: 모달 닫기 */}
                                <button id="primary" onClick={onSave}>저장하기</button>
                            </div>
                        </div>
                        {/* //board */}
                    </div>
                    {/* //step  */}
                </div>
                {/* //container  */}
            </div>
            {/* //wrap */}
        </>
    );
}

export default Step10;
