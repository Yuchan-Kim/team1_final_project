// src/components/admin/AdminAddItemBrand.jsx

import React, { useState } from 'react';
import axios from 'axios';
import '../admincss/adminadditembrand.css'; // 새 CSS 파일

const AdminAddItemBrand = ({ onSuccess, onClose }) => {
    const [brandName, setBrandName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddBrand = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!brandName) {
            setError('브랜드 이름을 입력해주세요.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/itembrands`, {
                itemBrandName: brandName,
            });

            if (response.data.result === 'success') {
                alert('아이템 브랜드가 성공적으로 추가되었습니다!');
                onSuccess();
            } else {
                setError(response.data.message || '아이템 브랜드 추가에 실패했습니다.');
            }
        } catch (err) {
            console.error('아이템 브랜드 추가 중 오류 발생:', err);
            setError('아이템 브랜드 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="yc-add-brand-modal">
            <div className="yc-add-brand-content">
                <h3>아이템 브랜드 추가</h3>
                <form onSubmit={handleAddBrand} className="yc-add-brand-form">
                    <div className="yc-form-group">
                        <label htmlFor="yc-brandName">브랜드 이름</label>
                        <input
                            type="text"
                            id="yc-brandName"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="yc-error-message">{error}</p>}
                    <div className="yc-button-group">
                        <button type="submit" className="yc-submit-button" disabled={loading}>
                            {loading ? '추가 중...' : '추가'}
                        </button>
                        <button type="button" className="yc-cancel-button" onClick={onClose}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddItemBrand;
