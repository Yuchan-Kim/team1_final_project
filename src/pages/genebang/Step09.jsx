// src/pages/genebang/Step09.jsx

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

const Step09 = ({ onNext, onPrevious, onClose }) => {
    const { roomNum } = useParams();

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate("/");
        onClose(); // 모달 닫기
    };

    const handleNext = () => {
        navigate(`/cmain/${roomNum}`);
        
    };

    return (
        <>
            <div id="jy_step" className="jy_wrap">
                <div id="container">
                    <div id="aside">
                        {/* 사이드바가 이미 존재하므로 비워둠 */}
                    </div>
                    {/* //aside */}

                    <div className="step" id="step9">
                        {/* <StepNav idx="9" /> */}

                        <div id="board">
                            <div id="list">
                                <div>
                                    <h2>챌린지 생성이 완료 되었습니다.</h2>
                                </div>
                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button id="secondary" onClick={handleCancel}>메인으로 가기</button>
                                <button id="primary" onClick={handleNext}>챌린지로 가기</button>
                            </div>
                        </div>
                        {/* //board */}
                    </div>
                    {/* //step */}
                </div>
                {/* //container */}
                {/* <Footer /> */}
                {/* //footer */}
            </div>
            {/* //wrap */}
        </>
    );
}

export default Step09;
