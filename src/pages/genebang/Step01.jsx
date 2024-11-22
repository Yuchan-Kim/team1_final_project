// src/pages/genebang/Step01.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { StepNav } from '../include/StepNav'; // StepNav 임포트

import '../../css/reset.css';
import '../../css/jy_step.css';

import CheckRoundIcon from '@rsuite/icons/CheckRound';


// const Step01 = ({ onNext, onCancel, setSelection }) => {
const Step01 = () => {

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
    const navigate = useNavigate();

    // const authUser = JSON.parse(localStorage.getItem('authUser'));

    const authUserNum = 10;
    

    // 선택된 리스트 관리
    const [selected, setSelected] = useState(null);
    const [roomTypeNum, setRoomTypeNum] = useState();
    const [roomNum, setRoomNum] = useState();

    /*---일반 메소드 -----------------------------*/

    // 리스트 클릭 이벤트 처리

    const handleClick = (listType) => {
        setSelected(listType);  // 'left' 또는 'right' 선택
        if (listType === 'left') {
            setRoomTypeNum(0);  // 상태 업데이트
        } else if (listType === 'right') {
            setRoomTypeNum(1);  // 상태 업데이트
        }
        console.log(selected);
        //     setSelection(listType); // 부모 컴포넌트의 selection 상태 업데이트
    };

    /*---이벤트 핸들러 -------------------------*/


    const handleSubmit = (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append('roomMaker', authUserNum);
        formData.append('roomTypeNum', roomTypeNum);

        console.log(authUserNum);
        console.log(roomTypeNum);


        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step1`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                navigate('/genebang/step2');
            })
            .catch(error => {
                console.error(error);
                alert('생성 중 오류가 발생했습니다.');
            });


    };




    const getRoomInfoVo = ()=>{
        axios({

            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/genebang/step1/${roomNum}`,

            responseType: 'json' //수신타입
        }).then(response => {
            console.log(response.data); //수신데이타

            if ( response.data.apiData.roomTypeNum === 0 ) {
                setSelected('left');
            } else if ( response.data.apiData.roomTypeNum === 1 ) {
                setSelected('right');
            }

        }).catch(error => {
            console.log(error);
        });
    }


    // const ckeckRoom = ()=>{

    //     axios({

    //         method: 'get',
    //         url: `${process.env.REACT_APP_API_URL}/api/genebang/ckeckRoom/${authUserNum}`,

    //         responseType: 'json' //수신타입
    //     }).then(response => {
    //         console.log(response.data); //수신데이타
    //         setRoomNum( response.data.apiData.roomNum );
    //         alert('생성 중인 방으로 이동하시겠습니까?');
    //         getRoomInfoVo();

    //     }).catch(error => {
    //         console.log(error);

    //     });
    // }



    useEffect( ()=>{

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

                <div id="container" >

                    <div className="step" id="step1">

                        <StepNav idx={1} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">

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
                                    {/* <button id="secondary" onClick={onCancel}>취소</button> */}
                                    <button id="secondary" >취소</button>
                                    <button
                                        type="submit"
                                        id="primary"
                                        // onClick={onNext}
                                        // disabled={!selected}
                                        // className={!selected ? 'disabled' : ''}
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

export default Step01;
