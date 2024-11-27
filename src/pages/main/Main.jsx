// src/pages/main/Main.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@rsuite/icons/Search';
import SendIcon from '@rsuite/icons/Send';
import Modal from 'react-modal';

// import '../../css/reset.css';
import '../../css/jy_main.css';

import Header from '../include/DH_Header';
import { StepNav } from '../include/StepNav'; // StepNav 임포트

// Step 컴포넌트들을 올바른 경로로 임포트
import Step01 from '../genebang/Step01';
import Step02 from '../genebang/Step02';
import Step03 from '../genebang/Step03';
import Step04 from '../genebang/Step04';
import Step05 from '../genebang/Step05';
import Step06 from '../genebang/Step06';
import Step07 from '../genebang/Step07';
import Step08 from '../genebang/Step08';
import Step09 from '../genebang/Step09';
import Step10 from '../genebang/Step10';
import Step11 from '../genebang/Step11'; // Step11 추가

// 접근성 설정
Modal.setAppElement('#root');

const Main = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [previousStep, setPreviousStep] = useState(null); // 이전 스텝 추적
    const [selection, setSelection] = useState(null); // 'left' 또는 'right' 선택 추적
    const [roomList, setRoomList] = useState(); // 방 리스트 가져오기
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태

    const openModal = () => {
        setIsModalOpen(true);
        setCurrentStep(1);
        setPreviousStep(null);
        setSelection(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNext = (path = null) => {
        if (path) {
            // 특정 경로로 네비게이션
            closeModal();
            navigate(path);
        } else {
            // 현재 스텝을 이전 스텝으로 저장
            setPreviousStep(currentStep);
            // 다음 스텝으로 이동 (최대 11단계)
            setCurrentStep((prev) => {
                if (prev === 3 && selection === 'left') {
                    return 11; // Step03 이후에 Step11로 이동
                } else if (prev === 11) {
                    return 5; // Step11 이후에 Step05로 이동
                } else {
                    return Math.min(prev + 1, 10);
                }
            });
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1)); // 최소 1단계로 이동
    };

    // Step10의 취소 버튼을 위한 함수: 이전 스텝으로 돌아가기
    const handleStep10Cancel = () => {
        if (previousStep !== null) {
            setCurrentStep(previousStep);
            setPreviousStep(null);
        } else {
            // 이전 스텝이 없을 경우, 모달 닫기
            closeModal();
        }
    };

    // Step10의 버리기와 저장하기 버튼을 위한 함수: 모달 닫기
    const handleStep10Discard = () => {
        closeModal();
    };

    const handleStep10Save = () => {
        closeModal();
    };

    // Step11의 다음 버튼을 위한 함수: Step05로 이동
    const handleStep11Next = () => {
        setPreviousStep(currentStep);
        setCurrentStep(5);
    };

    // Step11의 이전 버튼을 위한 함수: Step03로 돌아가기
    const handleStep11Previous = () => {
        setPreviousStep(currentStep);
        setCurrentStep(3);
    };

    // 현재 단계에 따라 렌더링할 컴포넌트 결정
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step01 onNext={() => handleNext()} onCancel={closeModal} setSelection={setSelection} />;
            case 2:
                return <Step02 onNext={() => handleNext()} onPrevious={handlePrevious} />;
            case 3:
                return <Step03 onNext={() => handleNext()} onPrevious={handlePrevious} />;
            case 4:
                return <Step04 onNext={() => handleNext()} onPrevious={handlePrevious} />;
            case 5:
                return <Step05 onNext={() => handleNext()} onPrevious={handlePrevious} />;
            case 6:
                return <Step06 onNext={() => handleNext()} onPrevious={handlePrevious} />;
            case 7:
                return <Step07 onNext={() => handleNext()} onPrevious={handlePrevious} />;
            case 8:
                return <Step08 onNext={() => handleNext()} onPrevious={handlePrevious} />;
            case 9:
                return <Step09 onNext={() => handleNext('/cmain')} onPrevious={handlePrevious} />;
            case 10:
                return (
                    <Step10
                        onCancel={handleStep10Cancel}
                        onDiscard={handleStep10Discard}
                        onSave={handleStep10Save}
                    />
                );
            case 11:
                return (
                    <Step11
                        onNext={handleStep11Next}
                        onPrevious={handleStep11Previous}
                    />
                );
            default:
                return null;
        }
    };

    const [score, setScore] = useState([
        { item: "item1", score: 10, image: "/img/banner.jpg", title: "최근에 챌린지 1" },
        { item: "item2", score: 20, image: "/img/banner.jpg", title: "종료된 챌린지 2" },
        { item: "item3", score: 64, image: "/img/banner.jpg", title: "입니다 챌린지 3" }
    ]);

    //검색어 전달 -> 페이지 이동
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 Enter 동작 방지 (예: 폼 제출)
            navigate(`/mainlist?query=${searchTerm}`); // 검색어를 쿼리 파라미터로 전달하며 이동
        }
    };
    

    // 카테고리 핸들러
    const handleCategoryChange = (category) => {
        if (category === '전체') {
            // 전체 방 가져오기
            getRoomList();
        } else {
            // 특정 카테고리만 가져오기
            axios({
                method: 'get',
                url: `${process.env.REACT_APP_API_URL}/api/roomFilter/category`,
                params: { category }, // 카테고리를 쿼리 파라미터로 전달
                responseType: 'json',
            })
            .then((response) => {
                if (response.data.result === 'success') {
                    setRoomList(response.data.apiData); // 필터링된 방 리스트 설정
                } else {
                    console.log(response.data.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    };    

    // 방 리스트 전부 가져오기
    const getRoomList = () => {
       
        axios({
          method: 'get',
          url: `${process.env.REACT_APP_API_URL}/api/roomList`,

          responseType: 'json'
        }).then(response => {
          if (response.data.result === "success") {
            setRoomList(response.data.apiData); 
          } else {
            console.log(response.data.message); 
          }
        }).catch(error => {
          console.log(error);
        });
      };

    useEffect(() => {
        getRoomList(); // 방리스트 가져오기
    }, []);

    return (
        <>
            <Header />

            <div id="jy_wrap" className="jy_wrap">
                <div className="jy_main" id="jy_main">
                    <div id="board">

                    <div id="search">
                        <div>
                            <SearchIcon />
                            <input
                                placeholder="방 제목, 키워드, 카테고리, 방 유형 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // 검색어 상태 업데이트
                                onKeyDown={handleSearchKeyDown} // Enter 키 감지
                            />
                        </div>
                    </div>
                        {/* //search */}

                        <div id='ad-banner'>
                            <img src="/img/banner.jpg" alt="banner" />
                        </div>
                        {/* //ad-banner */}

                        <div id='ad-bang'>
                            {score.map((item, idx) => (
                                <div className='ad-bang-list' key={idx}>

                                    <div className="ad-bang-image">
                                        <img src={item.image} alt={item.title} width="100" height="100" />
                                    </div> {/* 이미지 */}

                                    <div className="ad-bang-title">{item.title}</div> {/* 챌린지 제목 */}

                                    <div className="ad-bang-score">
                                        <svg className="circle_progress" width="60" height="60" viewBox="0 0 60 60">
                                            <circle className="frame" cx="30" cy="30" r="27" strokeWidth="6" />
                                            <circle className="bar" cx="30" cy="30" r="27" strokeWidth="6" />
                                        </svg>
                                        <strong className="value">{item.score}%</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* //ad-bang */}

                        <div id='icon-bar'>
                            <div>
                                <button className='jm-thema-button-all' onClick={() => handleCategoryChange('전체')}></button>
                                <span>전체</span>
                            </div>
                            <div>
                                <button className='jm-thema-button1' onClick={() => handleCategoryChange('운동')}></button>
                                <span>운동</span>
                            </div>
                            <div>
                                <button className='jm-thema-button2' onClick={() => handleCategoryChange('독서')}></button>
                                <span>독서</span>
                            </div>
                            <div>
                                <button className='jm-thema-button3' onClick={() => handleCategoryChange('스터디')}></button>
                                <span>스터디</span>
                            </div>
                            <div>
                                <button className='jm-thema-button4' onClick={() => handleCategoryChange('생활루틴')}></button>
                                <span>생활루틴</span>
                            </div>
                            <div>
                                <button className='jm-thema-button5' onClick={() => handleCategoryChange('취미')}></button>
                                <span>취미</span>
                            </div>
                        </div> {/* //icon-bar */}

                        <div id="list">
                        {roomList && roomList.length > 0 ? (
                            roomList.slice(0, 9).map((room, i) => (
                                <div key={room.roomNum}>
                                    <Link to={`/cmain/${room.roomNum}`} className="list_bang">
                                        <div className="bang_level">
                                            <div>{room.roomTypeName}</div>
                                        </div>

                                        <div className="bang_img">
                                            <img
                                                src={room.roomThumbNail || "/img/default-room.jpg"}
                                                alt={`${room.roomTitle} 방 썸네일`}
                                            />
                                        </div>

                                        <div className="jm-main-room-tatle">{room.roomTitle}</div>
                                        <div className="jm-main-room-date">
                                            <span>예상시작일</span> {room.roomStartDate}
                                        </div>
                                        <div className="jm-main-room-date">
                                            <span>기간</span> {room.periodType}주
                                        </div>
                                        <div className="bang_info">
                                            <div className="bang_info_left">
                                                <div><span>인원</span> {room.roomMinNum}/{room.roomMaxNum}</div>
                                            </div>
                                            <div className="bang_info_right">
                                                <div><span>포인트</span> {room.roomPoint} pt</div>
                                            </div>
                                        </div>

                                        <div className="bang_sub">
                                            {room.roomKeyword.split(",").map((keyword, idx) => (
                                                <span key={idx} className="tab01">#{room.categoryName} #{room.roomKeyword} #{room.regionName}</span>
                                            ))}
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div>등록된 방이 없습니다.</div>
                        )}
                    </div>
                        {/* //list */}

                        {/* 모달 열기 버튼 복구 */}
                        <div className="btn">
                            <button id="secondary" onClick={openModal}>
                                <span>
                                    <SendIcon size="5em" /><br />
                                    방 생성
                                </span>
                            </button>
                        </div>

                    </div>
                    {/* //board */}
                </div>
                {/* //main */}
            </div>
            {/* //wrap */}

            {/* 모달 구현 */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="방 생성 모달"
                className="custom-modal" // 사용자 정의 클래스
                overlayClassName="custom-overlay" // 사용자 정의 오버레이 클래스
            >
                <div className="modal-header">
                    {/* Step02부터 Step08까지 닫기 버튼 활성화 */}
                    {((currentStep >= 2 && currentStep <= 8) || currentStep === 11) && (
                        <button
                            onClick={() => {
                                setPreviousStep(currentStep); // 이전 스텝 저장
                                setCurrentStep(10); // Step10으로 이동
                            }}
                            className="modal-close-button"
                        >
                            닫기
                        </button>
                    )}
                </div>
                <div className="modal-content">
                    {renderStep()}
                </div>
            </Modal>
        </>
    );

};

export default Main;
