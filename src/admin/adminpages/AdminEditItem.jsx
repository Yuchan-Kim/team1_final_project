// AddItem.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import AdminLayout from '../adminpages/AdminLayout'; // 공통 레이아웃 임포트
import AddItemBrand from '../adminpages/AdminAddItemBrand'; // 새 컴포넌트 임포트
import '../admincss/adminadditem.css';

const AdminEditItem = () => {
    const navigate = useNavigate();
    const {itemNum} = useParams();
    const [itemName, setItemName] = useState('');
    const [itemCost, setPrice] = useState('');
    const [itemBrandNum, setItemBrandNum] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [itemBrands, setItemBrands] = useState([]);
    const [showAddBrand, setShowAddBrand] = useState(false);

    useEffect(() => {
        // 아이템 브랜드 목록 가져오기
        const fetchItemBrands = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/itembrands`);
                if (response.data.result === 'success') {
                    setItemBrands(response.data.apiData);
                } else {
                    console.error(response.data.message || '아이템 브랜드 목록을 불러오는 중 오류 발생');
                }
            } catch (err) {
                console.error('아이템 브랜드 목록을 불러오는 중 오류 발생:', err);
            }
        }; 

        //아이템 정보 가져오기
        const getItemInfo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/iteminfo/${itemNum}`);
                    if (response.data.result === 'success') {
                        setItemBrands(response.data.apiData.itemBrandName);
                        setItemName(response.data.apiData.itemName);
                        setImage(response.data.apiData.itemImg);
                        setPrice(response.data.apiData.itemCost);
                    } else {
                        console.error(response.data.message || '아이템 브랜드 목록을 불러오는 중 오류 발생');
                    }
            }catch (err){
                console.error("아이템 정보 불러오기 실패");
            }
        };

        fetchItemBrands();
        getItemInfo();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 유효성 검사
        if (!itemName || !itemCost || !itemBrandNum) {
            setError('모든 필드를 입력해주세요.');
            setLoading(false);
            return;
        }

        if (itemCost <= 0) {
            setError('가격은 0보다 커야 합니다.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('itemName', itemName);
        formData.append('price', itemCost);
        formData.append('category', itemBrandNum); 
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/editItems/${itemNum}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.result === 'success') {
                alert('상품이 성공적으로 변경되었습니다!');
                navigate('/admin/viewitems');
            } else {
                setError(response.data.message || '상품 변경에 실패했습니다.');
            }
        } catch (err) {
            console.error('상품 변경 중 오류 발생:', err);
            setError('상품 변경 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBrandSuccess = () => {
        // 새로운 아이템 브랜드 추가 후 목록 갱신
        const fetchItemBrands = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/itembrands`);
                if (response.data.result === 'success') {
                    setItemBrands(response.data.apiData);
                } else {
                    console.error(response.data.message || '아이템 브랜드 목록을 불러오는 중 오류 발생');
                }
            } catch (err) {
                console.error('아이템 브랜드 목록을 불러오는 중 오류 발생:', err);
            }
        };

        fetchItemBrands();
        setShowAddBrand(false);
    };

    return (
        <AdminLayout>
            <div className="yc-add-item-container">
                <h2>상품 변경</h2>
                <form onSubmit={handleSubmit} className="yc-add-item-form">
                    <div className="yc-form-group">
                        <label htmlFor="yc-itemName">상품 이름</label>
                        <input
                            type="text"
                            id="yc-itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="yc-form-group">
                        <label htmlFor="yc-price">가격</label>
                        <input
                            type="number"
                            id="yc-price"
                            value={itemCost}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="yc-form-group">
                        <label htmlFor="yc-category">아이템 브랜드</label>
                        <div className="yc-category-select">
                            <select
                                id="yc-category"
                                value={itemBrandNum}
                                onChange={(e) => setItemBrandNum(e.target.value)}
                                required
                            >
                                <option value="">-- 선택 --</option>
                                {itemBrands.map((brand) => (
                                    <option key={brand.itemBrandNum} value={brand.itemBrandNum}>
                                        {brand.itemBrandName}
                                    </option>
                                ))}
                            </select>
                            <button type="button" className="yc-add-brand-button" onClick={() => setShowAddBrand(true)}>
                                + 추가
                            </button>
                        </div>
                    </div>
                    <div className="yc-form-group">
                        <label htmlFor="yc-image">이미지 업로드</label>
                        <input
                            type="file"
                            id="yc-image"
                            value={image}
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    {error && <p className="yc-error-message">{error}</p>}
                    <button type="submit" className="yc-submit-button" disabled={loading}>
                        {loading ? '추가 중...' : '상품 추가'}
                    </button>
                </form>

                {showAddBrand && (
                    <AddItemBrand onSuccess={handleAddBrandSuccess} onClose={() => setShowAddBrand(false)} />
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminEditItem;
