import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../ham_asset/css/ham_alert.css';

const ALERT_TIMEOUT = 5000; // 5 seconds

const Alert = memo(({ 
    isOpen = false, 
    message = '', 
    onClose, 
    type = 'success',
    autoClose = true
}) => {
    useEffect(() => {
        let timeoutId;
        if (isOpen && autoClose) {
            timeoutId = setTimeout(onClose, ALERT_TIMEOUT);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isOpen, onClose, autoClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="hmk_alert_overlay"
            role="alert"
            aria-live="polite"
        >
            <div className={`hmk_alert_container ${type}`}>
                <div className="hmk_alert_icon">
                    {type === 'success' ? '✔️' : '❌'}
                </div>
                <div className="hmk_alert_message">
                    {message}
                </div>
                <button 
                    className="hmk_alert_button"
                    onClick={onClose}
                    aria-label="알림 닫기"
                >
                    확인
                </button>
            </div>
        </div>
    );
});

Alert.displayName = 'Alert';

Alert.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['success', 'error']),
    autoClose: PropTypes.bool
};

export default Alert;