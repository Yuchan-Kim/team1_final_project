// src/components/YcChallengeBoard.jsx
import React, { useState, useEffect, useRef } from "react";
import {  Link,useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaPlus, FaMinus, FaEdit, FaTrash, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "../yc_assets/yc_css/yc_css_challenge_board.css";
import Sidebar from "../yc_pages/YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";
import Footert from "../pages/include/JM-Footer.jsx";
import TopHeader from "../pages/include/DH_Header.jsx";
import ChatRoom from "../yc_pages/YC_challenge_chatroom.jsx";
import YCProfileInfo from "../yc_pages/YC_profile_info.jsx";

import { convertTM128ToWGS84, convert3857ToWGS84 } from '../yc_pages/coordinateConversion.js'; // 좌표 변환 함수 임포트

import { Doughnut, Line, Bar } from "react-chartjs-2"; // Bar 차트 추가
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Filler,
} from "chart.js";
ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Filler
);

const YcChallengeBoard = () => {

    
    const { roomNum } = useParams();
    const navigate = useNavigate();
    const [topUsers, setTopUsers] = useState([]);

    const [userAuth, setUserAuth] = useState(0);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showNewNotice, setShowNewNotice] = useState(false);
    const [newNoticeTitle, setNewNoticeTitle] = useState("");
    const [newNoticeContent, setNewNoticeContent] = useState("");
    const [showPlaceOption, setShowPlaceOption] = useState(false);
    const [newNoticePlace, setNewNoticePlace] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editingNoticeId, setEditingNoticeId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noticeToDelete, setNoticeToDelete] = useState(null);

    const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 정보
    const [mapPlaces, setMapPlaces] = useState([]); // 지도에 표시할 모든 장소

    const [searchQuery, setSearchQuery] = useState(""); // 검색어
    const [searchResults, setSearchResults] = useState([]); // 검색 결과
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const [isNaverLoaded, setIsNaverLoaded] = useState(false);

     // 프로필 모달 상태 관리
    const [isProfileOpen, setProfileOpen] = useState(false);
    const [profileUser, setProfileUser] = useState(null);

    const token = localStorage.getItem('token');
    console.log(token);

    // **1. 지도 참조를 위한 mapRefs 추가**
    const mapRefs = useRef({});


    useEffect(() => {
        console.log("마운트 완료");
        checkAuthUser();
        fetchMissionAchievements();
        fetchTopUsers();

        // 네이버 지도 스크립트 로드 확인
        const script = document.querySelector('script[src*="maps.js"]');
        if (script) {
            script.addEventListener('load', () => {
                setIsNaverLoaded(true);
                console.log('네이버 지도 스크립트 로드 완료');
            });
            if (window.naver && window.naver.maps) {
                setIsNaverLoaded(true);
                console.log('네이버 지도 스크립트가 이미 로드되었습니다.');
            }
        }
    }, []);

    const checkAuthUser = async () => {
        if (token) {
            try {
                const response = await axios({
                    method: 'get',
                    url: `${process.env.REACT_APP_API_URL}/api/challenge/announcement/${roomNum}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.result === 'success' && response.data.apiData === true) {
                    console.log('방에 참여한 유저입니다.');
                    const authResponse = await axios({
                        method: 'get',
                        url: `${process.env.REACT_APP_API_URL}/api/challenge/announcement/user/${roomNum}`,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (authResponse.data.result === 'success' && authResponse.data.apiData === 1){
                        setUserAuth(1);
                        fetchNotices();
                    } else if (authResponse.data.result === 'success' && authResponse.data.apiData === 2) {
                        setUserAuth(2);
                        fetchNotices();
                    } else {
                        fetchNotices();
                        setLoading(false);
                    }
                } else if (response.data.result === 'success' && response.data.apiData === false) {
                    console.log('방에 참여하지 않은 유저입니다.');
                    fetchNotices();
                } else {
                    console.error('오류 발생:', response.data.message);
                    alert('오류가 발생했습니다. 다시 시도해주세요.');
                    navigate("/");
                }
            } catch (error) {
                console.error('서버 요청 중 오류 발생:', error);
                if (error.response && error.response.status === 401) {
                    alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
                    navigate('/user/loginform');
                } else {
                    alert('서버와의 통신에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                    setError("서버와의 통신에 문제가 발생했습니다.");
                    setLoading(false);
                }
            }
        } else {
            //navigate('/user/loginform');
            fetchNotices();
        }
    };

    // 프로필 모달 열기 함수
   const openProfile = async (userNum) => {
    console.log('openProfile called with:', userNum); // 디버깅용 로그 추가
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rates/profile/${userNum}`);
        console.log('Profile Response:', response.data);
        if (response.data.result === 'success') {
            setProfileUser(response.data.apiData);
            setProfileOpen(true);
        } else {
            setError("프로필 정보를 불러오는 데 실패했습니다.");
        }
    } catch (error) {
        setError("서버와의 통신에 실패했습니다.");
        console.error(error);
    }
  };

  // 프로필 모달 닫기 함수
  const closeProfile = () => {
    setProfileOpen(false);
    setProfileUser(null);
  };

    const fetchNotices = () => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/challenge/announcement/get/${roomNum}`,
            responseType: 'json'
        })
        .then(response => {
            if (response.data.result === 'success') {
                // 공지사항 데이터에 latitude와 longitude 추가
                const processedNotices = response.data.apiData.map(notice => ({
                    ...notice,
                    latitude: notice.latitude ? parseFloat(notice.latitude) : null,
                    longitude: notice.longitude ? parseFloat(notice.longitude) : null,
                }));
                console.log(processedNotices);
                setNotices(processedNotices);
                setMapPlaces(processedNotices.filter(notice => notice.latitude && notice.longitude));
                setLoading(false);
            } else {
                setError("공지사항을 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        })
        .catch(error => {
            setError("공지사항을 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
            console.error(error);
        });
    };
    
    

    const handleDeleteClick = (id) => {
        setNoticeToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (noticeToDelete !== null) {
            axios({
                method: 'delete',
                url: `${process.env.REACT_APP_API_URL}/api/challenge/announcement/delete/${noticeToDelete}`,
                responseType: 'json'
            })
            .then(response => {
                if (response.data.result === 'success') {
                    setNotices(notices.filter(notice => notice.announceNum !== noticeToDelete));
                    setMapPlaces(mapPlaces.filter(place => place.announceNum !== noticeToDelete));
                    setNoticeToDelete(null);
                    setShowDeleteModal(false);
                    // fetchNotices(); // 필요 시 호출
                } else {
                    setError("공지사항 삭제에 실패했습니다.");
                }
            })
            .catch(error => {
                setError("공지사항 삭제 중 오류가 발생했습니다.");
                setLoading(false);
                console.error(error);
            });
        }
    };

    const handleAddOrEditNotice = async () => {
        if (isEditing) {
            const updatedNotice = {
                title: newNoticeTitle,
                announcement: newNoticeContent,
                placeTitle: showPlaceOption ? newNoticePlace : null, // place 대신 placeTitle 사용
                address: selectedPlace ? selectedPlace.address : null,
                latitude: selectedPlace ? selectedPlace.latitude : null,
                longitude: selectedPlace ? selectedPlace.longitude : null,
            };
    
            axios({
                method: 'put',
                url: `${process.env.REACT_APP_API_URL}/api/challenge/announcement/edit/${editingNoticeId}`,
                data: updatedNotice,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'json'
            })
            .then(response => {
                if (response.data.result === 'success') {
                    setNotices(notices.map(notice => {
                        if (notice.announceNum === editingNoticeId) {
                            return {
                                ...notice,
                                ...updatedNotice,
                                modified: true,
                            };
                        }
                        return notice;
                    }));
                    setMapPlaces(mapPlaces.map(place => {
                        if (place.announceNum === editingNoticeId) {
                            return {
                                ...place,
                                ...updatedNotice,
                                latitude: updatedNotice.latitude,
                                longitude: updatedNotice.longitude,
                            };
                        }
                        return place;
                    }));
    
                    setIsEditing(false);
                    setEditingNoticeId(null);
                    setNewNoticeTitle("");
                    setNewNoticeContent("");
                    setNewNoticePlace("");
                    setShowPlaceOption(false);
                    setShowNewNotice(false);
                    setSelectedPlace(null); // 선택된 장소 초기화
                } else {
                    setError("공지사항 수정에 실패했습니다.");
                }
            })
            .catch(error => {
                setError("공지사항 수정 중 오류가 발생했습니다.");
                setLoading(false);
                console.error(error);
            });
        } else {
            const newNotice = {
                roomNum: roomNum,
                title: newNoticeTitle,
                announcement: newNoticeContent,
                placeTitle: showPlaceOption ? newNoticePlace : null, 
                address: selectedPlace ? selectedPlace.address : null,
                latitude: selectedPlace ? selectedPlace.latitude : null,
                longitude: selectedPlace ? selectedPlace.longitude : null,
            };
    
            axios({
                method: 'post',
                url: `${process.env.REACT_APP_API_URL}/api/challenge/announcement/addannounce`,
                data: newNotice,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'json'
            })
            .then(response => {
                if (response.data.result === 'success') {
                    const addedNotice = {
                        ...response.data.apiData,
                        latitude: response.data.apiData.latitude ? parseFloat(response.data.apiData.latitude) : null,
                        longitude: response.data.apiData.longitude ? parseFloat(response.data.apiData.longitude) : null,
                    };
                    setNotices([addedNotice, ...notices]);
                    if (addedNotice.latitude && addedNotice.longitude) {
                        setMapPlaces([addedNotice, ...mapPlaces]);
                    }
                    setNewNoticeTitle("");
                    setNewNoticeContent("");
                    setNewNoticePlace("");
                    setShowPlaceOption(false);
                    setShowNewNotice(false);
                    setSelectedPlace(null); // 선택된 장소 초기화
                }
                else {
                    setError("공지사항 추가에 실패했습니다.");
                }
            })
            .catch(error => {
                setError("공지사항 추가 중 오류가 발생했습니다.");
                setLoading(false);
                console.error(error);
            });
        }
    };
    
    

    const handleEditClick = (notice) => {
        setIsEditing(true);
        setEditingNoticeId(notice.announceNum);
        setNewNoticeTitle(notice.title);
        setNewNoticeContent(notice.announcement);
        if (notice.place) {
            setShowPlaceOption(true);
            setNewNoticePlace(notice.place);
            // 장소의 위도와 경도도 필요하다면 추가
            setSelectedPlace({
                title: notice.title, // place.title 대신 notice.title로 수정
                address: notice.address, // 서버에서 address 정보 제공 필요
                latitude: notice.latitude,
                longitude: notice.longitude,
            });
        } else {
            setShowPlaceOption(false);
            setNewNoticePlace("");
            setSelectedPlace(null);
        }
        setShowNewNotice(true);
    };

    const toggleNewNotice = () => {
        if (showNewNotice) {
            setShowNewNotice(false);
            setIsEditing(false);
            setEditingNoticeId(null);
            setNewNoticeTitle("");
            setNewNoticeContent("");
            setNewNoticePlace("");
            setShowPlaceOption(false);
            setSelectedPlace(null); // 선택된 장소 초기화
        } else {
            setShowNewNotice(true);
        }
    };

    const handleCancelDelete = () => {
        setNoticeToDelete(null);
        setShowDeleteModal(false);
    };

    // 날짜 및 시간 포맷팅 함수
    const formatDateTime = (dateTimeString) => {
        const options = { 
            year: 'numeric',  
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('ko-KR', options).replace(/\./g, '').replace(/ /g, ' ');
    };

    // 지역 검색 함수
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }
    
        setSearchLoading(true);
        setSearchError(null);
        setSearchResults([]);
    
        try {
            // 백엔드 프록시 엔드포인트 호출
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/challenge/announcement/search/local`, {
                params: {
                    query: searchQuery,
                    display: 5, // 최대 5개 결과
                },
                headers: {
                    // 필요한 경우 헤더 추가 (예: 인증 헤더)
                    // 'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.data.result === "success" && response.data.apiData.items.length > 0) {
                setSearchResults(response.data.apiData.items);
            } else if (response.data.result === "fail") {
                setSearchError(response.data.message || "검색 결과가 없습니다.");
            } else {
                setSearchError("검색 결과가 없습니다.");
            }
        } catch (err) {
            console.error(err);
            setSearchError("검색 중 오류가 발생했습니다.");
        } finally {
            setSearchLoading(false);
        }
    };

    // Proj4js를 사용하여 mapx, mapy를 latitude, longitude로 변환하여 선택된 장소 설정
    const handleSelectPlace = (place) => {
        console.log('Selected Place:', place); // 전체 place 객체 확인
    
        if (!isNaverLoaded) {
            console.error('네이버 지도 스크립트가 아직 로드되지 않았습니다.');
            return;
        }
    
        const { mapx, mapy, title, address } = place;
        if (mapx == null || mapy == null) {
            console.error('mapx 또는 mapy가 존재하지 않습니다.');
            return;
        }
    
        // mapx와 mapy를 10^7으로 나누어 위도와 경도로 변환
        const numericLatitude = parseFloat(mapy) / 1e7;
        const numericLongitude = parseFloat(mapx) / 1e7;
        console.log('latitude:', numericLatitude, 'longitude:', numericLongitude);
    
        // 좌표 유효성 검증
        if (numericLatitude < -90 || numericLatitude > 90 || numericLongitude < -180 || numericLongitude > 180) {
            console.error('latitude 또는 longitude 값이 유효한 범위를 벗어났습니다.');
            alert('선택한 장소의 좌표가 유효하지 않습니다.');
            return;
        }
    
        setSelectedPlace({
            title,
            address,
            latitude: numericLatitude,
            longitude: numericLongitude,
        });
    
        setNewNoticePlace(title);
        setShowPlaceOption(true);
    };
    

    // Ref를 사용하여 맵 컨테이너 참조 (필요 시)
    const mapRef = useRef(null);

    // 선택된 장소에 따라 개별 지도 렌더링 (필요 시)
    
    // **2. useEffect를 사용하여 개별 지도 초기화**
    useEffect(() => {
        if (selectedPlace && isNaverLoaded) {
            if (!window.naver) {
                console.error("네이버 지도 스크립트가 로드되지 않았습니다.");
                return;
            }
    
            const { naver } = window;
    
            try {
                const map = new naver.maps.Map(mapRef.current, {
                    center: new naver.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude),
                    zoom: 14,
                    logoControl: false,
                    mapDataControl: false,
                    scaleControl: true,
                    zoomControl: true,
                    zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
                });
    
                new naver.maps.Marker({
                    position: new naver.maps.LatLng(selectedPlace.latitude, selectedPlace.longitude),
                    map: map,
                    title: selectedPlace.title,
                });
            } catch (error) {
                console.error("선택된 장소의 지도 초기화 중 오류 발생:", error);
            }
        }
    }, [selectedPlace, isNaverLoaded]);
    
    const [missionAchievements, setMissionAchievements] = useState([]);

    // 미션 달성률 데이터를 가져오는 함수
  const fetchMissionAchievements = () => {
    axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}/api/rates/achievement/${roomNum}`,
      responseType: 'json'
    })
    .then(response =>{
      console.log('Mission Achievements Response:', response.data);
      if (response.data.result === 'success') {
        setMissionAchievements(response.data.apiData);
      } else {
        setError("미션 달성률을 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
  };
    // 첫 번째 미션 선택
  const firstMission = missionAchievements.length > 0 ? missionAchievements[0] : null;

    // 도넛 차트 데이터 설정
  const doughnutData = firstMission ? {
    labels: ['완료', '미완료'],
    datasets: [
      {
        label: missionAchievements.missionName,
        data: [firstMission.achievementRate, 100 - firstMission.achievementRate],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 205, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: '그룹 챌린지 달성도',
      },
    },
  };

  // Top 5 유저 가져오기
  const fetchTopUsers = () => {
    axios({
        method: 'get',
        url: `${process.env.REACT_APP_API_URL}/api/rates/topusers/${roomNum}`, 
        responseType: 'json'
    })
    .then(response =>{
      console.log('Top Users Response:', response.data);
      if (response.data.result === 'success') { 
        setTopUsers(response.data.apiData); 
      } else {
        setError("Top 5 User를 불러오는 데 실패했습니다.");
      }
    })
    .catch(error => {
      setError("서버와의 통신에 실패했습니다.");
      console.error(error);
    });
  };


    

    return (
       <>
        {/* 상단 헤더 컴포넌트 렌더링 */}
        <TopHeader/>

        <div className="yc-chart-container"> 
          
          {/* Top 5 유저 랭킹 */}
          <div className="yc-top-rankings">
            {/* 도넛 차트와 달성률 표시 */}
            {doughnutData && (
              <>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <h4>{firstMission.missionName} 달성률: {firstMission.achievementRate.toFixed(2)}%</h4>
              </>
            )}
            <h3>Top 5 랭킹</h3>
          {topUsers.map((user) => (
            <div key={user.userNum} className="yc-ranking-item">
              <img 
                src={user.usingProfilePic} 
                alt={`${user.userName} 프로필`} 
                className="yc-ranking-avatar" 
              />
              <div className="yc-ranking-info">
                        <Link
                          to="#"
                          className="yc_challenge_statistics_top5User"
                          onClick={() => openProfile(user.userNum)} // user 객체 대신 userNum을 전달합니다.
                        >
                          {user.userName}
                        </Link>
                <span className="yc-ranking-progress">달성률: {user.achievementRate}%</span>
              </div>
            </div>
          ))}
          </div>
        </div>
        <div className="yc-board-wrap">
            {/* 사이드바 컴포넌트 렌더링 */}
            <Sidebar />
            {/* 메인 콘텐츠 섹션 */}
            <div className="yc_challenge_main-content">
                {/* 헤더 컴포넌트 렌더링 */}
                <Header />
                <div className="yc_challenge_content">
                    {/* 공지 / 유의사항 섹션 */}
                    <section className="yc_challenge_notice-section">
                        <div className="yc_challenge_notice-header">
                            <h2>공지 사항</h2>
                            {/* 새 공지사항 추가/닫기 버튼 */}
                            {userAuth === 1 && (
                                <button
                                    className="yc_challenge_announcement"
                                    onClick={toggleNewNotice}
                                    aria-label={showNewNotice ? "새 공지 닫기" : "새 공지 추가"}
                                >
                                    {showNewNotice ? <FaMinus /> : <FaPlus />}
                                </button>
                            )}
                        </div>

                        {/* 새 공지사항 작성 폼 */}
                        {showNewNotice && userAuth === 1 && (
                            <div className="yc_challenge_new-notice-form">
                                {/* 공지사항 제목 입력 필드 */}
                                <input
                                    type="text"
                                    placeholder="공지 제목을 입력하세요."
                                    value={newNoticeTitle}
                                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                                    className="yc_challenge_notice-title"
                                />
                                {/* 공지사항 내용 입력 필드 */}
                                <textarea
                                    placeholder="공지 내용을 입력하세요."
                                    value={newNoticeContent}
                                    onChange={(e) => setNewNoticeContent(e.target.value)}
                                    className="yc_challenge_notice-content"
                                ></textarea>
                                
                                {/* 장소 등록 옵션 */}
                                <div className="yc_challenge_place-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showPlaceOption}
                                            onChange={() => {
                                                setShowPlaceOption(!showPlaceOption);
                                                if (showPlaceOption) {
                                                    setNewNoticePlace("");
                                                    setSelectedPlace(null);
                                                    setSearchResults([]);
                                                }
                                            }}
                                        />
                                        장소 등록
                                    </label>
                                </div>

                                {/* 장소 입력 필드 (옵션 선택 시 표시) */}
                                {showPlaceOption && (
                                    <div className="yc_challenge_place-input">
                                        <FaMapMarkerAlt className="yc_place-icon"/>
                                        
                                        {/* 장소 검색 입력 필드 */}
                                        <input
                                            type="text"
                                            placeholder="장소 이름을 검색하세요."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="yc_challenge_place-search"
                                        />
                                        <button
                                            className="yc_challenge_search-btn"
                                            onClick={handleSearch}
                                            aria-label="장소 검색"
                                        >
                                            {searchLoading ? '검색중...' : <FaSearch />}
                                        </button>

                                        {/* 장소 검색 취소 버튼 */}
                                        <button
                                            className="yc_challenge_remove-place-btn"
                                            onClick={() => {
                                                setShowPlaceOption(false);
                                                setNewNoticePlace("");
                                                setSelectedPlace(null);
                                                setSearchResults([]);
                                            }}
                                            aria-label="장소 등록 취소"
                                        >
                                            <FaMinus />
                                        </button>
                                    </div>
                                )}

                                {/* 검색 결과 표시 */}
                                {showPlaceOption && searchResults.length > 0 && (
                                    <div className="yc_search-results">
                                        <h4>검색 결과:</h4>
                                        <ul>
                                            {searchResults.map((place, index) => (
                                                <li key={index} onClick={() => handleSelectPlace(place)}>
                                                    <strong>{place.title}</strong> - {place.address}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* 선택된 장소 정보 및 지도 표시 */}
                                {selectedPlace && (
                                    <div className="yc_selected-place-info">
                                        <h4>선택된 장소:</h4>
                                        <p><strong>이름:</strong> {selectedPlace.title}</p>
                                        <p><strong>주소:</strong> {selectedPlace.address}</p>

                                        {/* 네이버 지도 표시 */}
                                        <div
                                            ref={mapRef}
                                            className="yc_map-container"
                                            style={{ height: "200px", marginTop: "10px" }}
                                        ></div>

                                        <button
                                            className="yc_place-confirm-btn"
                                            onClick={() => {
                                                alert("장소가 확정되었습니다.");
                                            }}
                                        >
                                            확인
                                        </button>
                                    </div>
                                )}

                                {/* 공지사항 등록 또는 수정 버튼 */}
                                <button
                                    className="yc_challenge_add-btn"
                                    onClick={handleAddOrEditNotice}
                                    disabled={
                                        !newNoticeTitle || 
                                        !newNoticeContent || 
                                        (showPlaceOption && !newNoticePlace)
                                    }
                                >
                                    {isEditing ? "수정" : "등록"}
                                </button>
                            </div>
                        )}

                        {/* 공지사항 목록 */}
                        <div className="yc_challenge_announcement-list">
                        {loading ? (
                            <p>공지사항을 불러오는 중입니다...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : notices.length > 0 ? (
                            notices.map((notice) => (
                                <div key={notice.announceNum} className="yc_challenge_notice-item">
                                    {/* 공지사항 헤더: 제목과 작성일 */}
                                    <div className="yc_challenge_notice-item-header">
                                        <div className="yc_challenge_notice-title">
                                            <h3>{notice.title}</h3>
                                            {notice.modified === true && <span className="yc_modified-badge">수정됨</span>}
                                        </div>
                                        <span className="yc_challenge_notice-date">작성일 {formatDateTime(notice.announceTime)}</span>
                                    </div>
                                    {/* 공지사항 내용 */}
                                    <div className="yc_challenge_notice-item-content">
                                        <p>{notice.announcement}</p>
                                        {notice.placeTitle && (
                                            <div className="yc_challenge_notice-place">
                                                <FaMapMarkerAlt className="yc_place-icon" />
                                                <span>{notice.placeTitle}</span>
                                            </div>
                                        )}
                                        {/* 개별 맵 렌더링 */}
                                        {notice.latitude && notice.longitude && (
                                            <MapRender
                                                place={{
                                                    latitude: notice.latitude,
                                                    longitude: notice.longitude,
                                                    placeTitle: notice.placeTitle,
                                                    address: notice.address,
                                                }}
                                            />
                                        )}
                                    </div>
                                    {/* 공지사항 메타 정보: 수정 및 삭제 버튼 */}
                                    {userAuth === 1 && (
                                        <div className="yc_challenge_notice-meta">
                                            <button onClick={() => handleEditClick(notice)} className="yc_challenge_edit-btn" aria-label="공지 수정">
                                                <FaEdit /> 수정
                                            </button>
                                            <button onClick={() => handleDeleteClick(notice.announceNum)} className="yc_challenge_delete-btn" aria-label="공지 삭제">
                                                <FaTrash /> 삭제
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>공지사항이 없습니다.</p>
                        )}
                    </div>

                    </section>
                </div>
                
                {/* 삭제 확인 모달 */}
                {showDeleteModal && (
                    <div className="yc_modal-overlay-board">
                        <div className="yc_modal-board">
                            <p>삭제 하시겠습니까?</p>
                            <div className="yc_modal-buttons-board">
                                <button className="yc_modal-confirm-board" onClick={handleConfirmDelete}>확인</button>
                                <button className="yc_modal-cancel-board" onClick={handleCancelDelete}>취소</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <YCProfileInfo
            isOpen={isProfileOpen}
            onClose={closeProfile}
            user={profileUser} // 선택된 유저 정보 전달
      />

        {/* 채팅룸 컴포넌트 렌더링 */}
        { (userAuth === 1 ||userAuth === 2)  &&(
            <ChatRoom roomNum={roomNum}/>
        ) }  
        
        {/* 푸터 컴포넌트 렌더링 */}
        <Footert/>
        {/* 푸터 끝 */}
        </>
    )};

export default YcChallengeBoard;

// 지도 렌더링 컴포넌트
const MapRender = ({ place }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!window.naver || !place) {
            console.error('네이버 지도 스크립트가 로드되지 않았거나 장소 정보가 없습니다.');
            return;
        }

        const { naver } = window;

        const map = new naver.maps.Map(mapRef.current, {
            center: new naver.maps.LatLng(place.latitude, place.longitude),
            zoom: 14,
            logoControl: false,
            mapDataControl: false,
            scaleControl: true,
            zoomControl: true,
            zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
        });

        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(place.latitude, place.longitude),
            map: map,
            title: place.placeTitle,
        });

        const infoWindow = new naver.maps.InfoWindow({
            content: `<div style="padding:10px;">${place.placeTitle}<br/>${place.address}</div>`,
            anchorSkew: true,
        });

        naver.maps.Event.addListener(marker, 'click', () => {
            infoWindow.open(map, marker);
        });

        // 클린업
        return () => {
            marker.setMap(null);
            map.destroy();
        };
    }, [place]);

    return <div ref={mapRef} className="yc_map-container" style={{ height: "200px", marginTop: "10px" }}></div>;


    
};


