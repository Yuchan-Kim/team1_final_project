//import 라이브러리
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { useSearchParams} from 'react-router-dom';   파라미터값사용하는 라우터

//import 컴포넌트
import profileStore from '../../ham_pages/ham_common/profileStore'; // ProfileStore import 경로 확인 <<-- 민규 Topbar 사용-------------------------------------->>

//import css
import '../../css/dh_header.css';


const DH_Header = () => {

   /*---일반 변수 --------------------------------------------*/
   const [token, setToken] = useState(localStorage.getItem('token'));  // token 가져오는방법으로 초기값잡아주기
    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));

   const [historyPoint, setHistoryPoint] = useState(0);

   // --------------------------------< 민규 Tobbar용 사용 >----------------------------------------------------------------------------------------------------

   const [profile, setProfile] = useState({
        nickname: profileStore.getNickname(),
        profileImage: profileStore.getProfileImage(),
        challengesSummary: profileStore.getChallengesSummary(),
        ownedProfileImages: profileStore.getOwnedProfileImages(),
        region: profileStore.getRegion(),
        userNum: profileStore.getUserNum(),
        challengesDetails: profileStore.getChallengesDetails(),
        token: profileStore.getToken()
    });
   // ProfileStore 구독
    useEffect(() => {
        const handleProfileChange = (updatedProfile) => {
            console.log("ProfileStore updated:", updatedProfile);
            setProfile({
               userNum: updatedProfile.userNum,
               nickname: updatedProfile.nickname,
               profileImage: updatedProfile.profileImage,
               challengesSummary: updatedProfile.challengesSummary,
               ownedProfileImages: updatedProfile.ownedProfileImages,
               region: updatedProfile.region,
               challengesDetails: updatedProfile.challengesDetails,
               token: updatedProfile.token
           });

            // 'authUser'를 업데이트하여 헤더에서 사용
            const authUserStr = localStorage.getItem('authUser');
            if (authUserStr) {
                try {
                    const authUser = JSON.parse(authUserStr);
                    authUser.userName = updatedProfile.nickname;
                    localStorage.setItem('authUser', JSON.stringify(authUser));
                    setAuthUser(authUser);
                } catch (error) {
                    console.error('Failed to parse authUser from localStorage:', error);
                }
            } else {
                // 'authUser'가 없으면 생성
                const newAuthUser = { userName: updatedProfile.nickname };
                localStorage.setItem('authUser', JSON.stringify(newAuthUser));
                setAuthUser(newAuthUser);
            }
        };
        profileStore.subscribe(handleProfileChange);
        // 초기 구독자 호출
        handleProfileChange({
            nickname: profileStore.getNickname(),
            profileImage: profileStore.getProfileImage(),
            challengesSummary: profileStore.getChallengesSummary(),
            ownedProfileImages: profileStore.getOwnedProfileImages(),
            region: profileStore.getRegion(),
            userNum: profileStore.getUserNum(),
            challengesDetails: profileStore.getChallengesDetails(),
            token: profileStore.getToken()
        });
        return () => {
            profileStore.unsubscribe(handleProfileChange);
        };
    }, []);

    // 로그인 시 ProfileStore에 토큰 전달
    useEffect(() => {
        profileStore.setToken(token);
    }, [token]);

   // --------------------------------< /민규 Tobbar용 사용 >----------------------------------------------------------------------------------------------------

   const navigate = useNavigate();

   /*---라우터 관련------------------------------------------*/

   /*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/

   /*---일반 메소드 -----------------------------------------*/

   /*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 유저 포인트
    const getUserPoints = () => {
      if (!token || !authUser) return;
   
      axios({
         method: 'get', // HTTP 메서드 설정 (GET 요청)
         url: `${process.env.REACT_APP_API_URL}/api/user/points`, // API URL
         params: { userNum: authUser.userNum }, 
         headers: { "Authorization": `Bearer ${token}` },
         responseType: 'json' // 서버 응답 형식
      })
      .then(response => {
         // 응답이 성공적일 경우
         if (response.data.result === "success") {
            setHistoryPoint(response.data.apiData); // 포인트 정보 저장
         }else {
            console.error("포인트 조회 실패");
         }
      })
      .catch(error => {
         // 오류 발생 시 처리
         console.error('Error fetching user points:', error);
      });
   };

    useEffect(() => {
        if (token && authUser) {
            getUserPoints();  // 로그인 상태일 때 포인트 정보 가져오기
        }
    }, [token, authUser.userName]);

   const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authUser');
      // --------------------------------< 민규 Tobbar용 사용 >--------------------------------
      profileStore.setToken(null); // ProfileStore에 토큰 제거를 요청하여 모든 사용자 정보를 초기화합니다.
      // --------------------------------< /민규 Tobbar용 사용 >--------------------------------
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
                     <li><Link to="/user/rank" className="dy-link" rel="noreferrer noopener">랭킹</Link></li>
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
                           <Link to="/user/mypage">
                              <img src="../images/profile.png" className="dy-header-profile" alt="profile" />
                           </Link>
                           <ol className="dy-header-login-info">
                              <li className="dy-header-nickname">{authUser.userName}</li>
                              <li className="dy-header-pointNlogout">
                                 <div className="dy-header-point">
                                    <img src="../images/point.png" alt="point" />
                                    <span>{historyPoint !== null ? historyPoint : '0'}</span>
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