import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@rsuite/icons/Search';
import '../../css/reset.css';
import '../../css/jy_main.css';
import Header from '../include/DH_Header';

const Mainlist = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [roomList, setRoomList] = useState([]);
    const [roomType, setRoomType] = useState([]);
    const [category, setCategory] = useState([]);
    const [period, setPeriod] = useState([]);
    const [regions, setRegions] = useState([]);
    const [filters, setFilters] = useState({
        roomType: [],
        category: 'all',
        period: 'all',
        region: 'all',
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // 검색어와 URL 파라미터 처리
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('query') || '';
        setQuery(searchQuery);

        if (searchQuery) {
            fetchRoomList(searchQuery);
        }
    }, [location.search]);

    // 검색 실행
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            navigate(`/mainlist?query=${searchTerm}`);
        }
    };

    // 데이터 가져오기
    const fetchRoomList = (searchQuery) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/roomFilter/search`, { params: { query: searchQuery } })
            .then((response) => {
                if (response.data.result === 'success') {
                    setRoomList(response.data.apiData || []);
                    setFilteredRooms(response.data.apiData || []);
                }
            })
            .catch((error) => console.error(error));
    };

    // 필터 데이터 가져오기
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/Roomtype`).then((response) => {
            if (response.data.result === 'success') setRoomType(response.data.apiData || []);
        });

        axios.get(`${process.env.REACT_APP_API_URL}/api/Category`).then((response) => {
            if (response.data.result === 'success') setCategory(response.data.apiData || []);
        });

        axios.get(`${process.env.REACT_APP_API_URL}/api/Period`).then((response) => {
            if (response.data.result === 'success') setPeriod(response.data.apiData || []);
        });

        axios.get(`${process.env.REACT_APP_API_URL}/api/Regions`).then((response) => {
            if (response.data.result === 'success') setRegions(response.data.apiData || []);
        });
    }, []);

    // 필터링 적용
    useEffect(() => {
        const filtered = roomList.filter((room) => {
            const matchesRoomType =
                filters.roomType.length === 0 || filters.roomType.includes(room.roomTypeName);
            const matchesCategory =
                filters.category === 'all' || room.categoryName === filters.category;
            const matchesPeriod =
                filters.period === 'all' || room.periodType === parseInt(filters.period, 10);
            const matchesRegion =
                filters.region === 'all' || room.regionName === filters.region;

            return matchesRoomType && matchesCategory && matchesPeriod && matchesRegion;
        });
        setFilteredRooms(filtered);
    }, [filters, roomList]);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleRoomTypeChange = (e) => {
        const { value, checked } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            roomType: checked
                ? [...prevFilters.roomType, value]
                : prevFilters.roomType.filter((type) => type !== value),
        }));
    };

    return (
        <>
            <Header />
            <div id="jy_wrap" className="jy_wrap">
                <div className="jy_main" id="jy_main">
                    {/* 검색창 */}
                    <div id="search">
                        <div>
                            <SearchIcon />
                            <input
                                placeholder="검색어를 입력하세요"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>
                    </div>

                    {/* 필터 */}
                    <div id="search-bar">
                        <div id="search-bar1">
                            {roomType.map((type) => (
                                <div key={type.id}>
                                    <input
                                        type="checkbox"
                                        id={`roomType_${type.id}`}
                                        value={type.name}
                                        onChange={handleRoomTypeChange}
                                    />
                                    <label htmlFor={`roomType_${type.id}`}>{type.roomTypeName}</label>
                                </div>
                            ))}
                        </div>
                        <div id="search-bar2">
                            <div className="jm-Category-select">
                                <span>카테고리</span>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">전체</option>
                                    {category.map((cat) => (
                                        <option key={cat.id} value={cat.categoryName}>
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="jm-date-select">
                                <span>기간</span>
                                <select name="period" value={filters.period} onChange={handleFilterChange}>
                                    <option value="all">전체</option>
                                    {period.map((per) => (
                                        <option key={per.id} value={per.periodType}>
                                            {per.periodType}주
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="jm-region-select">
                                <span>지역</span>
                                <select name="region" value={filters.region} onChange={handleFilterChange}>
                                    <option value="all">전체</option>
                                    {regions.map((region) => (
                                        <option key={region.id} value={region.regionName}>
                                            {region.regionName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 방 리스트 */}
                    <div id="list">
                        {currentItems.length > 0 ? (
                            currentItems.map((room) => (
                                <div key={room.roomNum}>
                                    <Link to={`/cmain/${room.roomNum}`} className="list_bang">
                                        <div className="bang_level">
                                            <div>{room.roomTypeName}</div>
                                        </div>
                                        <div className="bang_img">
                                            <img
                                                src={room.roomThumbNail || "/img/default-room.jpg"}
                                                alt={`${room.roomTitle} 방 썸네일`}
                                            />
                                        </div>
                                        <div className="jm-main-room-tatle">{room.roomTitle}</div>
                                        <div className="jm-main-room-date">
                                            <span>예상시작일</span> {room.roomStartDate}
                                        </div>
                                        <div className="jm-main-room-date">
                                            <span>기간</span> {room.periodType}주
                                        </div>
                                        <div className="bang_info">
                                            <div className="bang_info_left">
                                                <div>
                                                    <span>인원</span> {room.roomMinNum}/{room.roomMaxNum}
                                                </div>
                                            </div>
                                            <div className="bang_info_right">
                                                <div>
                                                    <span>포인트</span> {room.roomPoint} pt
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bang_sub">
                                            {room.roomKeyword.split(',').map((keyword, idx) => (
                                                <span key={idx} className="tab01">#{room.categoryName} #{keyword} #{room.regionName}</span>
                                            ))}
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div>검색 결과가 없습니다.</div>
                        )}
                    </div>

                    {/* 페이지네이션 */}
                    <div id="pagination">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={index + 1 === currentPage ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mainlist;
