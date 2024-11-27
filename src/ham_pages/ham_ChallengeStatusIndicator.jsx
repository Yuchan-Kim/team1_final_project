// ChallengeStatusIndicator.jsx
import React from 'react';

const ChallengeStatusIndicator = ({ startDate, endDate, roomStatusNum }) => {
    const now = new Date();
    const challengeStart = new Date(startDate);
    const daysUntilStart = Math.ceil((challengeStart - now) / (1000 * 60 * 60 * 24));

    let badgeClass = 'hmk_badge-green';
    let status = '진행 중';
    let showDDay = false;

    // roomStatusNum에 따른 상태 설정
    switch (roomStatusNum) {
        case 1: // 모집 전
            status = '모집 전';
            badgeClass = 'hmk_badge-red';
            showDDay = true;
            break;
        case 2: // 모집 중
            status = '모집 중';
            badgeClass = 'hmk_badge-orange';
            showDDay = true;
            break;
        case 3: // 시작
            status = '진행 중';
            badgeClass = 'hmk_badge-green';
            break;
        case 4: // 종료
            status = '종료';
            badgeClass = 'hmk_badge-gray';
            break;
        default:
            break;
    }

    return (
        <div className="hmk_status-container">
            <span className={`hmk_status-badge ${badgeClass}`}>
                {status}
            </span>
            {showDDay && daysUntilStart > 0 && (
                <span className="hmk_dday-badge">
                    D-{daysUntilStart}
                </span>
            )}
        </div>
    );
};

export default ChallengeStatusIndicator;