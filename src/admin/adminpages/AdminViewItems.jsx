import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { useNavigate, Link } from 'react-router-dom';
import '../admincss/adminviewitems.css';

import Header from '../../pages/include/DH_Header.jsx';
import Footer from '../../pages/include/JM-Footer.jsx';

const ViewItems = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/items`);
                if (response.data.result === 'success') {
                    setItems(response.data.apiData);
                    setFilteredItems(response.data.apiData);
                } else {
                    setError(response.data.message || '상품 데이터를 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                console.error("상품 데이터를 가져오는 중 오류 발생:", err);
                setError('상품 데이터를 가져오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredItems(items);
        } else {
            setFilteredItems(
                items.filter(item =>
                    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.itemBrandName && item.itemBrandName.toLowerCase().includes(searchTerm.toLowerCase()))
                )
            );
        }
        setCurrentPage(0); // 검색 시 페이지 초기화
    }, [searchTerm, items]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleDelete = async (itemNum) => {
        if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/items/${itemNum}`);
                if (response.data.result === 'success') {
                    alert('상품이 성공적으로 삭제되었습니다.');
                    setItems(items.filter(item => item.itemNum !== itemNum));
                } else {
                    alert(response.data.message || '상품 삭제에 실패했습니다.');
                }
            } catch (err) {
                console.error("상품 삭제 중 오류 발생:", err);
                alert('상품 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const handleEdit = (itemNum) => {
        navigate(`/admin/edit-item/${itemNum}`);
    };

    // 페이징 처리
    const offset = currentPage * itemsPerPage;
    const currentItems = filteredItems.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <>
        <Header />
        <div id ="admin-wrap">

        
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
        
        <div className="view-items-container">
            <h2>모든 상품 보기</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="상품 이름 또는 브랜드로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : filteredItems.length > 0 ? (
                <>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>이미지</th>
                                <th>이름</th>
                                <th>브랜드</th> {/* 브랜드 컬럼 추가 */}
                                <th>설명</th>
                                <th>가격</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(item => (
                                <tr key={item.itemNum}>
                                    <td>{item.itemNum}</td>
                                    <td>
                                        {item.itemImg ? (
                                            <img src={item.itemImg} alt={item.itemName} className="item-image" />
                                        ) : (
                                            'No Image'
                                        )}
                                    </td>
                                    <td>{item.itemName}</td>
                                    <td>{item.itemBrandName}</td> {/* 브랜드 이름 표시 */}
                                    <td>{item.description}</td>
                                    <td>₩{item.itemCost.toLocaleString()}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(item.itemNum)}>
                                            <FaEdit />
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(item.itemNum)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={"이전"}
                        nextLabel={"다음"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        previousLinkClassName={"pagination-link"}
                        nextLinkClassName={"pagination-link"}
                        disabledClassName={"pagination-disabled"}
                        activeLinkClassName={"pagination-active-link"}
                    />
                </>
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
        </div>
        <Footer />
        </>
    );
};

export default ViewItems;
