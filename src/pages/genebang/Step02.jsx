// src/pages/genebang/Step02.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import CheckRoundIcon from '@rsuite/icons/CheckRound';
import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step02 = ({ onNext, onPrevious }) => {

    // const authUser = JSON.parse(localStorage.getItem('authUser'));

    const authUserNum = 10;

    const navigate = useNavigate();

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
    const [roomNum, setRoomNum] = useState();

    // 선택된 카테고리를 관리
    const [selectedCategory, setSelectedCategory] = useState(null);
    // 키워드 입력값을 관리
    const [keyword, setKeyword] = useState('');

    /*---일반 메소드 -----------------------------*/
    // 카테고리 클릭 시 선택된 카테고리 설정
    const handleCategoryClick = (category) => {

        switch (category) {
            case '운동':
                setSelectedCategory(3);
                break;
            case '독서':
                setSelectedCategory(1);
                break;
            case '스터디':
                setSelectedCategory(4);
                break;
            case '생활루틴':
                setSelectedCategory(2);
                break;
            case '취미':
                setSelectedCategory(5);
                break;
            default:
                // 기본값 설정
        }

        // console.log(selectedCategory);

    };

    /*---이벤트 핸들러 -------------------------*/

    const handleSubmit = (e) => {

        console.log(roomNum);
        console.log(selectedCategory);
        console.log(keyword);

        e.preventDefault();

        const formData = new FormData();

        formData.append('roomNum', roomNum);
        formData.append('categoryNum', selectedCategory);
        formData.append('roomKeyword', keyword);

        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step2`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                navigate('/genebang/step3');
            })
            .catch(error => {
                console.error(error);
                alert('생성 중 오류가 발생했습니다.');
            });


    };



    // const getRoomInfoVo = ()=>{
    //     axios({

    //         method: 'get',
    //         url: `${process.env.REACT_APP_API_URL}/api/genebang/step/${no}`,

    //         responseType: 'json' //수신타입
    //     }).then(response => {
    //         console.log(response.data); //수신데이타

    //         setSelectedCategory(response.data.apiData.categoryNum);
    //         setKeyword(response.data.apiData.keyword);

    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }

    // const checkroom = ()=>{

    //     axios({

    //         method: 'get',
    //         url: `${process.env.REACT_APP_API_URL}/api/genebang/checkroom/${authUserNum}`,

    //         responseType: 'json' //수신타입
    //     }).then(response => {
    //         console.log(response.data); //수신데이타
    //         setRoomNum( response.data.apiData.roomNum );
    //         console.log(roomNum);

    //     }).catch(error => {
    //         console.log(error);

    //     });
    // }



    useEffect( ()=>{

        // checkroom();
        axios({

            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/genebang/checkroom/${authUserNum}`,

            responseType: 'json' //수신타입
        }).then(response => {
            console.log(response.data); //수신데이타
            setRoomNum( response.data.apiData );
            console.log(roomNum);

        }).catch(error => {
            console.log(error);
            alert('생성 중인 방이 없습니다')
            navigate('/');

        });

    }, [] );






    return (

        <>

            <div id="jy_step" className="jy_wrap">

                <div id="container">

                    <div className="step" id="step2">

                        <StepNav idx={2} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">

                            <div id="board">

                                <h2>카테고리를 선택 해주세요.</h2>
                                <h4>방의 카테고리를 설정합니다.</h4>

                                <div id="list">

                                    <div>
                                        <div id="category">
                                            {/* 각 카테고리 div에 클릭 이벤트와 선택 상태 반영 */}
                                            <div 
                                                onClick={() => handleCategoryClick('운동')} 
                                                className={selectedCategory === 3 ? 'selected' : ''}
                                            >
                                                운동
                                            </div>
                                            <div 
                                                onClick={() => handleCategoryClick('독서')} 
                                                className={selectedCategory === 1 ? 'selected' : ''}
                                            >
                                                독서
                                            </div>
                                            <div 
                                                onClick={() => handleCategoryClick('스터디')} 
                                                className={selectedCategory === 4 ? 'selected' : ''}
                                            >
                                                스터디
                                            </div>
                                            <div 
                                                onClick={() => handleCategoryClick('생활루틴')} 
                                                className={selectedCategory === 2 ? 'selected' : ''}
                                            >
                                                생활루틴
                                            </div>
                                            <div 
                                                onClick={() => handleCategoryClick('취미')} 
                                                className={selectedCategory === 5 ? 'selected' : ''}
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
                                    <button id="secondary" onClick={onPrevious}>이전</button>
                                    <button 
                                        type="submit"
                                        id="primary" 
                                        onClick={onNext} 
                                        disabled={!selectedCategory || !keyword.trim()}
                                        className={!selectedCategory || !keyword.trim() ? 'disabled' : ''}
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
            {/* //wrap */}

        </>

    );

}

export default Step02;
