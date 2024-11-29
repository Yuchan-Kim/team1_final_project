// AddItem.jsx

import React, { useState, useEffect ,useRef} from 'react';
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
    const [savedImage, setSavedImage] = useState(null); // 서버에서 가져온 기존 이미지
    const fileInputRef = useRef(null); // 파일 입력 필드 참조

    const [itemBrands, setItemBrands] = useState([]);
    const [showAddBrand, setShowAddBrand] = useState(false);

    useEffect(() => {
        fetchItemBrands(); 
        getItemInfo();
    }, []);

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

    //아이템 정보 가져오기
    const getItemInfo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/iteminfo/${itemNum}`);
            if (response.data.result === 'success') {
                const item = response.data.apiData;
                setItemBrandNum(item.itemBrandNum);
                setItemName(item.itemName);
                setImage(item.itemImg);
                setPrice(item.itemCost);
            } else {
                console.error(response.data.message || '아이템 정보를 불러오는 중 오류 발생');
            }
        } catch (err) {
            console.error("아이템 정보 불러오기 실패:", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // base64 URL로 설정
            };
            reader.readAsDataURL(file); // 파일 읽기
        }
    };

    const resetFileInput = () => {
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // 파일 입력 필드 초기화
        }
    };







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
    
        // 새로 업로드된 이미지가 있는 경우 추가
        if (fileInputRef.current?.files[0]) {
            formData.append('image', fileInputRef.current.files[0]);
        } else {
            // 이미지가 변경되지 않았다면 서버에 기존 이미지를 유지하도록 요청
            formData.append('savedImage', savedImage);
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
                            step="1"
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
                    <div>
                        <h2>이미지 수정</h2>

                        {/* 기존 이미지 */}
                        {savedImage && (
                            <div>
                                <h3>저장된 이미지</h3>
                                <img src={savedImage} alt="Saved" style={{ width: '200px', height: 'auto' }} />
                            </div>
                        )}

                        {/* 새로 업로드된 이미지 미리보기 */}
                        {image && (
                            <div>
                                <h3>미리보기</h3>
                                <img src={image} alt="Preview" style={{ width: '200px', height: 'auto' }} />
                            </div>
                        )}

                        {/* 파일 입력 */}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                            <button type="button" onClick={resetFileInput}>초기화</button>
                        </div>
                    </div>
                    {error && <p className="yc-error-message">{error}</p>}
                    <button type="submit" className="yc-submit-button" disabled={loading}>
                        {loading ? '변경 중...' : '상품 정보 변경'}
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
