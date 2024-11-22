// YcChallengeBoard.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaPlus, FaMinus, FaEdit, FaTrash, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "../yc_assets/yc_css/yc_css_challenge_board.css";
import Sidebar from "../yc_pages/YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";
import Footert from "../pages/include/JM-Footer.jsx";
import TopHeader from "../pages/include/DH_Header.jsx";
import ChatRoom from "../yc_pages/YC_challenge_chatroom.jsx";

const YcChallengeBoard = () => {
    const { roomNum } = useParams();
    const navigate = useNavigate();

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

    const token = localStorage.getItem('token');
    console.log(token);

    useEffect(() => {
        console.log("마운트 완료");
        checkAuthUser();
    }, []);

    const checkAuthUser = async () => {
        if (token) {
            try {
                const response = await axios({
                    method: 'get',
                    url: `http://${process.env.REACT_APP_API_URL}/api/challenge/announcement/${roomNum}`,
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
                        setError("사용자 권한을 확인할 수 없습니다.");
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
            alert('로그인이 필요합니다.');
            //navigate('/user/loginform');
            fetchNotices();
        }
    };

    const fetchNotices = () => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/challenge/announcement/get/${roomNum}`,
            responseType: 'json'
        })
        .then(response => {
            if (response.data.result === 'success') {
                setNotices(response.data.apiData);
                setMapPlaces(response.data.apiData.filter(notice => notice.latitude && notice.longitude));
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
                place: showPlaceOption ? newNoticePlace : null,
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
                                isModified: true,
                            };
                        }
                        return notice;
                    }));
                    setMapPlaces(mapPlaces.map(place => {
                        if (place.announceNum === editingNoticeId) {
                            return {
                                ...place,
                                ...updatedNotice,
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
                    // fetchNotices(); // 필요 시 호출
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
                place: showPlaceOption ? newNoticePlace : null,
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
                    setNotices([response.data.apiData, ...notices]);
                    if (response.data.apiData.latitude && response.data.apiData.longitude) {
                        setMapPlaces([response.data.apiData, ...mapPlaces]);
                    }
                    setNewNoticeTitle("");
                    setNewNoticeContent("");
                    setNewNoticePlace("");
                    setShowPlaceOption(false);
                    setShowNewNotice(false);
                    setSelectedPlace(null); // 선택된 장소 초기화
                    // fetchNotices(); // 필요 시 호출
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
                name: notice.place,
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
    // YcChallengeBoard.jsx

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
    
    


    const handleSelectPlace = (place) => {
        const { naver } = window;
        if (!naver) {
            console.error('네이버 지도 스크립트가 로드되지 않았습니다.');
            return;
        }
    
        // TM128 좌표를 위도/경도로 변환
        const point = new naver.maps.Point(parseFloat(place.mapx), parseFloat(place.mapy));
        const latlng = naver.maps.TransCoord.fromTM128ToLatLng(point);
    
        setSelectedPlace({
            title: place.title,
            address: place.address,
            latitude: latlng.lat(),
            longitude: latlng.lng(),
        });
    
        setNewNoticePlace(place.title);
        setShowPlaceOption(true);
    };
    

    return (
       <>
        {/* 상단 헤더 컴포넌트 렌더링 */}
        <TopHeader/>
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
                            <h2>공지 / 유의사항</h2>
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
                                        <div id="map-new" className="yc_map-container"></div>

                                        {/* 지도 렌더링 */}
                                        <MapRender place={selectedPlace} mapId="map-new" />

                                        {/* 확인 버튼 추가 */}
                                        <button
                                            className="yc_place-confirm-btn"
                                            onClick={() => {
                                                // 장소 정보가 확정되었음을 표시
                                                // 예: 서버에 추가 정보 전송, 상태 업데이트 등
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
                                                {notice.isModified && <span className="yc_modified-badge">수정됨</span>}
                                            </div>
                                            <span className="yc_challenge_notice-date">작성일 {formatDateTime(notice.announceTime)}</span>
                                        </div>
                                        {/* 공지사항 내용 */}
                                        <div className="yc_challenge_notice-item-content">
                                            <p>{notice.announcement}</p>
                                            {notice.place && (
                                                <div className="yc_challenge_notice-place">
                                                    <FaMapMarkerAlt className="yc_place-icon"/>
                                                    <span>{notice.place}</span>
                                                </div>
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
                                        {/* 장소가 있을 경우 지도 표시 */}
                                        {notice.latitude && notice.longitude && (
                                            <div className="yc_challenge_notice-map">
                                                <div id={`map-${notice.announceNum}`} className="yc_map-container"></div>
                                                <MapRender place={notice} mapId={`map-${notice.announceNum}`} />
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
        {/* 채팅룸 컴포넌트 렌더링 */}
        <ChatRoom roomNum={roomNum}/>
        {/* 푸터 컴포넌트 렌더링 */}
        <Footert/>
        {/* 푸터 끝 */}
        </>
    )};


    // 지도 렌더링 컴포넌트
    const MapRender = ({ place, mapId }) => {
        useEffect(() => {
            if (!window.naver) {
                console.error('네이버 지도 스크립트가 로드되지 않았습니다.');
                return;
            }
    
            const { naver } = window;
    
            // TM128 좌표를 위도/경도로 변환
            const point = new naver.maps.Point(parseFloat(place.mapx), parseFloat(place.mapy));
            const latlng = naver.maps.TransCoord.fromTM128ToLatLng(point);
    
            const mapOptions = {
                center: new naver.maps.LatLng(latlng.lat(), latlng.lng()),
                logoControl: false,
                mapDataControl: false,
                scaleControl: true,
                zoom: 14,
                zoomControl: true,
                zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
            };
    
            const map = new naver.maps.Map(mapId, mapOptions);
    
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(latlng.lat(), latlng.lng()),
                map: map,
                title: place.title,
            });
    
            const infoWindow = new naver.maps.InfoWindow({
                content: `<div style="padding:10px;">${place.title}<br/>${place.address}</div>`,
                anchorSkew: true,
            });
    
            naver.maps.Event.addListener(marker, 'click', () => {
                infoWindow.open(map, marker);
            });
    
            // 클린업
            return () => {
                marker.setMap(null);
                map.destroy(); // map.setMap(null); 대신 map.destroy()를 사용합니다.
            };
        }, [place, mapId]);
    
        return null;
    };
    

    export default YcChallengeBoard;
