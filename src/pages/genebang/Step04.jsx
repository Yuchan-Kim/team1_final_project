// src/pages/genebang/Step04.jsx


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';




import '../../css/reset.css';
import '../../css/jy_step.css';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

const Step04 = ({ onNext, onPrevious }) => {

    const navigate = useNavigate();

    const authUserNum = 10;
    // const authUser = JSON.parse(localStorage.getItem('authUser'));

    const [roomNum, setRoomNum] = useState();

    const [regions, setRegions] = useState([]);

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
    const [maxParticipants, setMaxParticipants] = useState('');
    const [minParticipants, setMinParticipants] = useState('');
    const [entryPoint, setEntryPoint] = useState('');
    const [isHonestyEnabled, setIsHonestyEnabled] = useState(false);
    const [honestyScore, setHonestyScore] = useState('');

    /*---버튼 활성화 조건---------------------------*/
    const isNextEnabled = () => {
        if (!entryPoint || !maxParticipants || !minParticipants) {
            return false;
        }
        if (isHonestyEnabled && !honestyScore) {
            return false;
        }
        return true;
    };
    const [region, setRegion] = useState('');

    const handleRegionChange = (e) => {
        setRegion(e.target.value);
    };

    /*---이벤트 핸들러 -------------------------*/

    const handleSubmit = (e) => {

        console.log(region);

        e.preventDefault();

        const formData = new FormData();

        formData.append('roomNum', roomNum);
        formData.append('roomMaxNum', maxParticipants);
        formData.append('roomMinNum', minParticipants);
        formData.append('roomEnterPoint', entryPoint); //배팅 포인트
        formData.append('roomEnterRate', honestyScore);//성실도
        formData.append('regionNum', region);


        axios.post(`${process.env.REACT_APP_API_URL}/api/genebang/step4`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log(response);
                navigate('/genebang/step5');
            })
            .catch(error => {
                console.error(error);
                alert('생성 중 오류가 발생했습니다.');
            });


    };



    const getRegions = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/genebang/regions`)
        .then(response => {
            console.log('API Response:', response.data);
            if (response.data && Array.isArray(response.data.apiData)) {
                setRegions(response.data.apiData);
            } else {
                console.error('Error: Expected array but got', typeof response.data.apiData);
                setRegions([]);
            }
        })
        .catch(error => {
            console.error('Error fetching regions:', error);
            setRegions([]);
        });
    }


    // const getRoomInfoVo = ()=>{
    //     axios({

    //         method: 'get',
    //         url: `${process.env.REACT_APP_API_URL}/api/genebang/step/${no}`,

    //         responseType: 'json' //수신타입
    //     }).then(response => {
    //         console.log(response.data); //수신데이타

            // setMaxParticipants(response.data.apiData.roomMaxNum);
            // setMinParticipants(response.data.apiData.roomMinNum);
            // setEntryPoint(response.data.apiData.roomEnterPoint);
            // setHonestyScore(response.data.apiData.roomEnterRate);
            // setRegion(response.data.apiData.regionNum);

    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }

    useEffect( ()=>{

        // if (authUser.roll == 0) {
        //     axios.get(`${process.env.REACT_APP_API_URL}/api/resions`)
        //     .then(response => {
        //         console.log('API Response:', response.data);
        //         if (response.data && Array.isArray(response.data.apiData)) {
        //             setResions(response.data.apiData);
        //         } else {
        //             console.error('Error: Expected array but got', typeof response.data.apiData);
        //             setResions([]);
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error fetching resions:', error);
        //         setResions([]);
        //     });

        // } else {
        //     alert('접근 권한이 없습니다');
        //     navigate('/');
        // }

        axios({

            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/genebang/checkroom/${authUserNum}`,

            responseType: 'json' //수신타입
        }).then(response => {
            console.log(response.data); //수신데이타
            setRoomNum( response.data.apiData );
            console.log(roomNum);

            getRegions();
            console.log(regions);

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

                    <div className="step" id="step4">

                        <StepNav idx={4} /> {/* StepNav 포함 */}

                        <form onSubmit={handleSubmit} encType="multipart/form-data">

                            <div id="board">

                                <div id="list">
                                    <h2>세부 설정</h2>
                                    <h4>방에 필요한 세부적인 설정을 할 수 있습니다.</h4>

                                    <div id='member-count'>
                                        <div>
                                            <h3>인원 설정</h3>
                                        </div>
                                        <div id='box-double'>
                                            <div id='box1'>
                                                <div>
                                                    <div className="inputTT">
                                                        <label htmlFor="maxParticipants">최대 참여 인원</label>
                                                    </div>
                                                    <div className="inputBox">
                                                        <select
                                                            id="maxParticipants"
                                                            value={maxParticipants}
                                                            onChange={(e) => {
                                                                setMaxParticipants(e.target.value);
                                                                if (minParticipants > e.target.value) {
                                                                    setMinParticipants('');
                                                                }
                                                            }}
                                                        >
                                                            <option value="">선택</option>
                                                            {[...Array(19)].map((_, i) => (
                                                                <option key={i + 2} value={i + 2}>{i + 2}명</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id='box1'>
                                                <div>
                                                    <div className="inputTT">
                                                        <label htmlFor="minParticipants">최소 참여 인원</label>
                                                    </div>
                                                    <div className="inputBox">
                                                        <select
                                                            id="minParticipants"
                                                            value={minParticipants}
                                                            onChange={(e) => {
                                                                setMinParticipants(e.target.value);
                                                            }}
                                                        >
                                                            <option value="">선택</option>
                                                            {[...Array(5)].map((_, i) => (
                                                                <option key={i + 1} value={i + 1}>{i + 1}명</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div id='box2'>
                                        <h3>입장 포인트 설정</h3>
                                        <h4>방에 입장하기 위해서는 일정량의 포인트가 필요합니다.</h4>
                                        <div id='input-box'>
                                            <input 
                                                placeholder='100,000 pt' 
                                                value={entryPoint}
                                                onChange={(e) => setEntryPoint(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3>입장 성실도 설정</h3>
                                        <div id='box1'>
                                            <div className="toggle-container">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={isHonestyEnabled}
                                                        onChange={() => setIsHonestyEnabled(!isHonestyEnabled)}
                                                    />
                                                    <span>입장 성실도 설정</span>
                                                </label>
                                            </div>
                                            <div id='input-box'>
                                                <input 
                                                    placeholder='80' 
                                                    value={honestyScore}
                                                    onChange={(e) => setHonestyScore(e.target.value)}
                                                    disabled={!isHonestyEnabled}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div id='box3'>
                                        <h3>지역 설정</h3>
                                        <h4>모임이 필요한 챌린지를 위해 지역을 설정합니다.</h4>
                                        <div >
                                            {/* <input 
                                                placeholder='전국' 
                                                value={region}
                                                onChange={handleRegionChange}
                                            /> */}
                                            <select className='input-box' id='region'
                                                value={region} // 선택된 아티스트 이름을 상태로 설정
                                                onChange={handleRegionChange} // 아티스트 선택 시 상태 업데이트
                                                // required
                                            >
                                                <option value="">지역 선택하세요</option>
                                                {regions.map((region) => (
                                                    <option key={region.regions} value={region.regionNum}>
                                                        {region.regionName}
                                                    </option>
                                                ))}
                                            </select>
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
                                        disabled={!isNextEnabled()}
                                        className={!isNextEnabled() ? 'disabled' : ''}
                                        aria-disabled={!isNextEnabled()}
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

export default Step04;
