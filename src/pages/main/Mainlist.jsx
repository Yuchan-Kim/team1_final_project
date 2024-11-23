import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@rsuite/icons/Search';
import '../../css/reset.css';
import '../../css/jy_main.css';
import Header from '../include/DH_Header';

const Mainlist = () => {
    const location = useLocation();
    const navigate = useNavigate(); // navigate 초기화
    const [roomList, setRoomList] = useState([]); // 검색 결과 리스트
    const [roomType, setRoomType] = useState([]); // 방 유형
    const [category, setCategory] = useState([]); // 카테고리
    const [period, setPeriod] = useState([]); // 기간
    const [regions, setRegions] = useState([]); // 지역
    const [filters, setFilters] = useState({
        roomType: [],
        category: 'all',
        period: 'all',
        region: 'all',
    });
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태

    const [filteredRooms, setFilteredRooms] = useState([]); // 필터링된 방 리스트
    const [query, setQuery] = useState(''); // 검색어 상태

    // URL에서 쿼리 파라미터 추출
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('query') || '';
        setQuery(searchQuery);

        if (searchQuery) {
            fetchRoomList(searchQuery);
        }
    }, [location.search]);

    //검색어 전달 -> 페이지 이동
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 Enter 동작 방지 (예: 폼 제출)
            navigate(`/mainlist?query=${searchTerm}`); // 검색어를 쿼리 파라미터로 전달하며 이동
        }
    };

    // 검색 결과 가져오기
    const fetchRoomList = (searchQuery) => {
        axios.get('http://localhost:9000/api/roomFilter/search', { params: { query: searchQuery } })
            .then((response) => {
                if (response.data.result === 'success') {
                    setRoomList(response.data.apiData || []);
                    setFilteredRooms(response.data.apiData || []); // 초기 필터링 결과는 검색 결과와 동일
                }
            })
            .catch((error) => console.error(error));
    };

    // 필터링 데이터 가져오기
    useEffect(() => {
        axios.get('http://localhost:9000/api/Roomtype').then((response) => {
            if (response.data.result === 'success') setRoomType(response.data.apiData || []);
        });

        axios.get('http://localhost:9000/api/Category').then((response) => {
            if (response.data.result === 'success') setCategory(response.data.apiData || []);
        });

        axios.get('http://localhost:9000/api/Period').then((response) => {
            if (response.data.result === 'success') setPeriod(response.data.apiData || []);
        });

        axios.get('http://localhost:9000/api/Regions').then((response) => {
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

    // 필터 변경 핸들러
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
                                placeholder="방 제목, 키워드, 카테고리, 방 유형 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // 검색어 상태 업데이트
                                onKeyDown={handleSearchKeyDown} // Enter 키 감지
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
                        {filteredRooms && filteredRooms.length > 0 ? (
                            filteredRooms.map((room) => (
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
                </div>
            </div>
        </>
    );
};

export default Mainlist;
