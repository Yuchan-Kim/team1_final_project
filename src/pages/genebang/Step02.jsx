import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import CheckRoundIcon from '@rsuite/icons/CheckRound';
import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import '../../css/reset.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

import Footert from "../include/JM-Footer.jsx";
import '../css/Step02.css';

const Step02 = () => {
    const { roomNum } = useParams(); // URL에서 roomNum 추출
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리
    const [keyword, setKeyword] = useState(''); // 입력된 키워드

    // 카테고리 클릭 핸들러
    const handleCategoryClick = (categoryNum) => {
        setSelectedCategory(categoryNum); // 선택된 카테고리 업데이트
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 동작 방지

        if (!selectedCategory || !keyword.trim()) {
            alert("카테고리와 키워드를 입력해주세요.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // Axios 요청
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/roomAddCategory`,
                null, // POST 요청의 본문 없이 쿼리 파라미터로 전달
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더
                    },
                    params: {
                        roomNum: parseInt(roomNum, 10), // roomNum 전달
                        categoryNum: selectedCategory, // 선택된 카테고리 번호
                        keyword: keyword.trim(), // 키워드 전달
                    },
                }
            );

            // 응답 처리
            if (response.data.result === 'success') {
                alert("카테고리가 저장되었습니다.");
                navigate(`/genebang/step3/${roomNum}`); // 다음 스텝으로 이동
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Axios 요청 중 오류 발생:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    // 방 삭제하고 뒤로가기
    const handlePrevious = async () => {
        const token = localStorage.getItem('token'); // 토큰 가져오기

        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // Axios 요청
            const response = await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/deleteRoom`, // 백엔드 API URL
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더
                    },
                    params: {
                        roomNum: parseInt(roomNum, 10), // roomNum 전달
                    },
                }
            );

            // 응답 처리
            if (response.data.result === 'success') {
                navigate("/genebang/step1"); // step1로 이동
            } else {
                alert(`오류: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Axios 요청 중 오류 발생:", error);
            alert("서버와 통신 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <div id="jm-step2" className="jm-step2-wrap">
                <div id="jm-step2-container">
                    <div className="jm-step2-step" id="jm-step2-step2">
                        <StepNav idx={2} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div id="jm-step2-board">
                                <h2>카테고리를 선택 해주세요.</h2>
                                <h4>방의 카테고리를 설정합니다.</h4>

                                <div id="jm-step2-list">
                                    <div>
                                        <div id="jm-step2-category">
                                            {/* 카테고리 선택 */}
                                            <div
                                                onClick={() => handleCategoryClick(3)}
                                                className={selectedCategory === 3 ? 'jm-step2-selected' : ''}
                                            >
                                                운동
                                            </div>
                                            <div
                                                onClick={() => handleCategoryClick(1)}
                                                className={selectedCategory === 1 ? 'jm-step2-selected' : ''}
                                            >
                                                독서
                                            </div>
                                            <div
                                                onClick={() => handleCategoryClick(4)}
                                                className={selectedCategory === 4 ? 'jm-step2-selected' : ''}
                                            >
                                                스터디
                                            </div>
                                            <div
                                                onClick={() => handleCategoryClick(2)}
                                                className={selectedCategory === 2 ? 'jm-step2-selected' : ''}
                                            >
                                                생활루틴
                                            </div>
                                            <div
                                                onClick={() => handleCategoryClick(5)}
                                                className={selectedCategory === 5 ? 'jm-step2-selected' : ''}
                                            >
                                                취미
                                            </div>
                                        </div>
                                    </div>

                                    {/* 키워드 입력 */}
                                    <div id="jm-step2-keyword">
                                        <h3>키워드</h3>
                                        <div>
                                            <input
                                                placeholder="키워드 입력"
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                            />
                                        </div>
                                        <h4>챌린지 방만의 키워드를 만들어 보세요.</h4>
                                        <h4>인원을 모집하는데 유용합니다.</h4>
                                    </div>
                                </div>

                                {/* 버튼 */}
                                <div className="jm-step2-btn">
                                    <button
                                        id="jm-step2-secondary"
                                        type="button" // form 제출을 방지하기 위해 type="button"
                                        onClick={handlePrevious} // 이전 버튼 클릭 핸들러 연결
                                    >
                                        이전
                                    </button>
                                    <button
                                        type="submit"
                                        id="jm-step2-primary"
                                        disabled={!selectedCategory || !keyword.trim()}
                                        className={!selectedCategory || !keyword.trim() ? 'jm-step2-disabled' : ''}
                                    >
                                        다음
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <Footert />
            </div>
        </>
    );
};

export default Step02;
