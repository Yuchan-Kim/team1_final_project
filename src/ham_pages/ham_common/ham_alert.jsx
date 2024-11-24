// src/ham_pages/ham_common/ham_alert.jsx
import React from 'react';
import '../../ham_asset/css/ham_alert.css';

const Alert = ({ isOpen, message, onClose, type = 'success' }) => {
    if (!isOpen) return null;

    return (
        <div className="hmk_alert_overlay">
            <div className={`hmk_alert_container ${type}`}>
                <div className="hmk_alert_icon">
                    {type === 'success' ? '✔️' : '❌'}
                </div>
                <div className="hmk_alert_message">
                    {message}
                </div>
                <button className="hmk_alert_button" onClick={onClose}>
                    확인
                </button>
            </div>
        </div>
    );
};

export default Alert;