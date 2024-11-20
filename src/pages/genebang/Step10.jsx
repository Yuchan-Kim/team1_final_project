// src/pages/genebang/Step10.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step10 = ({ onCancel, onDiscard, onSave }) => {

    const handleDelete = () => {

        console.log("삭제가 승인되었습니다.");

        // axios.delete(`${process.env.REACT_APP_API_URL}/api/genebang/${authUser.no}`)
        //     .then(response => {
        //         console.log(response.data); //수신데이타
        //     })
        //     .catch(error => {
        //         console.error('삭제 중 오류가 발생했습니다:', error);
        //     });

    };



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
                                {/* 버리기 버튼: 모달 닫기 */}
                                <button id="secondary" onClick={handleDelete}>버리기</button>
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
