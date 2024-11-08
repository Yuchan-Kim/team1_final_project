import React, { useState } from 'react';
import '../yc_assets/yc_css/jmyc_challenge_header.css'; // CSS 파일 경로를 적절히 변경하세요
import Sidebar from "./YC_challenge_sidebar.jsx";

const JMYCChallengeHeader = ({ userType }) => {
    // 참여자 상태 (참여 여부)
    const [isJoined, setIsJoined] = useState(false);
    
    // 챌린지 상태 (모집 중인지 여부)
    const [isRecruiting, setIsRecruiting] = useState(true);

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
        setIsRecruiting(false);
        setShowStartChallengeModal(false);
    };

    const handleCancelStartChallenge = () => {
        setShowStartChallengeModal(false);
    };

    return (
        <div className="jm-challenge-header">
            {/* Room Header */}
            <div className="jm-room-header">
                <h1 className="jm-c-title">매일 500m 걷기</h1>
                <p className="jm-c-time">챌린지 종료: 5d 2h 30m 32s</p>
                
                {/* 버튼 영역 */}
                {userType === 'host' ? (
                    isRecruiting ? (
                        <button className="jm-c-start" onClick={handleStartRecruitClick}>
                            모집 시작
                        </button>
                    ) : (
                        <button className="jm-c-start" onClick={handleStartChallengeClick}>
                            챌린지 시작
                        </button>
                    )
                ) : (
                    !isJoined && (
                        <button className="jm-c-start" onClick={handleJoinClick}>
                            참가하기
                        </button>
                    )
                )}
            </div>

            {/* Tags */}
            <div className="jm-tags">
                <span className="jm-tag-box">챌린지</span>
                <span className="jm-tag-box">운동</span>
                <span className="jm-tag-box">걷기</span>
                <span className="jm-tag-box">서울</span>
            </div>

            {/* 참여자용 모달 */}
            {showJoinModal && (
                <div className="yc-modal-overlay">
                    <div className="yc-modal">
                        <p>참여 하시겠습니까?</p>
                        <div className="yc-modal-buttons">
                            <button className="yc-modal-confirm" onClick={handleConfirmJoin}>확인</button>
                            <button className="yc-modal-cancel" onClick={handleCancelJoin}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 방장용 모집 시작 모달 */}
            {showStartRecruitModal && (
                <div className="yc-modal-overlay">
                    <div className="yc-modal">
                        <p>맴버 모집을 시작 하시겠습니까?</p>
                        <div className="yc-modal-buttons">
                            <button className="yc-modal-confirm" onClick={handleConfirmStartRecruit}>확인</button>
                            <button className="yc-modal-cancel" onClick={handleCancelStartRecruit}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 방장용 챌린지 시작 모달 */}
            {showStartChallengeModal && (
                <div className="yc-modal-overlay">
                    <div className="yc-modal">
                        <p>챌린지를 시작하시겠습니까?</p>
                        <div className="yc-modal-buttons">
                            <button className="yc-modal-confirm" onClick={handleConfirmStartChallenge}>확인</button>
                            <button className="yc-modal-cancel" onClick={handleCancelStartChallenge}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JMYCChallengeHeader;
