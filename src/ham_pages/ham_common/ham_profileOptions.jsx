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
    // Improved image path processing with validation
    const safeProfiles = useMemo(() => (
        (Array.isArray(profiles) ? profiles : [])
            .map(src => {
                if (!src || typeof src !== 'string') return null;
                return src.startsWith('/images') ? src : `/images${src}`;
            })
            .filter(Boolean)
    ), [profiles]);

    // Optimized profile selection handler
    const handleProfileClick = useCallback((src) => {
        if (src?.trim()) {
            const relativePath = src.replace('/images', '');
            onSelect(relativePath);
        }
    }, [onSelect]);

    // Error boundary component
    const ImageWithFallback = memo(({ src, index, isSelected }) => (
        <img
            src={src}
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
                                    isSelected={selectedProfile === src.replace('/images', '')}
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