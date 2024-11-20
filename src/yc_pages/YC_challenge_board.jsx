// YcChallengeBoard.jsx

import React, { useState } from "react";
import "../yc_assets/yc_css/yc_css_challenge_board.css";
import Sidebar from "../yc_pages/YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";
import Footert from "../pages/include/JM-Footer.jsx";
import TopHeader from "../pages/include/DH_Header.jsx";
import ChatRoom from "../yc_pages/YC_challenge_chatroom.jsx";

import { FaPlus, FaMinus, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa"; // Added FaEdit and FaTrash

const YcChallengeBoard = () => {
    const [notices, setNotices] = useState([
        { title: "환영합니다!", content: "반갑습니다! 매일 500m 걷기 챌린지방입니다.", date: "2024/11/04", place: null, id: 1, isModified: false },
        { title: "챌린지 종료 임박!", content: "챌린지 종료까지 얼마 남지 않았습니다!", date: "2024/11/01", place: null, id: 2, isModified: false },
        { title: "건강 루틴", content: "건강한 루틴을 만드는 것은 중요합니다.", date: "2024/10/30", place: null, id: 3, isModified: false },
        { title: "새 챌린지 시작!", content: "안녕하세요! 100m 걷기 챌린지입니다.", date: "2024/10/29", place: null, id: 4, isModified: false },
        { title: "챌린지 출발!", content: "500m 걷기 챌린지 시작합니다!", date: "2024/10/28", place: null, id: 5, isModified: false },
        // Add more initial notices as needed
    ]);

    const [showNewNotice, setShowNewNotice] = useState(false);
    const [newNoticeTitle, setNewNoticeTitle] = useState("");
    const [newNoticeContent, setNewNoticeContent] = useState("");
    const [showPlaceOption, setShowPlaceOption] = useState(false);
    const [newNoticePlace, setNewNoticePlace] = useState("");

    // Edit Mode States
    const [isEditing, setIsEditing] = useState(false);
    const [editingNoticeId, setEditingNoticeId] = useState(null);

    // Delete Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noticeToDelete, setNoticeToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setNoticeToDelete(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (noticeToDelete !== null) {
            setNotices(notices.filter(notice => notice.id !== noticeToDelete));
            setNoticeToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const handleCancelDelete = () => {
        setNoticeToDelete(null);
        setShowDeleteModal(false);
    };

    const handleAddOrEditNotice = () => {
        if (isEditing) {
            // Editing existing notice
            setNotices(notices.map(notice => {
                if (notice.id === editingNoticeId) {
                    return {
                        ...notice,
                        title: newNoticeTitle,
                        content: newNoticeContent,
                        place: showPlaceOption ? newNoticePlace : null,
                        isModified: true,
                    };
                }
                return notice;
            }));
            setIsEditing(false);
            setEditingNoticeId(null);
        } else {
            // Adding new notice
            const newNotice = {
                title: newNoticeTitle,
                content: newNoticeContent,
                date: new Date().toISOString().split('T')[0].replace(/-/g, '/'), // Current date in YYYY/MM/DD
                place: showPlaceOption ? newNoticePlace : null,
                id: Date.now(),
                isModified: false,
            };

            setNotices([newNotice, ...notices]);
        }

        // Reset form fields
        setNewNoticeTitle("");
        setNewNoticeContent("");
        setNewNoticePlace("");
        setShowPlaceOption(false);
        setShowNewNotice(false);
    };

    const handleEditClick = (notice) => {
        setIsEditing(true);
        setEditingNoticeId(notice.id);
        setNewNoticeTitle(notice.title);
        setNewNoticeContent(notice.content);
        if (notice.place) {
            setShowPlaceOption(true);
            setNewNoticePlace(notice.place);
        } else {
            setShowPlaceOption(false);
            setNewNoticePlace("");
        }
        setShowNewNotice(true);
    };

    const toggleNewNotice = () => {
        if (showNewNotice) {
            // If currently showing the form, hide it and reset form fields and edit mode
            setShowNewNotice(false);
            setIsEditing(false);
            setEditingNoticeId(null);
            setNewNoticeTitle("");
            setNewNoticeContent("");
            setNewNoticePlace("");
            setShowPlaceOption(false);
        } else {
            // Show the form
            setShowNewNotice(true);
        }
    };

    return (
       <>
        <TopHeader/>
        <div className="yc-board-wrap">
            <Sidebar />
            {/* 메인 콘텐츠 섹션 */}
            <div className="yc_challenge_main-content">
                <Header />
                <div className="yc_challenge_content">
                    {/* 공지 / 유의사항 섹션 */}
                    <section className="yc_challenge_notice-section">
                        <div className="yc_challenge_notice-header">
                            <h2>공지 / 유의사항</h2>
                            <button
                                className="yc_challenge_announcement"
                                onClick={toggleNewNotice}
                                aria-label={showNewNotice ? "새 공지 닫기" : "새 공지 추가"}
                            >
                                {showNewNotice ? <FaMinus /> : <FaPlus />} {/* 상태에 따라 아이콘 변경 */}
                            </button>
                        </div>

                        {/* New Notice Form */}
                        {showNewNotice && (
                            <div className="yc_challenge_new-notice-form">
                                <input
                                    type="text"
                                    placeholder="공지 제목을 입력하세요."
                                    value={newNoticeTitle}
                                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                                    className="yc_challenge_notice-title"
                                />
                                <textarea
                                    placeholder="공지 내용을 입력하세요."
                                    value={newNoticeContent}
                                    onChange={(e) => setNewNoticeContent(e.target.value)}
                                    className="yc_challenge_notice-content"
                                ></textarea>
                                
                                {/* Place Registration Option */}
                                <div className="yc_challenge_place-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showPlaceOption}
                                            onChange={() => {
                                                setShowPlaceOption(!showPlaceOption);
                                                if (showPlaceOption) setNewNoticePlace("");
                                            }}
                                        />
                                        장소 등록
                                    </label>
                                </div>

                                {showPlaceOption && (
                                    <div className="yc_challenge_place-input">
                                        <FaMapMarkerAlt className="yc_place-icon"/>
                                        <input
                                            type="text"
                                            placeholder="장소를 입력하세요."
                                            value={newNoticePlace}
                                            onChange={(e) => setNewNoticePlace(e.target.value)}
                                        />
                                        <button
                                            className="yc_challenge_remove-place-btn"
                                            onClick={() => {
                                                setShowPlaceOption(false);
                                                setNewNoticePlace("");
                                            }}
                                            aria-label="장소 등록 취소"
                                        >
                                            <FaMinus />
                                        </button>
                                    </div>
                                )}

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

                        <div className="yc_challenge_announcement-list">
                            {notices.length > 0 ? (
                                notices.map((notice) => (
                                    <div key={notice.id} className="yc_challenge_notice-item">
                                        <div className="yc_challenge_notice-item-header">
                                            <div className="yc_challenge_notice-title">
                                                <h3>{notice.title}</h3>
                                                {notice.isModified && <span className="yc_modified-badge">수정됨</span>}
                                            </div>
                                            <span className="yc_challenge_notice-date">작성일 {notice.date}</span>
                                        </div>
                                        <div className="yc_challenge_notice-item-content">
                                            <p>{notice.content}</p>
                                            {notice.place && (
                                                <div className="yc_challenge_notice-place">
                                                    <FaMapMarkerAlt className="yc_place-icon"/>
                                                    <span>{notice.place}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="yc_challenge_notice-meta">
                                            <button
                                                className="yc_challenge_edit-btn"
                                                onClick={() => handleEditClick(notice)}
                                                aria-label="공지 수정"
                                            >
                                                <FaEdit /> 수정
                                            </button>
                                            <button
                                                className="yc_challenge_delete-btn"
                                                onClick={() => handleDeleteClick(notice.id)}
                                                aria-label="공지 삭제"
                                            >
                                                <FaTrash /> 삭제
                                            </button>
                                        </div>
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
        <ChatRoom/>

        {/* 푸터 */}
        <Footert/>
        {/* 푸터 끝 */}

        </>
    );

};

export default YcChallengeBoard;
