// src/pages/genebang/Step02.jsx

import React, { useState } from 'react';
import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';
import { YCStepNav } from '../yc_pages/YC_StepNav.jsx';

const Step02 = ({ onSave, onPrevious }) => {

    /*---상태관리 변수들---*/
    // 선택된 카테고리를 관리
    const [selectedCategory, setSelectedCategory] = useState(null);
    // 키워드 입력값을 관리
    const [keyword, setKeyword] = useState('');

    /*---일반 메소드 -----------------------------*/
    // 카테고리 클릭 시 선택된 카테고리 설정
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    /*---이벤트 핸들러 -------------------------*/
    return (
        <div className="yc_jy_step">
            <div className="yc_container">
                <div className="yc_step" id="yc_step02">
                    <div id="yc_board">
                        <h2>카테고리를 선택 해주세요.</h2>
                        <h4>방의 카테고리를 설정합니다.</h4>

                        <div id="yc_list">
                            <div id="yc_category">
                                {/* 각 카테고리 div에 클릭 이벤트와 선택 상태 반영 */}
                                <div 
                                    onClick={() => handleCategoryClick('운동')} 
                                    className={selectedCategory === '운동' ? 'selected' : ''}
                                >
                                    운동
                                </div>
                                <div 
                                    onClick={() => handleCategoryClick('독서')} 
                                    className={selectedCategory === '독서' ? 'selected' : ''}
                                >
                                    독서
                                </div>
                                <div 
                                    onClick={() => handleCategoryClick('스터디')} 
                                    className={selectedCategory === '스터디' ? 'selected' : ''}
                                >
                                    스터디
                                </div>
                                <div 
                                    onClick={() => handleCategoryClick('생활루틴')} 
                                    className={selectedCategory === '생활루틴' ? 'selected' : ''}
                                >
                                    생활루틴
                                </div>
                                <div 
                                    onClick={() => handleCategoryClick('취미')} 
                                    className={selectedCategory === '취미' ? 'selected' : ''}
                                >
                                    취미
                                </div>
                            </div>

                            <div id="yc_keyword">
                                <h3>키워드</h3>
                                <div>
                                    <input 
                                        placeholder='윗몸일으키기' 
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    {keyword && <CloseOutlineIcon onClick={() => setKeyword('')} style={{ cursor: 'pointer' }} />}
                                </div>
                                <h4>챌린지 방만의 키워드를 만들어 보세요.</h4>
                                <h4>인원을 모집하는데 유용합니다.</h4>
                            </div>
                        </div>
                        {/* //yc_list */}

                        <div className="yc_btn">
                            <button 
                                id="yc_primary" 
                                onClick={() => onSave()}
                            >
                                저장
                            </button>
                        </div>
                    </div>
                    {/* //yc_board */}
                </div>
                {/* //yc_step02 */}
            </div>
            {/* //yc_container */}
        </div>
        /* //yc_jy_step */
    );
}

export default Step02;
