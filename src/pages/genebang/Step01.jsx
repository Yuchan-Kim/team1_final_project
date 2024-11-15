// src/pages/genebang/Step01.jsx
import React, { useState } from 'react';
import CheckRoundIcon from '@rsuite/icons/CheckRound';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step01 = ({ onNext, onCancel, setSelection }) => {

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    // 선택된 리스트 관리
    const [selected, setSelected] = useState(null);

    /*---일반 메소드 -----------------------------*/

    // 리스트 클릭 이벤트 처리
    const handleClick = (listType) => {
        setSelected(listType);  // 'left' 또는 'right' 선택
        setSelection(listType); // 부모 컴포넌트의 selection 상태 업데이트
    };

    /*---이벤트 핸들러 -------------------------*/

    return (

        <>

            <div id="jy_step" className="jy_wrap">

                <div id="container" >

                    <div className="step" id="step1">

                        <StepNav idx={1} /> {/* StepNav 포함 */}

                        <div id="board">

                            <h2>챌린지 종류를 선택 해주세요.</h2>

                            <div id="list">

                                {/* 왼쪽 리스트 */}
                                <div
                                    id="list-left"
                                    className={selected === 'left' ? 'selected' : ''}
                                    onClick={() => handleClick('left')}
                                >
                                    <h3>일반</h3>
                                    <ul>
                                        <li><span><CheckRoundIcon /></span><span>최소 입장 인원 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>지역 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최종 목표 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>AI 그룹 챌린지 추가 가능</span></li>
                                    </ul>
                                </div>

                                {/* 오른쪽 리스트 */}
                                <div
                                    id="list-right"
                                    className={selected === 'right' ? 'selected' : ''}
                                    onClick={() => handleClick('right')}
                                >
                                    <h3>챌린지</h3>
                                    <ul>
                                        <li><span><CheckRoundIcon /></span><span>입장 포인트 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최소 입장 인원 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>지역 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최종 목표 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>AI 그룹 챌린지 추가 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>입장 성실도 설정 가능</span></li>
                                    </ul>
                                </div>

                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button id="secondary" onClick={onCancel}>취소</button>
                                <button
                                    id="primary"
                                    onClick={onNext}
                                    disabled={!selected}
                                    className={!selected ? 'disabled' : ''}
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

export default Step01;
