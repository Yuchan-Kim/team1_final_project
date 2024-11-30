// ChallengeStatusIndicator.jsx
import React from 'react';

const ChallengeStatusIndicator = ({ startDate, endDate, roomStatusNum, roomStatusName }) => {
    console.log("ChallengeStatusIndicator received roomStatusNum:", roomStatusNum);
    const now = new Date();
    const challengeStart = new Date(startDate);
    const daysUntilStart = Math.ceil((challengeStart - now) / (1000 * 60 * 60 * 24));

    let badgeClass = 'hmk_badge-gray';
    let status = '알 수 없음';
    let showDDay = false;

    // roomStatusNum 또는 roomStatusName에 따른 상태 설정
    if (roomStatusNum) {
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
            case 3: // 진행 중
                status = '진행 중';
                badgeClass = 'hmk_badge-green';
                break;
            case 4: // 종료
                status = '종료';
                badgeClass = 'hmk_badge-gray';
                break;
            default:
                status = '알 수 없음';
                badgeClass = 'hmk_badge-gray';
                break;
        }
    } else if (roomStatusName) {
        // roomStatusName을 기반으로 상태 설정
        switch (roomStatusName) {
            case '모집 전':
                status = '모집 전';
                badgeClass = 'hmk_badge-red';
                showDDay = true;
                break;
            case '모집 중':
                status = '모집 중';
                badgeClass = 'hmk_badge-orange';
                showDDay = true;
                break;
            case '진행 중':
                status = '진행 중';
                badgeClass = 'hmk_badge-green';
                break;
            case '종료':
                status = '종료';
                badgeClass = 'hmk_badge-gray';
                break;
            default:
                status = '알 수 없음';
                badgeClass = 'hmk_badge-gray';
                break;
        }
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
