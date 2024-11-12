// JMYCChallengeHeader.jsx

import React, { useState } from 'react';
import '../yc_assets/yc_css/jmyc_challenge_header.css'; 

const JMYCChallengeHeader = ({ userType }) => {
    // 참여자 상태 (참여 여부)
    const [isJoined, setIsJoined] = useState(false);
    
    // 챌린지 상태 (모집 중인지 여부)
    const [isRecruiting, setIsRecruiting] = useState(true);

    // 챌린지 시작 여부 상태
    const [isChallengeStarted, setIsChallengeStarted] = useState(false);

    // 모달 상태
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showStartRecruitModal, setShowStartRecruitModal] = useState(false);
    const [showStartChallengeModal, setShowStartChallengeModal] = useState(false);

    const handleJoinClick = () => {
        setShowJoinModal(true);
    };

    const handleConfirmJoin = () => {
        // 참가 로직 추가
        setIsJoined(true);
        setShowJoinModal(false);
    };

    const handleCancelJoin = () => {
        setShowJoinModal(false);
    };

    const handleStartRecruitClick = () => {
        setShowStartRecruitModal(true);
    };

    const handleConfirmStartRecruit = () => {
        // 모집 시작 로직 추가
        setIsRecruiting(false);
        setShowStartRecruitModal(false);
    };

    const handleCancelStartRecruit = () => {
        setShowStartRecruitModal(false);
    };

    const handleStartChallengeClick = () => {
        setShowStartChallengeModal(true);
    };

    const handleConfirmStartChallenge = () => {
        // 챌린지 시작 로직 추가
        setIsRecruiting(false); // 챌린지 시작 후 모집 상태를 false로 변경
        setIsChallengeStarted(true); // 챌린지 시작 상태를 true로 설정
        setShowStartChallengeModal(false);
    };

    const handleCancelStartChallenge = () => {
        setShowStartChallengeModal(false);
    };

    return (
        <div className="jm-challenge-header">
            {/* Room Header */}
            <div className="jm-room-header">
                {/* 제목과 시간을 감싸는 컨테이너 */}
                <div className="yc-header-info">
                    <h1 className="jm-c-title">매일 500m 걷기</h1>
                    <p className="jm-c-time">종료까지: 5d 2h 30m 32s</p>
                </div>
                
                {/* 버튼 영역 */}
                {userType === 'host' ? (
                    isRecruiting && !isChallengeStarted ? (
                        <button className="jm-c-start host" onClick={handleStartRecruitClick}>
                            <span className="emoji"></span>
                            <span className="label">모집</span>
                        </button>
                    ) : (
                        !isChallengeStarted && (
                            <button className="jm-c-start host" onClick={handleStartChallengeClick}>
                                <span className="emoji"></span>
                                <span className="label">챌린지 시작</span>
                            </button>
                        )
                    )
                ) : (
                    !isJoined && (
                        <button className="jm-c-start" onClick={handleJoinClick}>
                            <span className="emoji"></span>
                            <span className="label">+ 참가</span>
                        </button>
                    )
                )}
            </div>

            {/* Tags */}
            <div className="jm-tags">
                <span className="jm-tag-box">#챌린지</span>
                <span className="jm-tag-box">#운동</span>
                <span className="jm-tag-box">#걷기</span>
                <span className="jm-tag-box">#서울</span>
            </div>

            {/* 참여자용 모달 */}
            {showJoinModal && (
                <div className="yc-modal-overlay-header">
                    <div className="yc-modal-header">
                        <p>참여 하시겠습니까?</p>
                        <div className="yc-modal-buttons-header">
                            <button className="yc-modal-confirm-header" onClick={handleConfirmJoin}>확인</button>
                            <button className="yc-modal-cancel-header" onClick={handleCancelJoin}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 방장용 모집 시작 모달 */}
            {showStartRecruitModal && (
                <div className="yc-modal-overlay-header">
                    <div className="yc-modal-header">
                        <p>맴버 모집을 시작 하시겠습니까?</p>
                        <div className="yc-modal-buttons-header">
                            <button className="yc-modal-confirm-header" onClick={handleConfirmStartRecruit}>확인</button>
                            <button className="yc-modal-cancel-header" onClick={handleCancelStartRecruit}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 방장용 챌린지 시작 모달 */}
            {showStartChallengeModal && (
                <div className="yc-modal-overlay-header">
                    <div className="yc-modal-header">
                        <p>챌린지를 시작하시겠습니까?</p>
                        <div className="yc-modal-buttons-header">
                            <button className="yc-modal-confirm-header" onClick={handleConfirmStartChallenge}>확인</button>
                            <button className="yc-modal-cancel-header" onClick={handleCancelStartChallenge}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

};

export default JMYCChallengeHeader;
