// src/pages/YcChallengeBoard.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaPlus, FaMinus, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import "../yc_assets/yc_css/yc_css_challenge_board.css";
import Sidebar from "../yc_pages/YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";
import Footert from "../pages/include/JM-Footer.jsx";
import TopHeader from "../pages/include/DH_Header.jsx";
import ChatRoom from "../yc_pages/YC_challenge_chatroom.jsx";
import PlaceAutosuggest from "../yc_pages/YC_challenge_board_autosuggest.jsx";
import NaverMap from "../yc_pages/YC_challenge_board_NaverMap.jsx"; // 지도 컴포넌트

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
                    url: `http://localhost:9000/api/challenge/announcement/${roomNum}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.result === 'success' && response.data.apiData === true) {
                    console.log('방에 참여한 유저입니다.');
                    const authResponse = await axios({
                        method: 'get',
                        url: `http://localhost:9000/api/challenge/announcement/user/${roomNum}`,
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
            url: `http://localhost:9000/api/challenge/announcement/get/${roomNum}`,
            responseType: 'json'
        })
        .then(response => {
            if (response.data.result === 'success') {
                setNotices(response.data.apiData);
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
                url: `http://localhost:9000/api/challenge/announcement/delete/${noticeToDelete}`,
                responseType: 'json'
            })
            .then(response => {
                if (response.data.result === 'success') {
                    setNotices(notices.filter(notice => notice.announceNum !== noticeToDelete));
                    setNoticeToDelete(null);
                    setShowDeleteModal(false);
                    fetchNotices();
                    // window.location.reload(); // 페이지 전체 새로 고침 제거
                } else {
                    setError("공지사항 삭제에 실패했습니다.");
                }
            })
            .catch(error => {
                setError("공지사항 삭제 중 오류가 발생했습니다.");
                console.error(error);
            });
        }
    };

    // 장소 선택 핸들러
    const handlePlaceSelect = (place) => {
        setSelectedPlace(place);
        setNewNoticePlace(place.name); // 입력 필드에 장소 이름 설정
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
                url: `http://localhost:9000/api/challenge/announcement/edit/${editingNoticeId}`,
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

                    setIsEditing(false);
                    setEditingNoticeId(null);
                    setNewNoticeTitle("");
                    setNewNoticeContent("");
                    setNewNoticePlace("");
                    setShowPlaceOption(false);
                    setShowNewNotice(false);
                    setSelectedPlace(null); // 선택된 장소 초기화
                    fetchNotices();
                } else {
                    setError("공지사항 수정에 실패했습니다.");
                }
            })
            .catch(error => {
                setError("공지사항 수정 중 오류가 발생했습니다.");
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
                url: `http://localhost:9000/api/challenge/announcement/addannounce`,
                data: newNotice,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'json'
            })
            .then(response => {
                if (response.data.result === 'success') {
                    setNotices([response.data.apiData, ...notices]);
                    setNewNoticeTitle("");
                    setNewNoticeContent("");
                    setNewNoticePlace("");
                    setShowPlaceOption(false);
                    setShowNewNotice(false);
                    setSelectedPlace(null); // 선택된 장소 초기화
                    fetchNotices();
                }
                else {
                    setError("공지사항 추가에 실패했습니다.");
                }
            })
            .catch(error => {
                setError("공지사항 추가 중 오류가 발생했습니다.");
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
                                        <PlaceAutosuggest onPlaceSelect={handlePlaceSelect} />
                                        {/* 장소 등록 취소 버튼 */}
                                        <button
                                            className="yc_challenge_remove-place-btn"
                                            onClick={() => {
                                                setShowPlaceOption(false);
                                                setNewNoticePlace("");
                                                setSelectedPlace(null);
                                            }}
                                            aria-label="장소 등록 취소"
                                        >
                                            <FaMinus />
                                        </button>
                                    </div>
                                )}

                                {/* 선택된 장소 정보 및 지도 표시 */}
                                {selectedPlace && (
                                    <div className="yc_selected-place-info">
                                        <h4>선택된 장소:</h4>
                                        <p><strong>이름:</strong> {selectedPlace.name}</p>
                                        <p><strong>주소:</strong> {selectedPlace.address}</p>
                                        <NaverMap 
                                            place={{
                                                name: selectedPlace.name,
                                                latitude: selectedPlace.latitude,
                                                longitude: selectedPlace.longitude
                                            }} 
                                        />
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
                                                {notice.modified === true && <span className="yc_modified-badge">수정됨</span>}
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
                                        {notice.place && notice.latitude && notice.longitude && (
                                            <NaverMap 
                                                place={{
                                                    name: notice.place,
                                                    address: notice.address, // 서버에서 address 정보 제공 필요
                                                    latitude: notice.latitude,
                                                    longitude: notice.longitude
                                                }} 
                                            />
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
    );

};

export default YcChallengeBoard;
