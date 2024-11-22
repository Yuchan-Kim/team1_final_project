// src/pages/genebang/Step03.jsx
import React, { useState } from 'react';
import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step03 = ({ onNext, onPrevious }) => {

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    /*---일반 메소드 -----------------------------*/
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result); // 미리보기 이미지 URL로 상태 업데이트
            };
            reader.readAsDataURL(file);
        }
    };

    /*---이벤트 핸들러 -------------------------*/
    return (

        <>

            <div id="jy_step" className="jy_wrap">

                <div id="container">

                    <div className="step" id="step3">

                        <StepNav idx={3} /> {/* StepNav 포함 */}

                        <div id="board">

                            <div id="list">
                                <div id="input-Thumbnail">
                                    <h2>대표 이미지를 설정 해주세요.</h2>

                                    {/* 이미지 미리보기 부분 */}
                                    <div id="upload-Thumbnail" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                                        {thumbnail ? (
                                            <img
                                                src={thumbnail}
                                                alt="upload-Thumbnail"
                                                style={{
                                                    width: '400px',
                                                    height: '400px',
                                                    objectFit: 'contain', /* contain  fill */
                                                }}
                                            />
                                        ) : (
                                            <div>이미지를 선택해주세요</div>
                                        )}
                                    </div>

                                    {/* 파일 input 숨기기 */}
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                <div>
                                    <div id='input-title' className='input-title'>
                                        <h2>제목을 지어주세요.</h2>
                                        <h4>챌린지의 목표가 포함된 제목을 지어주세요.</h4>
                                        <h4>참가자가 혼동할 수 있습니다.</h4>
                                        <div>
                                            <input 
                                                placeholder='윗몸일으키기 마스터' 
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                            {title && <CloseOutlineIcon onClick={() => setTitle('')} style={{ cursor: 'pointer' }} />}
                                        </div>
                                    </div>

                                    <div id='input-title'>
                                        <h2>다른 참가자에게 챌린지를 설명해주세요.</h2>
                                        <div>설명(50자 이내)</div>
                                        <textarea 
                                            placeholder='방에 대해 설명해 주세요.' 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            {/* //list */}

                            <div className="btn">
                                <button id="secondary" onClick={onPrevious}>이전</button>
                                <button
                                    id="primary"
                                    onClick={onNext}
                                    disabled={!title.trim() || !description.trim()}
                                    className={!title.trim() || !description.trim() ? 'disabled' : ''}
                                    aria-disabled={!title.trim() || !description.trim()}
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

export default Step03;
