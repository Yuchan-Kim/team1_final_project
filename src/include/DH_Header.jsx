//import 라이브러리
import React from 'react';
import { Link } from 'react-router-dom';
// import React, {useState} from 'react';	화면 상태관리
// import { useSearchParams} from 'react-router-dom';	파라미터값사용하는 라우터

//import 컴포넌트

//import css
import '../css/dh_header.css';


const DH_Header = () => {

	/*---일반 변수 --------------------------------------------*/

	/*---라우터 관련------------------------------------------*/

	/*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/


    return (
        <>
			<header className="dy-header">
				<div className="dy-logo">
					<Link to="" className="dy-link" rel="noreferrer noopener">
						<ol>
							<li>DONKEY</li>
							<li>동기 키우기</li>
						</ol>
					</Link>
				</div>
				{/* /dy-logo */}

				<div className="dy-menu">
					<ol>
						<li><Link to="" className="dy-link" rel="noreferrer noopener">챌린지</Link></li>
						<li><Link to="" className="dy-link" rel="noreferrer noopener">커뮤니티</Link></li>
						<li><Link to="" className="dy-link" rel="noreferrer noopener">랭킹</Link></li>
						<li><Link to="" className="dy-link" rel="noreferrer noopener">상점</Link></li>
						<li><Link to="" className="dy-link" rel="noreferrer noopener">고객센터</Link></li>
					</ol>
				</div>
				{/* /dy-menu */}

				<div className="dy-info">
					<ol>
						<li><Link to="" className="dy-link" rel="noreferrer noopener">로그인</Link></li>
						<li><Link to="" className="dy-link" rel="noreferrer noopener">회원가입</Link></li>
					</ol>
				</div>
			</header>
        </>
    );
}

export default DH_Header;