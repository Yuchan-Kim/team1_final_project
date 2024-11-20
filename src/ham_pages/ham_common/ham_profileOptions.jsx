import React from 'react';
import PropTypes from 'prop-types';
import defaultProfile from '../../ham_asset/images/profile-fill.png'; // 기본 프로필 이미지 import

const ProfileOptions = ({ profiles, selectedProfile = '', onSelect }) => {
    // 프로필 배열 유효성 검사 및 필터링
    const safeProfiles = React.useMemo(() => {
        if (!Array.isArray(profiles)) {
            console.warn('Profiles prop is not an array');
            return [];
        }
        return profiles.filter(src => typeof src === 'string' && src.trim().length > 0);
    }, [profiles]);

    // handleProfileClick 함수를 useCallback으로 메모이제이션
    const handleProfileClick = React.useCallback((src) => {
        if (typeof src === 'string' && src.trim().length > 0) {
            onSelect(src);
        }
    }, [onSelect]);

    // 프로필 이미지가 없을 때의 처리
    if (safeProfiles.length === 0) {
        return (
            <div className="hmk_profile-options-container">
                <div className="hmk_profile-options">
                    <div className="hmk_profile-option-item">
                        <img
                            src={defaultProfile}
                            alt="기본 프로필"
                            title='프로필이 없어요'
                            className="hmk_profile-image"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // 수정: 기존 렌더링 로직 개선
    return (
        <div className="hmk_profile-options-container">
            <div className="hmk_profile-options">
                {safeProfiles.map((src, index) => (
                    <div
                        key={`profile-${index}-${src}`} // 수정: 더 안정적인 key 값 사용
                        className="hmk_profile-option-item"
                    >
                        <img
                            src={src}
                            alt={`프로필 선택 ${index + 1}`}
                            onClick={() => handleProfileClick(src)}
                            className={`hmk_profile-image ${selectedProfile === src ? "hmk_selected-profile" : ""}`}
                            style={{ 
                                cursor: 'pointer', 
                                margin: '5px', 
                                borderRadius: '50%', 
                                width: '50px', 
                                height: '50px' 
                            }}
                            // 새로 추가: 이미지 로드 실패 시 기본 이미지로 대체
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = defaultProfile;
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// PropTypes 수정: 더 상세한 타입 검사 추가
ProfileOptions.propTypes = {
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedProfile: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
};


export default React.memo(ProfileOptions); // 수정: 성능 최적화를 위한 메모이제이션 추가