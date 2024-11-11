import React from 'react';
import { Link } from 'react-router-dom';

import '../css/Challengemain.css';

import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";

const ChallengePage = () => {

  const missions = [
    { title: "스트레칭 하기", status: "제출", description: "인증방법 설명" },
    { title: "500미터 걷기", status: "제출", description: "인증방법 설명" },
    { title: "물 마시기", status: "제출", description: "인증방법 설명" },
    { title: "눈 마사지", status: "제출", description: "인증방법 설명" },
    { title: "눈 마시기", status: "제출", description: "인증방법 설명" }
  ];
  
  return (
    <div className="jm-bady">
      {/* Sidebar */}
      <div className='Sidenav'>
        <Sidebar />
      </div>

      <div className='jm-missionsinfo'>
      <Header/>

      <div className='jm-main-top'>

        {/* 방 주요 정보 컨테이너 */}
        <div className="room-info">
          <div className="room-card">
            <h3>방 소개</h3>
            <p>반갑습니다. 매일 500m 걷기 챌린지방 입니다.<br/> 꾸준한 걷는 습관을 만들고 싶은 분들을 모집 중입니다.<br/> 우리 모두 건강한 루틴을 만들었으면 좋겠습니다!</p>
          </div>
          <div className="room-card">
            <h3>공지 사항</h3>
            <p>공지 내용을 여기에 입력합니다.</p>
          </div>
          <div className="room-card">
            <h3>유의 사항</h3>
            <p>유의 사항 내용을 여기에 입력합니다.</p>
          </div>
        </div>

        {/* 방 유저 커뮤니티 */}
        <div className="weekly-info">

          <h1 className='jm-comunity-tatle'>커뮤니티</h1>
          <div id='chat-box'>
            <div className='user-msg-box'>
              <div className='user-msg'>웅앵</div>
            </div>
            <div className='bot-msg-box'>
              <div className='bot-msg'>후앵</div>
            </div>
          </div>
          <form id="auestion" >
            <input id="txt-box" type="text" name=""/>
            <button id='btn-send'>보내기</button>
          </form>
        </div>

        {/* 방 참여유저 목록 */}
        <div className="participant-info">
          <h3>유저 목록</h3>
          <table className="participant-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>상태</th>
                <th>포인트</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              <tr className='jm-user-list'>
                <td>황유찬</td>
                <td className="status-online">online</td>
                <td>600</td>
                <td><button>신고</button></td>
              </tr>
              <tr className='jm-user-list'>
                <td>황유찬</td>
                <td className="status-online">online</td>
                <td>600</td>
                <td><button>신고</button></td>
              </tr>
              <tr className='jm-user-list'>
                <td>황유찬</td>
                <td className="status-online">online</td>
                <td>600</td>
                <td><button>신고</button></td>
              </tr>
              {/* 나머지 유저 리스트 */}
            </tbody>
          </table>
        </div>
        </div>

        {/* Mission List */}
        <div className='jm-main-bottom'>
          <div className="mission-slider">
            <div className="mission-slider-track">
              {missions.map((mission, index) => (
                <Link to="/mission" key={index} className="mission-slide">
                  <h3>{mission.title}</h3>
                  <img src="https://via.placeholder.com/150" alt={mission.title} />
                  <p>{mission.description}</p>
                </Link>
              ))}
            </div>
          </div>

        
        <div className='mission-summary'>
        <Link to="/mission" className="jm-main-goal-mission">
          <h3>그룹 미션</h3>
          <div>
            <p>목표: 모든 인원이 걷기 목표 달성</p>
            <p>달성률: 74%</p>
          </div>
        </Link>
        <Link to="/mission" className="jm-main-group-mission">
          <h3>그룹 미션</h3>
          <div>
            <p>목표: 모든 인원이 걷기 목표 달성</p>
            <p>달성률: 74%</p>
          </div>
        </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengePage;
