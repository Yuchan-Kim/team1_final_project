// src/pages/genebang/Step03.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import CloseOutlineIcon from '@rsuite/icons/CloseOutline';
import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step03 = ({ onNext, onPrevious }) => {

    const authUserNum = 10;
    // const authUser = JSON.parse(localStorage.getItem('authUser'));

    const [roomNum, setRoomNum] = useState();

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    /*---일반 메소드 -----------------------------*/
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setThumbnail(reader.result); // 미리보기 이미지 URL로 상태 업데이트
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };
    /*--- 이미지 파일 선택 핸들러 ---*/
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            // setThumbnail(URL.createObjectURL(file)); // 파일 객체를 상태에 저장
        }
    };

    const thumbnailUrl = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail]);

    /*---이벤트 핸들러 -------------------------*/

    const handleSubmit = (e) => {

        

        e.preventDefault();

        const formData = new FormData();

        console.log(thumbnail);

        formData.append('roomNum', roomNum);
        formData.append('roomThumbNail', thumbnail);
        formData.append('roomTitle', title);
        formData.append('roomInfo', description);//방설명 추가 필요


        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step3`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                navigate('/genebang/step4');
            })
            .catch(error => {
                console.error(error);
                alert('생성 중 오류가 발생했습니다.');
            });


    };

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

                <div id="container">

                    <div className="step" id="step3">

                        <StepNav idx={3} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">

                            <div id="board">

                                <div id="list">
                                    <div id="input-Thumbnail">
                                        <h2>대표 이미지를 설정 해주세요.</h2>

                                        {/* 이미지 미리보기 부분 */}
                                        <div id="upload-Thumbnail" onClick={() => document.getElementById('fileInput').click()} style={{ cursor: 'pointer' }}>
                                            {thumbnailUrl ? (
                                                <img
                                                    src={thumbnailUrl} 
                                                    alt="upload-Thumbnail"
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
                                        type="submit"
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

export default Step03;
