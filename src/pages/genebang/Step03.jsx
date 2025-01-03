import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import { StepNav } from '../include/StepNav'; // StepNav 임포트
import Footert from "../include/JM-Footer.jsx";

import '../../css/reset.css';
import '../css/Step03.css';

const Step03 = () => {
    const navigate = useNavigate();
    const { roomNum } = useParams(); // 스텝2에서 전달받은 roomNum 추출

    const [thumbnail, setThumbnail] = useState(null); // 업로드된 이미지 파일
    const [thumbnailUrl, setThumbnailUrl] = useState(''); // 이미지 미리보기 URL
    const [title, setTitle] = useState(''); // 방 제목
    const [description, setDescription] = useState(''); // 방 설명

    // 이미지 변경 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file); // 이미지 파일 저장
            setThumbnailUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 동작 방지

        if (!title.trim() || !description.trim() || !thumbnailUrl.trim()) {
            alert("제목, 설명, 대표 이미지를 모두 입력해주세요.");
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // FormData 객체 생성 (이미지 포함 전송)
            const formData = new FormData();
            formData.append('roomNum', parseInt(roomNum, 10)); // roomNum 추가
            formData.append('roomTitle', title.trim()); // 방 제목 추가
            formData.append('roomInfo', description.trim()); // 방 설명 추가
            formData.append('file', thumbnail); // 썸네일 파일 추가

            // Axios 요청
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/roomUpdateInfo`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // 인증 헤더 추가
                        'Content-Type': 'multipart/form-data', // FormData 요청 타입
                    },
                }
            );

            // 응답 처리
            if (response.data.result === 'success') {
                alert("방 정보가 성공적으로 저장되었습니다.");
                navigate(`/genebang/step4/${roomNum}`); // 다음 스텝으로 이동
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
        <div id="jm-step3" className="jm-step3-wrap">
            <div id="jm-step3-container">
                <div className="jm-step3-step" id="jm-step3-step">
                    <StepNav idx={3} /> {/* StepNav 포함 */}

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div id="jm-step3-board">
                            <div id="jm-step3-list">
                                {/* 제목 입력 */}
                                <div id="jm-step3-input-title" className="jm-step3-input-title">
                                    <h2>제목을 지어주세요.</h2>
                                    <h4>챌린지의 목표가 포함된 제목을 지어주세요.</h4>
                                    <div>
                                        <input
                                            className='jm-step3-input-roomtitle'
                                            placeholder="방 제목을 작성해주세요"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                        {title && <CloseOutlineIcon onClick={() => setTitle('')} style={{ cursor: 'pointer' }} />}
                                    </div>
                                </div>
                                {/* 이미지 업로드 */}
                                <div id="jm-step3-input-thumbnail">
                                    <h2>대표 이미지를 설정 해주세요.</h2>
                                    <div
                                        id="jm-step3-upload-thumbnail"
                                        onClick={() => document.getElementById('jm-step3-fileInput').click()}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {thumbnailUrl ? (
                                            <img src={thumbnailUrl} alt="upload-thumbnail" />
                                        ) : (
                                            <div>이미지를 선택해주세요</div>
                                        )}
                                    </div>
                                    <input
                                        id="jm-step3-fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                <div className='jm-step3-input-right'>

                                {/* 설명 입력 */}
                                <div id="jm-step3-input-description">
                                    <h2>다른 참가자에게 챌린지를 설명해주세요.</h2>
                                    <textarea
                                        placeholder="방에 대해 설명해 주세요. (200자 이내)"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                            </div>

                            <div className="jm-step3-btn">
                                <button id="jm-step3-secondary" onClick={() => navigate(`/genebang/step2/${roomNum}`)}>이전</button>
                                <button
                                    type="submit"
                                    id="jm-step3-primary"
                                    disabled={!title.trim() || !description.trim()}
                                    className={!title.trim() || !description.trim() ? 'jm-step3-disabled' : ''}
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <Footert />
        </>
    );
};

export default Step03;
