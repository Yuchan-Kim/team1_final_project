import React, { useState } from "react";
import "../yc_assets/yc_css/yc_css_challenge_board.css";
import Sidebar from "../yc_pages/YC_challenge_sidebar.jsx";
import Header from "./JMYC_challenge_header.jsx";

const YcChallengeBoard = () => {
    const [notices, setNotices] = useState([
        { content: "반갑습니다! 매일 500m 걷기 챌린지방입니다.", date: "2024/11/04", id: 1 },
        { content: "챌린지 종료까지 얼마 남지 않았습니다!", date: "2024/11/01", id: 2 },
        { content: "건강한 루틴을 만드는 것은 중요합니다.", date: "2024/10/30", id: 3 },
        { content: "안녕하세요! 100m 걷기 챌린지입니다.", date: "2024/10/29", id: 4 },
        { content: "500m 걷기 챌린지 시작합니다!", date: "2024/10/28", id: 5 },
        { content: "500m 걷기 챌린지 시작합니다!", date: "2024/10/28", id: 6 },
        { content: "반갑습니다! 매일 500m 걷기 챌린지방입니다.", date: "2024/11/04", id: 1 },
        { content: "챌린지 종료까지 얼마 남지 않았습니다!", date: "2024/11/01", id: 2 },
        { content: "건강한 루틴을 만드는 것은 중요합니다.", date: "2024/10/30", id: 3 },
        { content: "안녕하세요! 100m 걷기 챌린지입니다.", date: "2024/10/29", id: 4 },
        { content: "500m 걷기 챌린지 시작합니다!", date: "2024/10/28", id: 5 },
        { content: "500m 걷기 챌린지 시작합니다!", date: "2024/10/28", id: 6 },
        { content: "반갑습니다! 매일 500m 걷기 챌린지방입니다.", date: "2024/11/04", id: 1 },
        { content: "챌린지 종료까지 얼마 남지 않았습니다!", date: "2024/11/01", id: 2 },
        { content: "건강한 루틴을 만드는 것은 중요합니다.", date: "2024/10/30", id: 3 },
        { content: "안녕하세요! 100m 걷기 챌린지입니다.", date: "2024/10/29", id: 4 },
        { content: "500m 걷기 챌린지 시작합니다!", date: "2024/10/28", id: 5 },
        { content: "500m 걷기 챌린지 시작합니다!", date: "2024/10/28", id: 6 },

    ]);

    const [showNewNotice, setShowNewNotice] = useState(false);
    const [newNoticeContent, setNewNoticeContent] = useState("");
    const [newNoticeDate, setNewNoticeDate] = useState("");

    const handleDelete = (id) => {
        setNotices(notices.filter(notice => notice.id !== id));
    };

    const handleAddNotice = () => {
        if (newNoticeContent.trim() === "" || newNoticeDate.trim() === "") {
            alert("내용과 날짜를 모두 입력해주세요.");
            return;
        }

        const newNotice = {
            content: newNoticeContent,
            date: newNoticeDate,
            id: Date.now(), // Unique ID based on timestamp
        };

        setNotices([newNotice, ...notices]);
        setNewNoticeContent("");
        setNewNoticeDate("");
        setShowNewNotice(false);
    };

    return (
        <div className="wrap">
            <div> <Sidebar/> </div>
            {/* 메인 콘텐츠 섹션 */}
            <main className="yc_challenge_main-content">
                <Header/>
                <div className="yc_challenge_content">
                    {/* 공지 / 유의사항 섹션 */}
                    <section className="yc_challenge_notice-section">
                        <div className="yc_challenge_notice-header">
                            <h2>공지 / 유의사항</h2>
                            <button 
                                className="yc_challenge_announcement" 
                                onClick={() => setShowNewNotice(!showNewNotice)}
                            >
                                새 공지
                            </button>
                        </div>

                        {/* New Notice Form */}
                        {showNewNotice && (
                            <div className="yc_challenge_new-notice-form">
                                <textarea
                                    placeholder="공지 내용을 입력하세요."
                                    value={newNoticeContent}
                                    onChange={(e) => setNewNoticeContent(e.target.value)}
                                ></textarea>
                                
                                <button className="yc_challenge_add-btn" onClick={handleAddNotice}>
                                    등록
                                </button>
                            </div>
                        )}

                        <div className="yc_challenge_announcement-list">
                            {notices.length > 0 ? (
                                notices.map((notice) => (
                                    <div key={notice.id} className="yc_challenge_notice-item">
                                        <div className="yc_challenge_notice-item-header">
                                            <p>{notice.content}</p>
                                            <span className="yc_challenge_notice-date">작성일 {notice.date}</span>
                                        </div>
                                        <div className="yc_challenge_notice-meta">
                                            <button className="yc_challenge_delete-btn" onClick={() => handleDelete(notice.id)}>삭제</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>공지사항이 없습니다.</p>
                            )}
                        </div>
                    </section>

                    {/* 맵 및 이미지 섹션 */}
                    <div className="yc_challenge_map_section">
                        {/* 이미지 섹션 */}
                        <div className="yc_challenge_image-section">
                            <img src="https://via.placeholder.com/300" alt="Challenge Visual" className="yc_challenge_img" />
                        </div>

                        {/* 맵 섹션 */}
                        <div className="yc_challenge_map">
                            {/* 위치 검색 섹션 */}
                            <div className="yc_challenge_location-search">
                                <input type="text" placeholder="강남 2번출구 동일빌딩 12-4214" />
                                <button>목록</button>
                            </div>
                            {/* 지도 표시 영역 */}
                            <div className="yc_challenge_map-display">
                                {/* 지도 컴포넌트 또는 이미지 삽입 */}
                            </div>
                        </div>
                    </div>
                </div>
                
            </main>
        </div>
    );

};

export default YcChallengeBoard;
