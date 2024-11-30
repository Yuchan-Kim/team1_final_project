import React from 'react';
import { Link } from 'react-router-dom';

import '../css/Footer.css';

 const Footer = () => {

    return (
        <>
            {/* 푸터 */}
            <div className='footer'>
            <div className='footer-container'>
                <div className='jm-footer-body'>

                    {/* 푸터 컨텐츠 왼쪽 */}
                    <div className='jm-footer-content-left'>
                        <div className='jm-footer-logo'>
                        <Link to="/"><span>DONKEY:동기 키우기</span></Link>
                        </div>
                        <div className='jm-footer-content-left-top'>
                            <ul>
                                <li className='jm-footer-content-li'>평일 낮 13:00 ~ 밤 21:00 주말 및 공휴일 휴무</li>
                                <li className='jm-footer-content-li'>운영시간외에 고객문의 게시판에 문의해 주시기 바랍니다.</li>
                            </ul>
                        </div>
                        <div className='jm-footer-content-left-bottom'>
                            <ul>
                                <li className='jm-footer-content-li'>프로젝트명: DONKEY:동기 키우기 팀장:김유찬 팀원:함민규, 박지민, 이다현, 신지연</li>
                                <li className='jm-footer-content-li'>프로젝트 기간: 2024.10.27 ~ 2024.12.09</li>
                            </ul>
                        </div>
                    </div>
                    {/* 푸터 컨텐츠 왼쪽 끝 */}

                    {/* 푸터 컨텐츠 오른쪽 */}
                    <div className='jm-footer-content-right'>
                        <ul>
                            <Link to="/mainlist"><li>챌린지</li></Link>
                            <Link to="/pointstore/pointstoremain"><li>상점</li></Link>
                            <Link to="/my/rank"><li>랭킹</li></Link>
                            <Link to="/user/loginform"><li>로그인</li></Link>
                        </ul>
                    </div>
                    {/* 푸터 컨텐츠 오른쪽 끝 */}
                </div>
            </div>
            </div>
            {/* 푸터 끝 */}

        </>
    );

}

export default Footer;