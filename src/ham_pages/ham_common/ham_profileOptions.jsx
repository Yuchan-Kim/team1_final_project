import React, { useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_PROFILE = '/images/profile-fill.png';

const ProfileOptions = memo(({
    profiles = [],
    selectedProfile = null,
    onSelect,
    onConfirm,
    onCancel
}) => {
    const safeProfiles = useMemo(() => (
        (Array.isArray(profiles) ? profiles : [])
            .map(src => {
                if (!src || typeof src !== 'string') return null;
                const apiUrl = process.env.REACT_APP_API_URL || 'http://13.125.216.39:9000';
                return src.startsWith('http') ? src : `${apiUrl}${src.startsWith('/') ? src : `/upload/${src}`}`;
            })
            .filter(Boolean)
    ), [profiles]);

    const handleProfileClick = useCallback((src) => {
        if (src?.trim()) {
            let relativePath;
            if (src.includes('/upload/')) {
                // 전체 URL에서 /upload/ 이후의 경로만 추출
                relativePath = '/upload/' + src.split('/upload/')[1];
            } else {
                relativePath = src;
            }
            onSelect(relativePath);
        }
    }, [onSelect]);

    // 선택된 이미지 비교를 위한 헬퍼 함수
    const isImageSelected = useCallback((src) => {
        if (!selectedProfile || !src) return false;
        
        // 경로에서 파일명만 추출하여 비교
        const getFileName = (path) => path.split('/').pop();
        return getFileName(selectedProfile) === getFileName(src);
    }, [selectedProfile]);

    const ImageWithFallback = memo(({ src, index, isSelected }) => (
        <img
            src={src.startsWith('http') ? src : `/upload/${src.split('/upload/').pop()}`}
            alt={`프로필 선택 ${index + 1}`}
            onClick={() => handleProfileClick(src)}
            className={`hmk_profile-image ${isSelected ? "hmk_selected-profile" : ""}`}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_PROFILE;
            }}
        />
    ));

    ImageWithFallback.displayName = 'ImageWithFallback';

    return (
        <div className="hmk_profile-options-container">
            <div className="hmk_profile-scroll-area">
                <div className="hmk_profile-options">
                    {safeProfiles.length > 0 ? (
                        safeProfiles.map((src, index) => (
                            <div
                                key={`profile-${index}-${src}`}
                                className="hmk_profile-option-item"
                            >
                                <ImageWithFallback
                                    src={src}
                                    index={index}
                                    isSelected={isImageSelected(src)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="hmk_profile-option-item">
                            <p>구매한 프로필 이미지가 없습니다. 상점에서 새로운 프로필 이미지를 구매하세요.</p>
                            <img
                                src={DEFAULT_PROFILE}
                                alt="기본 프로필"
                                className="hmk_profile-image"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="hmk_profile-options_btn">
                <div className="hmk_profile-actions">
                    <button
                        onClick={onConfirm}
                        className="hmk_modal-confirm-button"
                        disabled={!selectedProfile}
                        aria-label="프로필 선택 확인"
                    >
                        확인
                    </button>
                    <button
                        onClick={onCancel}
                        className="hmk_modal-cancel-button"
                        aria-label="프로필 선택 취소"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
});

ProfileOptions.displayName = 'ProfileOptions';

ProfileOptions.propTypes = {
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedProfile: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default ProfileOptions;