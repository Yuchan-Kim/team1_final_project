// src/ham_common/ham_profileOptions.jsx

import React from 'react';
import PropTypes from 'prop-types';

const ProfileOptions = ({ profiles, selectedProfile, onSelect }) => {
    const handleProfileClick = (src) => {
        onSelect(src);
    };

    return (
        <div className="hmk_profile-options-container">
            <div className="hmk_profile-options">
                {profiles.map((src, index) => (
                    <div
                        key={index}
                        className="hmk_profile-option-item"
                    >
                        <img
                            src={src}
                            alt={`프로필 선택 ${index + 1}`}
                            onClick={() => handleProfileClick(src)}
                            className={`hmk_profile-image ${selectedProfile === src ? "hmk_selected-profile" : ""}`}
                            style={{ cursor: 'pointer', margin: '5px', borderRadius: '50%', width: '50px', height: '50px' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

ProfileOptions.propTypes = {
    profiles: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedProfile: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
};

export default ProfileOptions;