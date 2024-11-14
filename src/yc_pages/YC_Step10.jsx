// src/pages/genebang/Step10.jsx
import React from 'react';
import '../css/reset.css';
import '../css/jy_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx'; // StepNav 임포트

const Step10 = ({ onCancel, onDiscard, onSave }) => {
    return (
        <>
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div className="step" id="step10">
                        <div id="board">
                            <div id="list">
                                <div>
                                    <h2>작성한 내용은 임시저장 됩니다</h2>
                                </div>
                            </div>
                            {/* //list */}

                            <div className="btn">
                                {/* 취소 버튼: 이전 스텝으로 돌아가기 */}
                                <button id="secondary" onClick={onCancel}>취소</button>
                                {/* 저장하기 버튼: 모달 닫기 */}
                                <button id="primary" onClick={onSave}>저장하기</button>
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

export default Step10;
