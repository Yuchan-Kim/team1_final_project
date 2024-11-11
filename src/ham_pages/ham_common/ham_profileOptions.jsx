// src/ham_pages/ham_common/ham_profileOptions.jsx

import React from 'react';
import PropTypes from 'prop-types';

const ProfileOptions = ({ profiles, selectedProfile, onSelect }) => {
    return (
        <div className="hmk_profile-options-container">
            <div className="hmk_profile-options">
                {profiles.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`프로필 선택 ${index + 1}`}
                        onClick={() => onSelect(src)}
                        className={selectedProfile === src ? "hmk_selected-profile" : ""}
                    />
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