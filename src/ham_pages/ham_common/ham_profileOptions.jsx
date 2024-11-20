// src/ham_pages/ham_common/ham_profileOptions.jsx

import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import defaultProfile from '../../ham_asset/images/profile-fill.png';

const ProfileOptions = ({
    profiles,
    selectedProfile,
    onSelect,
    onConfirm,
    onCancel
}) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';

    const safeProfiles = useMemo(() => {
        if (!Array.isArray(profiles)) {
            console.warn('Profiles prop is not an array');
            return [];
        }
        return profiles.filter(src => typeof src === 'string' && src.trim().length > 0);
    }, [profiles]);

    const handleProfileClick = useCallback((src) => {
        if (typeof src === 'string' && src.trim().length > 0) {
            const relativePath = src.startsWith(apiUrl) ? src.replace(apiUrl, '') : src;
            onSelect(relativePath);
        }
    }, [onSelect, apiUrl]);

    return (
        <div className="hmk_profile-options-container">
            <div className="hmk_profile-options">
                {safeProfiles.length > 0 ? (
                    safeProfiles.map((src, index) => (
                        <div key={`profile-${index}-${src}`} className="hmk_profile-option-item">
                            <img
                                src={src.startsWith('http') ? src : `${apiUrl}${src}`}
                                alt={`프로필 선택 ${index + 1}`}
                                onClick={() => handleProfileClick(src)}
                                className={`hmk_profile-image ${selectedProfile === src.replace(apiUrl, '') ? "hmk_selected-profile" : ""}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultProfile;
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="hmk_profile-option-item">
                        <p>구매한 프로필 이미지가 없습니다. 상점에서 새로운 프로필 이미지를 구매하세요.</p>
                        <img src={defaultProfile} alt="기본 프로필" className="hmk_profile-image" />
                    </div>
                )}
            </div>
            <div className="hmk_profile-actions">
                <button
                    onClick={onConfirm}
                    className="hmk_modal-confirm-button"
                    disabled={!selectedProfile}
                >
                    확인
                </button>
                <button
                    onClick={onCancel}
                    className="hmk_modal-cancel-button"
                >
                    취소
                </button>
            </div>
        </div>
    );
};

ProfileOptions.propTypes = {
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedProfile: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

// 컴포넌트 이름 지정
ProfileOptions.displayName = 'ProfileOptions';

// default export 추가
export default ProfileOptions;