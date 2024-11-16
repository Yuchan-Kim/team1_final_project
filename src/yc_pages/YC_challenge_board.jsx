// YcChallengeBoard.jsx

/**
 * ## YcChallengeBoard 컴포넌트 설명서
 *
 * 이 컴포넌트는 공지사항 관리 기능을 제공하는 챌린지 보드입니다.
 * 주요 기능은 공지사항을 불러오기(Read), 추가하기(Create), 수정하기(Update), 삭제하기(Delete) 입니다.
 * 아래는 각 기능에 대한 시나리오와 동작 과정에 대한 상세한 설명입니다.
 *
 * ### 주요 시나리오 및 동작 과정
 *
 * #### 1. 공지사항 불러오기 (Read)
 * - **동작 과정:**
 *   1. 컴포넌트가 처음 마운트될 때 `useEffect` 훅을 통해 `fetchNotices` 함수가 호출됩니다.
 *   2. `fetchNotices` 함수는 `axios`를 사용하여 서버의 `/api/notices` 엔드포인트에 GET 요청을 보냅니다.
 *   3. 요청이 성공하면, 서버로부터 받은 공지사항 데이터를 `notices` 상태에 저장하고, `loading` 상태를 `false`로 변경합니다.
 *   4. 요청이 실패하면, 에러 메시지를 `error` 상태에 저장하고, `loading` 상태를 `false`로 변경합니다.
 *
 * - **화면 표시:**
 *   - **로딩 중일 때:** "공지사항을 불러오는 중입니다..." 메시지가 표시됩니다.
 *   - **에러 발생 시:** 에러 메시지가 표시됩니다.
 *   - **공지사항이 있을 경우:** 공지사항 목록이 카드 형태로 표시됩니다.
 *   - **공지사항이 없을 경우:** "공지사항이 없습니다." 메시지가 표시됩니다.
 *
 * #### 2. 공지사항 추가 (Create)
 * - **동작 과정:**
 *   1. 사용자가 "새 공지 추가" 버튼을 클릭하면 `toggleNewNotice` 함수가 호출되어 새 공지사항 작성 폼이 표시됩니다.
 *   2. 사용자가 공지사항의 제목과 내용을 입력하고, (선택적으로 장소를 등록할 수 있습니다).
 *   3. "등록" 버튼을 클릭하면 `handleAddOrEditNotice` 함수가 호출됩니다.
 *   4. `handleAddOrEditNotice` 함수는 `isEditing` 상태가 `false`이므로, 서버의 `/api/notices` 엔드포인트에 POST 요청을 보냅니다.
 *   5. 요청이 성공하면, 서버로부터 받은 새 공지사항을 `notices` 상태에 추가하고, 폼을 초기화하며 숨깁니다.
 *   6. 요청이 실패하면, 에러 메시지를 `error` 상태에 설정합니다.
 *
 * - **화면 표시:**
 *   - **새 공지사항 작성 폼이 표시되고, 사용자가 입력을 완료하면 공지사항 목록에 새 공지사항이 추가됩니다.**
 *   - **필수 필드가 비어있으면 "등록" 버튼이 비활성화됩니다.**
 *
 * #### 3. 공지사항 수정 (Update)
 * - **동작 과정:**
 *   1. 사용자가 특정 공지사항의 "수정" 버튼을 클릭하면 `handleEditClick` 함수가 호출됩니다.
 *   2. `handleEditClick` 함수는 선택한 공지사항의 데이터를 폼에 채우고, `isEditing` 상태를 `true`로 설정하여 편집 모드로 전환합니다.
 *   3. 사용자가 공지사항의 제목, 내용, 장소를 수정한 후 "수정" 버튼을 클릭하면 `handleAddOrEditNotice` 함수가 호출됩니다.
 *   4. `handleAddOrEditNotice` 함수는 `isEditing` 상태가 `true`이므로, 서버의 `/api/notices/{id}` 엔드포인트에 PUT 요청을 보냅니다.
 *   5. 요청이 성공하면, 서버로부터 받은 수정된 공지사항을 `notices` 상태에 업데이트하고, 편집 모드를 종료하며 폼을 초기화하고 숨깁니다.
 *   6. 요청이 실패하면, 에러 메시지를 `error` 상태에 설정합니다.
 *
 * - **화면 표시:**
 *   - **수정할 공지사항의 정보가 폼에 채워지고, 사용자가 수정한 내용이 공지사항 목록에 반영됩니다.**
 *   - **수정된 공지사항에는 "수정됨" 배지가 표시됩니다.**
 *
 * #### 4. 공지사항 삭제 (Delete)
 * - **동작 과정:**
 *   1. 사용자가 특정 공지사항의 "삭제" 버튼을 클릭하면 `handleDeleteClick` 함수가 호출됩니다.
 *   2. `handleDeleteClick` 함수는 삭제할 공지사항의 ID를 `noticeToDelete` 상태에 저장하고, 삭제 확인 모달을 표시합니다.
 *   3. 사용자가 모달의 "확인" 버튼을 클릭하면 `handleConfirmDelete` 함수가 호출됩니다.
 *   4. `handleConfirmDelete` 함수는 서버의 `/api/notices/{id}` 엔드포인트에 DELETE 요청을 보내어 공지사항을 삭제합니다.
 *   5. 요청이 성공하면, `notices` 상태에서 해당 공지사항을 제거하고, 삭제 확인 모달을 숨깁니다.
 *   6. 요청이 실패하면, 에러 메시지를 `error` 상태에 설정합니다.
 *   7. 사용자가 모달의 "취소" 버튼을 클릭하면 `handleCancelDelete` 함수가 호출되어 모달을 숨깁니다.
 *
 * - **화면 표시:**
 *   - **삭제 확인 모달이 표시되고, 사용자가 "확인"을 클릭하면 공지사항이 목록에서 제거됩니다.**
 *   - **삭제된 공지사항이 없으면 "공지사항이 없습니다." 메시지가 표시됩니다.**
 *
 * ### 추가적인 고려 사항
 *
 * - **환경 변수 설정:**
 *   - `process.env.REACT_APP_API_URL`은 프로젝트의 환경 변수로, 실제 API 서버의 URL을 설정해야 합니다.
 *   - `.env` 파일에 다음과 같이 추가할 수 있습니다:
 *     ```
 *     REACT_APP_API_URL=http://your-api-url.com
 *     ```
 *   - 환경 변수를 변경한 후에는 프로젝트를 다시 빌드해야 적용됩니다.
 *
 * - **CORS 설정:**
 *   - 클라이언트와 서버가 다른 도메인에 있을 경우, 서버에서 CORS 설정을 적절히 해야 합니다. 이는 클라이언트가 서버 API에 접근할 수 있도록 허용하는 설정입니다.
 *
 * - **인증 및 권한 관리:**
 *   - 공지사항 추가, 수정, 삭제 기능은 인증된 사용자만 접근할 수 있도록 서버에서 인증 및 권한을 관리해야 합니다.
 *   - 예를 들어, JWT 토큰을 사용하여 사용자를 인증하고, 특정 역할(Role)을 가진 사용자만 공지사항을 수정할 수 있도록 설정할 수 있습니다.
 *
 * - **에러 핸들링:**
 *   - 현재 코드에서는 간단한 에러 메시지를 표시하고 있지만, 실제 프로젝트에서는 사용자에게 보다 구체적인 에러 정보를 제공하거나, 다양한 에러 상황에 맞는 핸들링 로직을 추가할 수 있습니다.
 *
 * - **보안 고려 사항:**
 *   - 클라이언트 측에서 입력된 데이터는 반드시 서버 측에서 검증하고, XSS(교차 사이트 스크립팅)와 같은 보안 위협에 대비해야 합니다.
 *   - axios 요청 시 민감한 데이터는 HTTPS를 통해 암호화된 채널로 전송해야 합니다.
 *
 * - **성능 최적화:**
 *   - 공지사항이 많은 경우, 페이지네이션(Pagination)이나 무한 스크롤(Infinite Scroll) 기능을 도입하여 초기 로딩 시간을 단축하고, 사용자 경험을 향상시킬 수 있습니다.
 *   - 또한, React의 `memo`나 `useMemo` 등을 사용하여 불필요한 렌더링을 방지할 수 있습니다.
 *
 */
import React, { useState, useEffect } from "react"; // React와 useState, useEffect 훅을 임포트
import { useParams, useNavigate } from 'react-router-dom';

//React 라이브러리
import axios from "axios"; // axios 라이브러리 임포트
import { FaPlus, FaMinus, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa"; //React Icons에서 필요한 아이콘들 임포트

// CSS 파일
import "../yc_assets/yc_css/yc_css_challenge_board.css"; // 챌린지 보드 스타일시트 임포트

//include jsx 파일
import Sidebar from "../yc_pages/YC_challenge_sidebar.jsx"; // 사이드바 컴포넌트 임포트
import Header from "./JMYC_challenge_header.jsx"; // 헤더 컴포넌트 임포트
import Footert from "../pages/include/JM-Footer.jsx"; // 푸터 컴포넌트 임포트
import TopHeader from "../pages/include/DH_Header.jsx"; // 상단 헤더 컴포넌트 임포트
import ChatRoom from "../yc_pages/YC_challenge_chatroom.jsx"; // 채팅룸 컴포넌트 임포트

const YcChallengeBoard = () => {

    const { roomNum } = useParams(); // useParams를 사용하여 roomNum을 URL에서 가져옴
    const navigate = useNavigate();

    const [userAuth, setUserAuth] = useState(0);

    // 공지사항 목록을 상태로 관리
    const [notices, setNotices] = useState([]);
    // 데이터 로딩 상태를 관리
    const [loading, setLoading] = useState(true);
    // 에러 메시지를 관리
    const [error, setError] = useState(null);

    // 새 공지사항 작성 폼의 표시 여부를 상태로 관리
    const [showNewNotice, setShowNewNotice] = useState(false);
    // 새 공지사항의 제목을 상태로 관리
    const [newNoticeTitle, setNewNoticeTitle] = useState("");
    // 새 공지사항의 내용을 상태로 관리
    const [newNoticeContent, setNewNoticeContent] = useState("");

    // 장소 등록 옵션의 표시 여부를 상태로 관리
    const [showPlaceOption, setShowPlaceOption] = useState(false);
    // 새 공지사항의 장소를 상태로 관리
    const [newNoticePlace, setNewNoticePlace] = useState("");

    // 편집 모드 관련 상태
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 여부
    const [editingNoticeId, setEditingNoticeId] = useState(null); // 편집 중인 공지사항의 ID

    // 삭제 확인 모달 관련 상태
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 표시 여부
    const [noticeToDelete, setNoticeToDelete] = useState(null); // 삭제할 공지사항의 ID

    /**
     * 컴포넌트가 마운트될 때 공지사항을 서버로부터 불러옵니다.
     */
    useEffect(() => {
        console.log("마운트 완료");
        checkAuthUser();
    }, []);

    const checkAuthUser = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = 
                axios({
                    method: 'get',
                    url: `http://localhost:9000/api/challenge/announcement/${roomNum}`, // 참여 유저인지 아닌지 체크
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.data.result === 'success' && response.data.apiData === true) {
                    console.log('방에 참여한 유저입니다.');
                    axios ({
                        method: 'get',
                        url: `http://localhost:9000/api/challenge/announcement/user/${roomNum}`,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(response => {
                        if (response.data.result === 'success' && response.data.apiData === 1){
                            setUserAuth(1);
                            fetchNotices();
                        }else if (response.data.result === 'success' && response.data.data === 2) {
                            setUserAuth(2);
                            fetchNotices();
                        }
                    })
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
                    navigate("/");
                }
            }
        } else {
            alert('로그인이 필요합니다.');
            //navigate('/user/loginform');
            fetchNotices();
        }
    };
        
    /**
     * 공지사항을 서버로부터 불러오는 함수
     * GET 요청을 보내어 공지사항 데이터를 가져옵니다.
     */
    const fetchNotices = () => {
        axios({
            method: 'get', // GET 방식 요청
            url: `http://localhost:9000/api/challenge/announcement/get/${roomNum}`, // 공지사항 API 엔드포인트
            responseType: 'json' // 응답 데이터 타입을 JSON으로 설정
        })
        .then(response => {
            if (response.data.result === 'success') { // 요청이 성공했는지 확인
                setNotices(response.data.apiData); // 공지사항 목록을 상태에 저장
                setLoading(false); // 로딩 상태 종료
            } else {
                // 요청이 실패했을 경우 실행되는 로직
                setError("공지사항을 불러오는 데 실패했습니다."); // 에러 메시지 설정
                setLoading(false); // 로딩 상태 종료
            }
        })
        .catch(error => {
            // 네트워크 오류 등 예외가 발생했을 경우 실행되는 로직
            setError("공지사항을 불러오는 중 오류가 발생했습니다."); // 에러 메시지 설정
            setLoading(false); // 로딩 상태 종료
            console.error(error); // 콘솔에 오류 로그 출력
        });
    };

    /**
     * 삭제 버튼 클릭 시 호출되는 함수
     * @param {number} id 삭제할 공지사항의 ID
     */
    const handleDeleteClick = (id) => {
        setNoticeToDelete(id); // 삭제할 공지사항의 ID를 상태에 저장
        setShowDeleteModal(true); // 삭제 확인 모달을 표시
    };

    /**
     * 삭제 확인 시 호출되는 함수
     * 서버에 DELETE 요청을 보내 공지사항을 삭제합니다.
     */
    const handleConfirmDelete = () => {
        if (noticeToDelete !== null) { // 삭제할 공지사항 ID가 설정되었는지 확인
            axios({
                method: 'delete', // DELETE 방식 요청
                url: `http://localhost:9000/api/announcement/delete${noticeToDelete}`, // 삭제할 공지사항의 API 엔드포인트
                responseType: 'json' // 응답 데이터 타입을 JSON으로 설정
            })
            .then(response => {
                if (response.data.result === 'success') { // 요청이 성공했는지 확인
                    setNotices(notices.filter(notice => notice.id !== noticeToDelete)); // 삭제된 공지사항을 목록에서 제거
                    setNoticeToDelete(null); // 삭제할 공지사항 ID 초기화
                    setShowDeleteModal(false); // 삭제 확인 모달 숨기기
                } else {
                    // 요청이 실패했을 경우 실행되는 로직
                    setError("공지사항 삭제에 실패했습니다."); // 에러 메시지 설정
                }
            })
            .catch(error => {
                // 네트워크 오류 등 예외가 발생했을 경우 실행되는 로직
                setError("공지사항 삭제 중 오류가 발생했습니다."); // 에러 메시지 설정
                console.error(error); // 콘솔에 오류 로그 출력
            });
        }
    };

    /**
     * 공지사항 추가 또는 수정 시 호출되는 함수
     * 현재 편집 모드인지 여부에 따라 POST 또는 PUT 요청을 보냅니다.
     */
    const handleAddOrEditNotice = () => {
        if (isEditing) { // 편집 모드인 경우
            // 수정할 공지사항의 데이터를 준비
            const updatedNotice = {
                title: newNoticeTitle, // 제목
                content: newNoticeContent, // 내용
                place: showPlaceOption ? newNoticePlace : null, // 장소 (옵션 선택 시)
            };

            // 서버에 PUT 요청을 보내어 공지사항을 수정
            axios({
                method: 'put', // PUT 방식 요청
                url: `http://localhost:9000/api/anouncement/edit/${editingNoticeId}`, // 수정할 공지사항의 API 엔드포인트
                data: updatedNotice, // 수정할 데이터
                responseType: 'json' // 응답 데이터 타입을 JSON으로 설정
            })
            .then(response => {
                if (response.data.result === 'success') { // 요청이 성공했는지 확인
                    // 공지사항 목록을 업데이트하여 수정된 공지사항 반영
                    setNotices(notices.map(notice => {
                        if (notice.id === editingNoticeId) { // 수정할 공지사항을 찾음
                            return {
                                ...notice, // 기존 공지사항 데이터 유지
                                ...updatedNotice, // 수정된 데이터 덮어쓰기
                                isModified: true, // 수정됨 표시
                            };
                        }
                        return notice; // 다른 공지사항은 그대로 유지
                    }));
                    setIsEditing(false); // 편집 모드 해제
                    setEditingNoticeId(null); // 편집 중인 공지사항 ID 초기화
                    // 폼 필드 초기화
                    setNewNoticeTitle("");
                    setNewNoticeContent("");
                    setNewNoticePlace("");
                    setShowPlaceOption(false);
                    setShowNewNotice(false); // 폼 숨기기
                } else {
                    // 요청이 실패했을 경우 실행되는 로직
                    setError("공지사항 수정에 실패했습니다."); // 에러 메시지 설정
                }
            })
            .catch(error => {
                // 네트워크 오류 등 예외가 발생했을 경우 실행되는 로직
                setError("공지사항 수정 중 오류가 발생했습니다."); // 에러 메시지 설정
                console.error(error); // 콘솔에 오류 로그 출력
            });
        } else { // 추가 모드인 경우
            // 추가할 공지사항의 데이터를 준비
            const newNotice = {
                title: newNoticeTitle, // 제목
                announcement: newNoticeContent, // 내용
                place: showPlaceOption ? newNoticePlace : null, // 장소 (옵션 선택 시)
            };

            // 서버에 POST 요청을 보내어 새로운 공지사항을 추가
            axios({
                method: 'post', // POST 방식 요청
                url: `http://localhost:9000/api/anouncement/addannounce`, // 공지사항 추가 API 엔드포인트
                data: newNotice, // 추가할 데이터
                responseType: 'json' // 응답 데이터 타입을 JSON으로 설정
            })
            .then(response => {
                if (response.data.result === 'success') { // 요청이 성공했는지 확인
                    setNotices([response.data.result, ...notices]); // 새 공지사항을 목록의 맨 앞에 추가
                    // 폼 필드 초기화
                    setNewNoticeTitle("");
                    setNewNoticeContent("");
                    setNewNoticePlace("");
                    setShowPlaceOption(false);
                    setShowNewNotice(false); // 폼 숨기기
                } else {
                    // 요청이 실패했을 경우 실행되는 로직
                    setError("공지사항 추가에 실패했습니다."); // 에러 메시지 설정
                }
            })
            .catch(error => {
                // 네트워크 오류 등 예외가 발생했을 경우 실행되는 로직
                setError("공지사항 추가 중 오류가 발생했습니다."); // 에러 메시지 설정
                console.error(error); // 콘솔에 오류 로그 출력
            });
        }
    };

    /**
     * 수정 버튼 클릭 시 호출되는 함수
     * 선택한 공지사항의 데이터를 폼에 채우고, 편집 모드로 전환합니다.
     * @param {object} notice 수정할 공지사항 객체
     */
    const handleEditClick = (notice) => {
        setIsEditing(true); // 편집 모드 활성화
        setEditingNoticeId(notice.id); // 편집할 공지사항 ID 설정
        setNewNoticeTitle(notice.title); // 기존 공지사항의 제목을 폼에 채움
        setNewNoticeContent(notice.content); // 기존 공지사항의 내용을 폼에 채움
        if (notice.place) { // 장소 정보가 있는 경우
            setShowPlaceOption(true); // 장소 옵션 표시
            setNewNoticePlace(notice.place); // 기존 장소를 폼에 채움
        } else {
            setShowPlaceOption(false); // 장소 옵션 숨기기
            setNewNoticePlace("");
        }
        setShowNewNotice(true); // 공지사항 작성 폼을 표시
    };

    /**
     * 새 공지사항 폼의 표시/숨기기 토글 함수
     * 폼이 표시 중이면 숨기고, 숨겨져 있으면 표시합니다.
     */
    const toggleNewNotice = () => {
        if (showNewNotice) { // 폼이 현재 표시 중인 경우
            // 폼 숨기기 및 관련 상태 초기화
            setShowNewNotice(false);
            setIsEditing(false);
            setEditingNoticeId(null);
            setNewNoticeTitle("");
            setNewNoticeContent("");
            setNewNoticePlace("");
            setShowPlaceOption(false);
        } else { // 폼이 현재 숨겨져 있는 경우
            setShowNewNotice(true); // 폼 표시
        }
    };

    /**
     * 삭제 취소 시 호출되는 함수
     * 삭제할 공지사항 ID를 초기화하고, 삭제 확인 모달을 숨깁니다.
     */
    const handleCancelDelete = () => {
        setNoticeToDelete(null); // 삭제할 공지사항 ID 초기화
        setShowDeleteModal(false); // 삭제 확인 모달 숨기기
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
                                    value={newNoticeTitle} // 상태와 연동된 값
                                    onChange={(e) => setNewNoticeTitle(e.target.value)} // 입력 시 상태 업데이트
                                    className="yc_challenge_notice-title" // 스타일 클래스
                                />
                                {/* 공지사항 내용 입력 필드 */}
                                <textarea
                                    placeholder="공지 내용을 입력하세요."
                                    value={newNoticeContent} // 상태와 연동된 값
                                    onChange={(e) => setNewNoticeContent(e.target.value)} // 입력 시 상태 업데이트
                                    className="yc_challenge_notice-content" // 스타일 클래스
                                ></textarea>
                                
                                {/* 장소 등록 옵션 */}
                                <div className="yc_challenge_place-option">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={showPlaceOption} // 상태와 연동된 체크 상태
                                            onChange={() => {
                                                setShowPlaceOption(!showPlaceOption); // 체크 상태 토글
                                                if (showPlaceOption) setNewNoticePlace(""); // 체크 해제 시 장소 필드 초기화
                                            }}
                                        />
                                        장소 등록
                                    </label>
                                </div>

                                {/* 장소 입력 필드 (옵션 선택 시 표시) */}
                                {showPlaceOption && (
                                    <div className="yc_challenge_place-input">
                                        <FaMapMarkerAlt className="yc_place-icon"/> {/* 장소 아이콘 표시 */}
                                        <input
                                            type="text"
                                            placeholder="장소를 입력하세요."
                                            value={newNoticePlace} // 상태와 연동된 값
                                            onChange={(e) => setNewNoticePlace(e.target.value)} // 입력 시 상태 업데이트
                                        />
                                        {/* 장소 등록 취소 버튼 */}
                                        <button
                                            className="yc_challenge_remove-place-btn"
                                            onClick={() => {
                                                setShowPlaceOption(false); // 장소 옵션 숨기기
                                                setNewNoticePlace(""); // 장소 필드 초기화
                                            }}
                                            aria-label="장소 등록 취소" // 접근성을 위한 레이블 설정
                                        >
                                            <FaMinus />
                                        </button>
                                    </div>
                                )}

                                {/* 공지사항 등록 또는 수정 버튼 */}
                                <button
                                    className="yc_challenge_add-btn"
                                    onClick={handleAddOrEditNotice} // 버튼 클릭 시 공지사항 추가 또는 수정 함수 호출
                                    disabled={
                                        !newNoticeTitle ||  // 제목이 비어있으면 비활성화
                                        !newNoticeContent ||  // 내용이 비어있으면 비활성화
                                        (showPlaceOption && !newNoticePlace) // 장소 옵션 선택 시 장소가 비어있으면 비활성화
                                    }
                                >
                                    {isEditing ? "수정" : "등록"} {/* 편집 모드에 따라 버튼 텍스트 변경 */}
                                </button>
                            </div>
                        )}

                        {/* 공지사항 목록 */}
                        <div className="yc_challenge_announcement-list">
                            {loading ? (
                                // 데이터 로딩 중일 때 표시
                                <p>공지사항을 불러오는 중입니다...</p>
                            ) : error ? (
                                // 에러 발생 시 에러 메시지 표시
                                <p>{error}</p>
                            ) : notices.length > 0 ? (
                                // 공지사항이 존재할 경우
                                notices.map((notice, index) => (
                                    <div key={notice.id} className="yc_challenge_notice-item">
                                        {/* 공지사항 헤더: 제목과 작성일 */}
                                        <div className="yc_challenge_notice-item-header">
                                            <div className="yc_challenge_notice-title">
                                                <h3>{notice.title}</h3> {/* 공지사항 제목 표시 */}
                                                {notice.isModified && <span className="yc_modified-badge">수정됨</span>} {/* 수정된 공지사항일 경우 배지 표시 */}
                                            </div>
                                            <span className="yc_challenge_notice-date">작성일 {notice.announceTime}</span> {/* 작성일 표시 */}
                                        </div>
                                        {/* 공지사항 내용 */}
                                        <div className="yc_challenge_notice-item-content">
                                            <p>{notice.announcement}</p> {/* 공지사항 내용 표시 */}
                                            {notice.place && ( // 장소 정보가 있을 경우
                                                <div className="yc_challenge_notice-place">
                                                    <FaMapMarkerAlt className="yc_place-icon"/> {/* 장소 아이콘 표시 */}
                                                    <span>{notice.place}</span> {/* 장소 정보 표시 */}
                                                </div>
                                            )}
                                        </div>
                                        {/* 공지사항 메타 정보: 수정 및 삭제 버튼 */}
                                        {userAuth === 1 && (
                                        <div className="yc_challenge_notice-meta">
                                            {/* 수정 버튼 */}
                                            <button
                                                className="yc_challenge_edit-btn"
                                                onClick={() => handleEditClick(notice)} // 버튼 클릭 시 수정 함수 호출
                                                aria-label="공지 수정" // 접근성을 위한 레이블 설정
                                            >
                                                <FaEdit /> 수정 {/* 수정 아이콘과 텍스트 표시 */}
                                            </button>
                                            {/* 삭제 버튼 */}
                                            <button
                                                className="yc_challenge_delete-btn"
                                                onClick={() => handleDeleteClick(notice.id)} // 버튼 클릭 시 삭제 함수 호출
                                                aria-label="공지 삭제" // 접근성을 위한 레이블 설정
                                            >
                                                <FaTrash /> 삭제 {/* 삭제 아이콘과 텍스트 표시 */}
                                            </button>
                                        </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                // 공지사항이 없을 경우 표시
                                <p>공지사항이 없습니다.</p>
                            )}
                        </div>
                    </section>
                </div>
                
                {/* 삭제 확인 모달 */}
                {showDeleteModal && (
                    <div className="yc_modal-overlay-board">
                        <div className="yc_modal-board">
                            <p>삭제 하시겠습니까?</p> {/* 모달 메시지 */}
                            <div className="yc_modal-buttons-board">
                                {/* 삭제 확인 버튼 */}
                                <button className="yc_modal-confirm-board" onClick={handleConfirmDelete}>확인</button>
                                {/* 삭제 취소 버튼 */}
                                <button className="yc_modal-cancel-board" onClick={handleCancelDelete}>취소</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        {/* 채팅룸 컴포넌트 렌더링 */}
        <ChatRoom/>

        {/* 푸터 컴포넌트 렌더링 */}
        <Footert/>
        {/* 푸터 끝 */}
        </>
    );

};

export default YcChallengeBoard; // 컴포넌트 내보내기
