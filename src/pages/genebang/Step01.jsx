import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { StepNav } from '../include/StepNav'; // StepNav 임포트

import '../../css/reset.css';
import '../../css/jy_step.css';

import CheckRoundIcon from '@rsuite/icons/CheckRound';
import Header from '../include/DH_Header';
import Footert from "../include/JM-Footer.jsx";

const Step01 = () => {
    const navigate = useNavigate();

    // 선택 상태 관리
    const [selectedType, setSelectedType] = useState(null);

    // 옵션 클릭 핸들러
    const handleSelect = (type) => {
        setSelectedType(type);
    };

    const handleCancel = () => {
        if (selectedType) {
            const confirmCancel = window.confirm('선택된 내용이 있습니다. 취소하시겠습니까?');
            if (!confirmCancel) {
                return; // 사용자가 취소하지 않으면 종료
            }
        }
        setSelectedType(null); // 선택 상태 초기화
        navigate("/"); // 이전 페이지로 이동
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 동작 방지
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return; // 토큰이 없으면 요청을 보내지 않음
        }
    
        if (!selectedType) {
            return;
        }
    
        try {
            // Axios 요청
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/challengeType`,
                selectedType, // 단일 값 전달
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더
                        'Content-Type': 'application/json', // JSON 요청 명시
                    },
                }
            );
    
            // 응답 처리
            if (response.data.result === 'success') {
                const roomNum = response.data.apiData; // 서버에서 반환된 방 번호
                navigate(`/genebang/step2/${roomNum}`); // 방 번호로 다음 스텝 이동
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                const errorMessage = error.response.data.message || '서버에서 처리할 수 없습니다.';
                alert(`오류: ${errorMessage}`);
            } else {
                alert('서버와 통신 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };
    

    return (
        <>
        <Header/>
        <div id="jy_step" className="jy_wrap">
            <div id="container">
                <div className="step" id="step1">
                    <StepNav idx={1} /> {/* StepNav 포함 */}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div id="board">
                            <h2>챌린지 종류를 선택 해주세요.</h2>

                            <div id="list">
                                {/* 왼쪽 리스트 (일반) */}
                                <div
                                    id="list-left"
                                    className={selectedType === 1 ? 'selected' : ''}
                                    onClick={() => handleSelect(1)}
                                >
                                    <h3>일반</h3>
                                    <ul>
                                        <li><span><CheckRoundIcon /></span><span>최소 입장 인원 설정</span></li>
                                        <li><span><CheckRoundIcon /></span><span>지역 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>최종 목표 설정 가능</span></li>
                                        <li><span><CheckRoundIcon /></span><span>AI 그룹 챌린지 추가 가능</span></li>
                                    </ul>
                                </div>

                                {/* 오른쪽 리스트 (챌린지) */}
                                <div
                                    id="list-right"
                                    className={selectedType === 2 ? 'selected' : ''}
                                    onClick={() => handleSelect(2)}
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
                            <button
                                id="secondary"
                                onClick={handleCancel} // 수정된 핸들러 사용
                            >
                                취소
                            </button>
                                <button
                                    type="submit"
                                    id="primary"
                                    className={!selectedType ? 'disabled' : ''}
                                    disabled={!selectedType} // 선택되지 않으면 비활성화
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
        <Footert/>
        </>
    );
    
};

export default Step01;


