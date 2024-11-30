import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchIcon from '@rsuite/icons/Search';
import '../../css/reset.css';
import '../../css/jy_main.css';
import Header from '../include/DH_Header';
import Footert from "../include/JM-Footer.jsx";

const Mainlist = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [roomList, setRoomList] = useState([]); 
    const [roomType, setRoomType] = useState([]); 
    const [category, setCategory] = useState([]); 
    const [period, setPeriod] = useState([]); 
    const [regions, setRegions] = useState([]); 
    const [filters, setFilters] = useState({
        roomType: 'all', // 방 타입 필터 추가 ('all', '일반', '챌린지')
        category: 'all',
        period: 'all',
        region: 'all',
    });
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredRooms, setFilteredRooms] = useState([]); 
    const [query, setQuery] = useState(''); 

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('query') || '';
        setQuery(searchQuery);

        if (searchQuery) {
            fetchRoomList(searchQuery);
        }
    }, [location.search]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            navigate(`/mainlist?query=${searchTerm}`);
        }
    };

    const fetchRoomList = (searchQuery) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/roomFilter/search`, { params: { query: searchQuery } })
            .then((response) => {
                if (response.data.result === 'success') {
                    setRoomList(response.data.apiData || []);
                    setFilteredRooms(response.data.apiData || []);
                    setCurrentPage(1); // Reset to first page on new search
                }
            })
            .catch((error) => console.error(error));
    };

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

    useEffect(() => {
        const filtered = roomList.filter((room) => {
            const matchesRoomType =
                filters.roomType === 'all' || room.roomTypeName === filters.roomType;
            const matchesCategory =
                filters.category === 'all' || room.categoryName === filters.category;
            const matchesPeriod =
                filters.period === 'all' || room.periodType === parseInt(filters.period, 10);
            const matchesRegion =
                filters.region === 'all' || room.regionName === filters.region;

            return matchesRoomType && matchesCategory && matchesPeriod && matchesRegion;
        });
        setFilteredRooms(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [filters, roomList]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber); 
        window.scrollTo({
            top: 0, 
            behavior: 'smooth', 
        });
    };

    // 방 리스트 전부 가져오기
    const getRoomList = () => {
       
        axios({
          method: 'get',
          url: `${process.env.REACT_APP_API_URL}/api/roomList`,

          responseType: 'json'
        }).then(response => {
          if (response.data.result === "success") {
            setRoomList(response.data.apiData); 
          } else {
            console.log(response.data.message); 
          }
        }).catch(error => {
          console.log(error);
        });
      };

      useEffect(() => {
        getRoomList(); // 방리스트 가져오기
    }, []);

    const displayedRooms = filteredRooms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <>
            <Header />
            <div id="jy_wrap" className="jy_wrap">
                <div className="jy_main" id="jy_main">
                    <div id="search">
                        <div>
                            <SearchIcon />
                            <input
                                placeholder="방 제목, 키워드, 카테고리, 방 유형 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>
                    </div>

                    <div id="search-bar">
                        <div id="search-bar1">
                            <div className="jm-room-type-select">
                                <span>방 유형</span>
                                <select
                                    name="roomType"
                                    value={filters.roomType}
                                    onChange={handleFilterChange}
                                >
                                    <option value="all">전체</option>
                                    <option value="일반">일반</option>
                                    <option value="챌린지">챌린지</option>
                                </select>
                            </div>
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

                    <div id="list">
                        {displayedRooms.length > 0 ? (
                            displayedRooms.map((room) => (
                                <div key={room.roomNum}>
                                    <Link to={`/cmain/${room.roomNum}`} className="list_bang">
                                        <div className="bang_level">
                                            <div>{room.roomTypeName}</div>
                                        </div>
                                        <div className="bang_img">
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/upload/${room.roomThumbNail}`}
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
                        
                    <div id="pagination">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                className={page === currentPage ? 'active' : ''}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    
                </div>
            </div>
            <Footert />
        </>
    );
};

export default Mainlist;
