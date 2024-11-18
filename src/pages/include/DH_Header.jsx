//import 라이브러리
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { useSearchParams} from 'react-router-dom';   파라미터값사용하는 라우터

//import 컴포넌트

//import css
import '../../css/dh_header.css';


const DH_Header = () => {

   /*---일반 변수 --------------------------------------------*/
   // 로그인 전 1
   // const state = 1;   
   const [token, setToken] = useState(localStorage.getItem('token'));  // token 가져오는방법으로 초기값잡아주기
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));

   const navigate = useNavigate();

   /*---라우터 관련------------------------------------------*/

   /*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

   /*---일반 메소드 -----------------------------------------*/

   /*---생명주기 + 이벤트 관련 메소드 ----------------------*/
   const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authUser');
        setToken(null);
        setAuthUser(null);
      navigate("/user/loginform");  
    };


    return (
        <>
         <header className="dy-header">
            <div className="dy-header-content">
               <div className="dy-logo">
                  <Link to="/" className="dy-link" rel="noreferrer noopener">
                     <ol>
                        <li>DONKEY:동기 키우기</li>
                     </ol>
                  </Link>
               </div>
               {/* /dy-logo */}

               <div className="dy-menu">
                  <ol>
                     <li><Link to="/" className="dy-link" rel="noreferrer noopener">챌린지</Link></li>
                     <li><Link to="" className="dy-link" rel="noreferrer noopener">커뮤니티</Link></li>
                     <li><Link to="" className="dy-link" rel="noreferrer noopener">랭킹</Link></li>
                     <li><Link to="/pointstore/pointstoremain" className="dy-link" rel="noreferrer noopener">상점</Link></li>
                     <li><Link to="" className="dy-link" rel="noreferrer noopener">고객센터</Link></li>
                  </ol>
               </div>
               {/* /dy-menu */}

               <div className="dy-info">
                  {token === null ? (
                     <>
                        <ol className="dy-beforelogin">
                           <li><Link to="/user/loginform" className="dy-link" rel="noreferrer noopener">로그인</Link></li>
                           <li><Link to="/user/joinform" className="dy-link" rel="noreferrer noopener">가입하기</Link></li>
                        </ol>
                     </>
                  ):(
                     <>
                        <div className="dy-afterlogin">
                           <Link to="">
                              <img src="../images/profile.png" className="dy-header-profile" alt="profile" />
                           </Link>
                           <ol className="dy-header-login-info">
                              <li className="dy-header-nickname">{authUser.userName}</li>
                              <li className="dy-header-pointNlogout">
                                 <div className="dy-header-point">
                                    <img src="../images/point.png" alt="point" />
                                    <span>3600</span>
                                 </div>
                                 <button className="dy-logout-btn" onClick={handleLogout}>로그아웃</button>
                              </li>
                           </ol>
                        </div>
                     </>
                  )}

               </div>
            </div>
            {/* /dy-header-content */}
         </header>
        </>
    );
}

export default DH_Header;