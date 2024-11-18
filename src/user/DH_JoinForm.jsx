//import 라이브러리
import React, {useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { useSearchParams} from 'react-router-dom';   파라미터값사용하는 라우터

//import 컴포넌트
import Header from '../pages/include/DH_Header';

//import css
import '../css/dh_joinform.css';


const DH_JoinForm = () => {

   /*---일반 변수 --------------------------------------------*/

   /*---라우터 관련------------------------------------------*/

   /*---상태관리 변수들(값이 변화면 화면 랜더링) ----------*/
    const [userEmail, setUserEmail] = useState("");
    const [isEmail, setIsEmail] = useState(false);    // fakse는 중복아님
    const [isEmailAvailable, setIsEmailAvailable] = useState(true); // 이메일 중복 여부
    const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 체크 여부

    const [userName, setUserName] = useState("");
    const [isName, setIsName] = useState(false);    // fakse는 중복아님
    const [isNameAvailable, setIsNameAvailable] = useState(true); // 닉네임 중복 여부
    const [isNameChecked, setIsNameChecked] = useState(false); // 닉네임 중복 체크 여부

    const [userPw, setUserPw] = useState("");
    const [userPw2, setUserPw2] = useState("");
    const [pwMatch, setPwMatch] = useState(true); // 비밀번호 일치 여부 상태 추가 true 일치
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#&*?]).{10,}$/;
    const [isPwValid, setIsPwValid] = useState(true);   // 비밀번호 조건에 맞는지 true 부합

    const navigate = useNavigate();

   /*---일반 메소드 -----------------------------------------*/

   /*---생명주기 + 이벤트 관련 메소드 ----------------------*/
    // 이메일
    const handleEmail =(e)=> {
        setUserEmail(e.target.value);
    }

    // 비밀번호
    const handlePw =(e)=> {
        setUserPw(e.target.value);
        checkPw(e.target.value, userPw2)    // 일치여부 체크

        // 비밀번호 유효성 검사
        const isValid = pwRegex.test(e.target.value);
        setIsPwValid(isValid); // 상태 업데이트
    }
    // 비밀번호2
    const handlePw2 =(e)=> {
        setUserPw2(e.target.value);
        checkPw(userPw, e.target.value)    // 일치여부 체크
    }
    // 비밀번호 일치 여부 체크
    const checkPw = (userPw, setUserPw2) => {
        setPwMatch(userPw === setUserPw2);
    };

    // 이름
    const handleName =(e)=> {
        setUserName(e.target.value);
    }
    

    // 이메일 중복체크 클릭했을때
    const handleEmailCheck = ()=> {

        const userVo= {
            userEmail: userEmail
        }
        console.log(userVo);

         // 서버로 데이터 전송
        axios({
            method: 'post',         // 저장 (등록)
            url: `${process.env.REACT_APP_API_URL}/api/users/email/${userEmail}`,

            headers: { "Content-Type": "application/json; charset=utf-8" },    // post put 보낼때

            data: userVo, // put, post, JSON(자동변환됨)

            responseType: 'json' //수신타입 받을때
        }).then(response => {
            console.log(response.data); //수신데이타

            if (response.data.result ==='success') {
                setIsEmailAvailable(true); // 사용 가능
                setIsEmail('사용 가능한 이메일입니다.'); // 중복 아님
                setIsEmailChecked(true); // 이메일 중복 체크 완료
            
            }else {
                setIsEmailAvailable(false); // 중복됨
                setIsEmail('이미 가입된 이메일입니다.'); // 중복됨
            }

        }).catch(error => {
            console.log(error);
        });

    }

    // 닉네임 중복체크 클릭했을때
    const handleNameCheck = ()=> {

        const userVo= {
            userName: userName
        }
        console.log(userVo);

         // 서버로 데이터 전송
        axios({
            method: 'post',         // 저장 (등록)
            url: `${process.env.REACT_APP_API_URL}/api/users/name/${userName}`,

            headers: { "Content-Type": "application/json; charset=utf-8" },    // post put 보낼때

            data: userVo, // put, post, JSON(자동변환됨)

            responseType: 'json' //수신타입 받을때
        }).then(response => {
            console.log(response.data); //수신데이타

            if (response.data.result ==='success') {
                setIsNameAvailable(true); // 사용 가능
                setIsName('사용 가능한 닉네임입니다.'); // 중복 아님
                setIsNameChecked(true); // 닉네임 중복 체크 완료
            
            }else {
                setIsNameAvailable(false); // 중복됨
                setIsName('이미 가입된 닉네임입니다.'); // 중복됨
            }

        }).catch(error => {
            console.log(error);
        });

    }


    // 회원가입버튼 클릭했을때
    const handleJoin = (e)=> {
        e.preventDefault(); 

        // 비밀번호 유효성 검사
        if (!pwRegex.test(userPw)) {
            alert("비밀번호가 조건에 부합하지 않습니다. 조건을 확인하세요.");
            return;
        }

        // 이메일, 닉네임 중복 체크 여부 확인
        if (!isEmailChecked || !isNameChecked) {
            alert("이메일 또는 닉네임의 중복 체크를 완료해주세요.");
            return;
        }

        // 이메일, 닉네임 중복 체크
        if (!isEmailAvailable || !isNameAvailable) {
            alert("이메일 또는 닉네임이 이미 존재합니다.");
            return;
        }

        const userVo= {
            userEmail: userEmail,
            userPw: userPw,
            userName: userName
        }
        console.log(userVo);

        // 서버로 데이터 전송
        axios({
            method: 'post',         // 저장 (등록)
            url: `${process.env.REACT_APP_API_URL}/api/users`,

            headers: { "Content-Type": "application/json; charset=utf-8" },    

            data: userVo, // put, post, JSON(자동변환됨)

            responseType: 'json' //수신타입 받을때
        }).then(response => {
            console.log(response.data); //수신데이타

            if (response.data.result ==='success') {
                // 리다이렉트
                navigate("/user/loginform");
            
            }else {
                alert("회원등록실패");
            }

        }).catch(error => {
            console.log(error);
        });

    }


    return (
        <>
            <Header />
            {/* // header */}

         <div className="wrap">
                <div className="dy-joinform">
                    <h1 className="dy-joinTitle">가입하고 원하는 콘텐츠를 즐기세요</h1>

                    <div className="dy-joinform-content">
                        <form action='' method='' onSubmit={handleJoin}> 
                            <div className="dy-joinform-join">
                                <div className="dy-join-word">이메일</div>
                                <div className="dy-join-two">
                                    <input type="text" className="dy-join-input" value={userEmail} onChange={handleEmail} />
                                    <button type="button" className="dy-emailcheck" onClick={handleEmailCheck}>중복체크</button> 
                                </div>
                                {isEmail && (
                                    <div className="dy-message">&nbsp; &#8226; {isEmail}</div>
                                )}
                            </div>
                            <div className="dy-joinform-join">
                                <div className="dy-join-word">닉네임</div>
                                <div className="dy-join-two">
                                    <input type="text" className="dy-join-input" value={userName} onChange={handleName}></input>
                                    <button type="button" className="dy-namecheck" onClick={handleNameCheck}>중복체크</button> 
                                </div>
                                {isName && (
                                    <div className="dy-message">&nbsp; &#8226; {isName}</div>
                                )}
                            </div>
                            <div className="dy-joinform-join">
                                <div className="dy-join-word">비밀번호</div>
                                <input type="password" className="dy-join-input" value={userPw} onChange={handlePw} />
                                {!isPwValid && (
                                    <div className="dy-message">
                                        <div>비밀번호에는 다음 문자가 반드시 포함되어야 합니다.</div>
                                        <ol>
                                            <li>&nbsp; &#8226; &nbsp; 문자 1개</li>
                                            <li>&nbsp; &#8226; &nbsp; 숫자 또는 특수 문자 1개 (예: # ? ! &)</li>
                                            <li>&nbsp; &#8226; &nbsp; 10자 이상</li>
                                        </ol>
                                    </div>
                                )}
                            </div>
                            <div className="dy-joinform-join">
                                <div className="dy-join-word">비밀번호 재입력</div>
                                <input type="password" className="dy-join-input" value={userPw2} onChange={handlePw2} />
                                {!pwMatch && userPw2 && (
                                    <div className="dy-message">&nbsp; &#8226; 비밀번호가 일치하지 않습니다.</div>
                                )}
                                {pwMatch && userPw2 && (
                                    <div></div>
                                )}
                            </div>
                            

                            <button type="submit" className="dy-submit-btn">가입하기</button>
                            <div>─────────── 또는 ───────────</div>

                            <div className="dy-api-joins">
                                <div className="dy-api-join">카카오로 계속하기</div>
                                <div className="dy-api-join">Google로 계속하기</div>
                                <div className="dy-api-join">네이버로 계속하기</div>
                            </div>

                            <div className="dy-to-loginform"><Link to="/user/loginform" className="dy-link" rel="noreferrer noopener">이미 계정이 있나요? 여기에서 로그인하세요</Link></div>
                        </form>
                    </div>
                    {/* /dy-joinform-content */}
                </div>
                {/* /dy-joinform */}
            </div>
            {/* /wrap */}
        </>
    );
}

export default DH_JoinForm;