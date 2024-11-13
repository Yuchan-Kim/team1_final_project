import React, { useState } from 'react';
import TopHeader from "../include/DH_Header.jsx";
import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";
import '../css/Missioninfo.css';

import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";

const Missioninfo = () => {


const [isModalOpen, setIsModalOpen] = useState(false);

const handleOpenModal = () => setIsModalOpen(true);
const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
        <TopHeader/>
        <div className="jm-missioninfo-body">

            {/* Sidebar */}
        
                <Sidebar />
           
            
            
            <div className="jm-missionsinfo">
                <Header/>

                <div className='jm-mission-history'>
                    <h2 className='jm-history-tatle'>제출 히스토리</h2>

                    <button className='jm-calender-api'>캘린더 api</button>
                    <div className='jm-option-box'>
                        <select className="jm-challenge-select">
                            <option>유저</option>
                            <option>씽씽이도둑김유찬</option>
                            <option>박지민</option>
                            <option>함민규</option>
                            <option>이다현</option>
                            <option>신지연</option>
                        </select>

                        <select className="jm-challenge-select">
                            <option>오름순차</option>
                            <option>최신순</option>
                            <option>오래된순</option>
                        </select>

                        <select className="jm-challenge-select">
                            <option>승인상태</option>
                            <option>승인완료</option>
                            <option>미승인</option>
                            <option>승인대기</option>
                        </select>
                    </div>
                </div>
            

            {[...Array(3)].map((_, index) => (
                <div key={index} className="jm-submission-card">
                    <div className='jm-userinfo-container'>
                        <span className='jm-day'>2024.11.06</span>
                        <span className="jm-approval-button">승인 대기</span><br/>

                        <div className='jm-user-profile-container'>
                            <div className="jm-user-profile-img-card">
                                <img src="https://via.placeholder.com/100" className="yc_challenge_profile-pic" alt="Profile Pic" />
                            </div>
                            <div className='jm-user-profile-name'>
                                <span className="jm-submission-title">박지민님</span>
                            </div>
                        </div>
                    </div>
                    <div className="jm-task-list">
                        {['스트레칭 하기', '물 마시기', '500미터 걷기', '500미터 걷기', '500미터 걷기'].map((task, taskIndex) => (
                        <div key={taskIndex} className="jm-task-card">
                            <span className='jm-task-title'>{task}</span>
                            <button className="jm-btn-primary" onClick={handleOpenModal}>승인대기</button><br/><br/>
                            <img className="jm-task-img"src="https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" alt='제출한 미션 이미지'></img>
                            <div className='jm-task-comment-container'>
                                <p className="jm-task-comment">제출한 코멘트</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Modal */}
            {isModalOpen && (
                <div className="jm-info-modal-overlay">
                    <div className="jm-modal-content">
                        <div className='jm-modal-user-profile-container'>
                            <button className="jm-close-button" onClick={handleCloseModal}>
                            &times;
                            </button>
                            <div className="jm-modal-user-profile-img-card">
                                <img src="https://via.placeholder.com/100" className="yc_challenge_profile-pic" alt="Profile Pic" />
                            </div>
                            <div className='jm-modal-user-profile-name'>
                                <span className="jm-modal-submission-title">박지민님</span>
                            </div>
                        </div>
                        <h3 className='jm-modal-mission-tatle'>500미터 걷기</h3>
                        <div className='jm-info-modal-img'>
                            <img src="https://img.freepik.com/free-photo/group-people-working-out-together-outdoors_23-2149891452.jpg" alt="미션 이미지" />
                        </div>
                        <div className='jm-modal-comment-container'>
                            <p>용찬우님이 적은 코멘트 입니다</p>
                        </div>
                        <div className="jm-info-modal-button">
                            <button className="jm-info-modal-button-ok" onClick={handleCloseModal}>승인</button>
                            <button className="jm-info-modal-button-no" onClick={handleCloseModal}>거절</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
        <ChatRoom/>
        </>
    );
}

export default Missioninfo;
