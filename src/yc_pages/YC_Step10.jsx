// src/pages/genebang/Step10.jsx

import React from 'react';
import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx'; // StepNav 임포트

const Step10 = ({ onCancel, onDiscard, onSave }) => {
    return (
        <>
            <div id="yc_jy_step" className="yc_jy_wrap">
                <div className="yc_container">
                    <div className="yc_step" id="yc_step10">
                        <div id="yc_board">
                            <div id="yc_list">
                                <div>
                                    <h2>작성한 내용은 임시저장 됩니다</h2>
                                </div>
                            </div>
                            {/* //yc_list */}

                            <div className="yc_btn">
                                {/* 취소 버튼: 이전 스텝으로 돌아가기 */}
                                <button id="yc_secondary" onClick={onCancel}>취소</button>
                                {/* 저장하기 버튼: 모달 닫기 */}
                                <button id="yc_primary" onClick={onSave}>저장하기</button>
                            </div>
                        </div>
                        {/* //yc_board */}
                    </div>
                    {/* //yc_step10 */}
                </div>
                {/* //yc_container */}
            </div>
            {/* //yc_jy_step */}
        </>
    );
}

export default Step10;
