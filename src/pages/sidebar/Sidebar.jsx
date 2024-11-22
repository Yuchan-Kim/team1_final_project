import React from 'react';

import '../css/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="user-info">
        <h2>김유찬</h2>
        <p>3600 Points</p>
      </div>
      <ul>
        <li>미션</li>
        <li>미션 제출</li>
        <li>제출 현황</li>
        <li>커뮤니티</li>
        <li>유저 현황</li>
        <li>게시판</li>
        <li>관리</li>
      </ul>
    </div>
  );
}

export default Sidebar;
