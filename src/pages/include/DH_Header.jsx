//import 라이브러리
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

//import 컴포넌트
import profileStore from '../../ham_pages/ham_common/profileStore'; // ProfileStore import 경로 확인 <<-- 민규 Topbar 사용-------------------------------------->>
import Hmk_ProfileMenu from '../../ham_pages/ham_common/ham_ProfileMenu';
//import css
import '../../css/dh_header.css';

const defaultProfile = '/images/profile-fill.png'; // import default profileImage << -- 프로필 이미지 기본 값 -------------------------------------->>


const DH_Header = () => {

	/*---일반 변수 --------------------------------------------*/
	const [token, setToken] = useState(localStorage.getItem('token'));  // token 가져오는방법으로 초기값잡아주기
	const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));

	const [historyPoint, setHistoryPoint] = useState(0);
	const [notificationCount, setNotificationCount] = useState(0); // 알림 수 상태 변수 추가


	// --------------------------------< 민규 Tobbar용 사용 >----------------------------------------------------------------------------------------------------
	// Helper 함수 추가 -- 프로필 변경 시 헤더에도 적용되게 하는 것을 도와주는 함수
	const getFullImagePath = (path) => {
		if (!path) return defaultProfile;

		// 이미 완전한 경로를 가진 경우
		if (path.startsWith('http')) {
			const imageName = path.split('/').pop();
			return `/images/${imageName}`;
		}

		// img 폴더 내의 이미지인 경우 (/img/item3.jpg)
		if (path.includes('img/')) {
			return path; // 그대로 사용 (public 폴더 기준)
		}

		// images 폴더 내의 이미지인 경우
		if (path.startsWith('/images')) {
			return path;
		}

		// 단순 파일명만 있는 경우 (/item1.jpg)
		if (path.startsWith('/')) {
			return `/images${path}`;
		}

		return `/images/${path}`;
	};

	const [profile, setProfile] = useState({
		nickname: profileStore.getNickname(),
		profileImage: profileStore.getProfileImage(),
		challengesSummary: profileStore.getChallengesSummary(),
		ownedProfileImages: profileStore.getOwnedProfileImages(),
		region: profileStore.getRegion(),
		userNum: profileStore.getUserNum(),
		challengesDetails: profileStore.getChallengesDetails(),
	});
	// ProfileStore 구독
	useEffect(() => {
		const handleProfileChange = (updatedProfile) => {
			console.log("ProfileStore updated:", updatedProfile);
			setProfile(updatedProfile);
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
	const [isMenuOpen, setIsMenuOpen] = useState(false); // 슬라이드 메뉴 상태
	const menuRef = useRef(null); // 메뉴 외부 클릭 감지

	/*---일반 메소드 -----------------------------------------*/

	/*---생명주기 + 이벤트 관련 메소드 ----------------------*/
	// 유저 포인트
	const getUserPoints = () => {
		if (!token || !authUser) return;

		// JWT 토큰 만료 확인
		const isTokenExpired = (token) => {
			try {
				const decoded = jwtDecode(token);
				const currentTime = Date.now() / 1000; // 현재 시간(초 단위)
				return decoded.exp < currentTime; // 만약 토큰이 만료되었으면 true 반환
			} catch (error) {
				return true; // 토큰 디코드 실패 시 만료된 것으로 처리
			}
		};

		// 만약 토큰이 만료되었으면 로그아웃 처리
		if (isTokenExpired(token)) {
			localStorage.removeItem('token');
			localStorage.removeItem('authUser');
			navigate("/user/loginform"); // 로그아웃 후 로그인 페이지로 이동
			alert("일정시간이 지나 로그아웃 됐습니다. 다시 로그인하고 이용해주세요.");
			return;
		}

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
				} else {
					console.error("포인트 조회 실패");
				}
			})
			.catch(error => {
				// 오류 발생 시 처리
				console.error('Error fetching user points:', error);
			});
	};

	// 알림 수 가져오기 (API를 통해 가져오기)
	const fetchNotificationCount = async () => {
		try {
			const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
			const { userNum, token } = profile;

			if (!userNum || !token) {
				console.error('인증 정보가 없습니다.');
				return;
			}

			const summaryResponse = await axios.get(`${apiUrl}/api/my/${userNum}/noticeSummary`, {
				headers: { Authorization: `Bearer ${token}` }
			});

			if (summaryResponse.data.result === 'success') {
				setNotificationCount(summaryResponse.data.apiData.newNotice);
			} else {
				console.error('알림 요약 정보 조회 실패:', summaryResponse.data.message);
				setNotificationCount(0);
			}
		} catch (error) {
			console.error('알림 요약 정보를 가져오는 데 실패했습니다:', error);
			setNotificationCount(0);
		}
	};


	useEffect(() => {
		if (profile.userNum && profile.token) {
			getUserPoints();  // 로그인 상태일 때 포인트 정보 가져오기
			fetchNotificationCount(); // 알림 수 가져오기
		} else {
			console.log("Profile 상태:", profile); // 추가된 디버깅 로그
		}
	}, [profile.userNum, profile.token]);

	const handleLogout = async () => {
		//------------------------------------------ < 네이버 로그아웃 >-----------------------------------------
		if (authUser?.socialLogin === 'naver') {
			try {
				await axios.get(`https://nid.naver.com/oauth2.0/token`, {
					params: {
						grant_type: 'delete',
						client_id: process.env.REACT_APP_NAVER_CLIENT_ID,
						client_secret: process.env.REACT_APP_NAVER_CLIENT_SECRET,
						access_token: localStorage.getItem('naverAccessToken'),
						service_provider: 'NAVER'
					}
				});
				localStorage.removeItem('naverAccessToken');
			} catch (error) {
				console.error('네이버 로그아웃 실패:', error);
			}
		}
		if (authUser?.socialLogin === 'kakao') {
			try {
				await axios.post(`https://kapi.kakao.com/v1/user/logout`, null, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('kakaoAccessToken')}`
					}
				});
				localStorage.removeItem('kakaoAccessToken');  // 카카오 액세스 토큰 삭제
			} catch (error) {
				console.error('카카오 로그아웃 실패:', error);
			}
		}
		localStorage.clear();
		// --------------------------------< 민규 Tobbar용 사용 >--------------------------------
		profileStore.setToken(null); // ProfileStore에 토큰 제거를 요청하여 모든 사용자 정보를 초기화합니다.
		// --------------------------------< /민규 Tobbar용 사용 >--------------------------------
		setToken(null);
		setAuthUser(null);
		navigate("/user/loginform");
	};


	// 메뉴 외부 클릭 시 메뉴 닫기
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
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
							<li><Link to="/my/rank" className="dy-link" rel="noreferrer noopener">랭킹</Link></li>
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
						) : (
							<>
								{/* <div className="dy-afterlogin">
									<Link to="/my/mypage">
										<img
											src={getFullImagePath(profile.profileImage)}  // profile.profileImage 사용
											className="dy-header-profile"
											alt="profile"
											onError={(e) => {
												e.target.onerror = null;
												e.target.src = defaultProfile;
											}}
										/>
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
								</div> */}
								{/* --- 슬라이드 메뉴 추가 시작 --- */}
								<div className="hmk_afterlogin" ref={menuRef}>
									{/* 프로필 이미지를 클릭하면 슬라이드 메뉴가 나타남 */}
									<div className="hmk_profile-container">
										{/* 프로필 이미지 */}
										<img
											src={getFullImagePath(profile.profileImage)}  // profile.profileImage 사용
											className="hmk_header-profile"
											alt="profile"
											onClick={toggleMenu}
											onError={(e) => {
												e.target.onerror = null;
												e.target.src = defaultProfile;
											}}
										/>
										{/* 알림 배지 (읽지 않은 알림이 있을 경우에만) */}
										{notificationCount > 0 && (
											<Link to="/my/notices" className="hmk_notification-link">
												<span className="hmk_notification-badge">
													{notificationCount}
												</span>
											</Link>
										)}
									</div>
									{/* 슬라이드 메뉴 컴포넌트 추가 */}
									<Hmk_ProfileMenu
										isMenuOpen={isMenuOpen}
										toggleMenu={toggleMenu}
										handleLogout={handleLogout}
									/>
									{/* 기존 로그인 정보는 슬라이드 메뉴 외부에 유지 */}
									<ol className="hmk_header-login-info">
										<li className="hmk_header-nickname">{authUser.userName}</li>
										<li className="hmk_header-pointNlogout">
											<div className="hmk_header-point">
												<img src="../images/point.png" alt="point" />
												<span>{historyPoint !== null ? historyPoint : '0'}</span>
											</div>
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