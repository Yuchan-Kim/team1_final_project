// Step02.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../css/reset.css';
import '../../css/jy_step.css';

import { StepNav } from '../include/StepNav';

import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
// import { IoBook } from "react-icons/io5";
// import { CiDumbbell } from "react-icons/ci";
// import { CiFaceSmile } from "react-icons/ci";
// import { CiForkAndKnife } from "react-icons/ci";
// import { CiBatteryCharging } from "react-icons/ci";

const Step02 = () => {

    /*---라우터 관련-------------------------------*/
    const navigate = useNavigate();

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
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
    const handlePrevious= () => {
        navigate('/genebang/step1'); // "이전" 버튼을 이전 단계로 변경
    };
    const handleNext = () => {
        navigate('/genebang/step3');
    };

    return (

        <>

            <div id="jy_step" className="jy_wrap">

                {/* <Header /> */}
                {/* //header + //nav */}

                <div id="container">

                    {/* <div id="aside">

                    </div> */}
                    {/* //aside */}

                    <div className="step" id="step2">

                        <StepNav idx={2} />

                        <div id="board">

                            <h2>카테고리를 선택 해주세요.</h2>
                            <h4>방의 카테고리를 설정합니다.</h4>

                            <div id="list">

                                <div>
                                    <div id="category">
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
                                </div>

                                <div id="keyword">
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
                            {/* //list */}

                            <div className="btn">
                                <button id="secondary" onClick={handlePrevious}>이전</button>
                                <button 
                                    id="primary" 
                                    onClick={handleNext} 
                                    disabled={!selectedCategory || !keyword.trim()}
                                    className={!selectedCategory || !keyword.trim() ? 'disabled' : ''}
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

                {/* <Footer /> */}
                {/* //footer */}

            </div>
            {/* //wrap */}

        </>

    );

}

export default Step02;
