import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../admincss/adminadditem.css';

import Header from '../../pages/include/DH_Header.jsx';
import Footer from '../../pages/include/JM-Footer.jsx';

const AddItem = () => {
    const navigate = useNavigate();

    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 유효성 검사
        if (!itemName || !description || !price || !category) {
            setError('모든 필드를 입력해주세요.');
            setLoading(false);
            return;
        }

        if (price <= 0) {
            setError('가격은 0보다 커야 합니다.');
            setLoading(false);
            return;
        }

        if (image) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(image.type)) {
                setError('허용되지 않은 이미지 형식입니다.');
                setLoading(false);
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (image.size > maxSize) {
                setError('이미지 크기는 5MB를 초과할 수 없습니다.');
                setLoading(false);
                return;
            }
        }

        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/items`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.result === 'success') {
                alert('상품이 성공적으로 추가되었습니다!');
                navigate('/admin/view-items');
            } else {
                setError(response.data.message || '상품 추가에 실패했습니다.');
            }
        } catch (err) {
            console.error("상품 추가 중 오류 발생:", err);
            setError('상품 추가 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
       <Header/>
        <div id="admin-wrap">
            <div className="add-item-container">
                {/* aside */}
                <div id="asides-admin">
                            <h2><Link to="/admin/main" rel="noreferrer noopener">관리자 페이지</Link></h2>
                            <div id="sub_list">
                                <ul className='lists'>
                                    <li><Link to="/admin/user" rel="noreferrer noopener">유저 관리</Link></li>
                                    <li><Link to="/admin/point" rel="noreferrer noopener">포인트 상품 관리</Link></li>
                                    <li><Link to="/admin/delivery" rel="noreferrer noopener">챌린지 관리</Link></li>
                                </ul>
                            </div>
                        </div>
                        {/* //aside */}
                <div id ="admin-main">
                <h2>새 상품 추가</h2>
                <form onSubmit={handleSubmit} className="add-item-form">
                    <div className="form-group">
                        <label htmlFor="itemName">상품 이름</label>
                        <input
                            type="text"
                            id="itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">설명</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">가격</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="category">카테고리</label>
                        <input
                            type="text"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">이미지 업로드</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? '추가 중...' : '상품 추가'}
                    </button>
                </form>
                </div>
                
            </div>
    </div>
    <Footer/>
    </>
             
    );
};

export default AddItem;
