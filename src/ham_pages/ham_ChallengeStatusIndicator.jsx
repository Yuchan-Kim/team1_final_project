import React from 'react';

const ChallengeStatusIndicator = ({ startDate, endDate, roomStatusNum, roomStatusName }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const challengeStart = new Date(startDate);
    challengeStart.setHours(0, 0, 0, 0);
    const timeDiff = challengeStart - now;
    const daysUntilStart = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    let badgeClass = 'hmk_badge-gray';
    let status = '알 수 없음';
    let showDDay = false;

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
                showDDay = true; // 모집 중에도 D-day 표시하도록 변경
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
        switch (roomStatusName) {
            case '모집 전':
                status = '모집 전';
                badgeClass = 'hmk_badge-red';
                showDDay = true;
                break;
            case '모집 중':
                status = '모집 중';
                badgeClass = 'hmk_badge-orange';
                showDDay = true; // 모집 중에도 D-day 표시하도록 변경
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
            {showDDay && (
                <span className={`hmk_dday-badge ${daysUntilStart <= 0 ? 'hmk_dday-red' : ''}`}>
                    {daysUntilStart <= 0 ? 'D-day' : `D-${daysUntilStart}`}
                </span>
            )}
        </div>
    );
};

export default ChallengeStatusIndicator;