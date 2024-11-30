//import 라이브러리
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../../css/reset.css';
import '../admincss/adminUsers.css';
import AdminLayout from '../adminpages/AdminLayout'; // 공통 레이아웃 임포트
import Header from '../../pages/include/DH_Header.jsx';
import Footer from '../../pages/include/JM-Footer.jsx';
const AdminUsers = () => {

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/
    const [unionList, setUnionList] = useState([]);

    const navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 추가
    const authUser = JSON.parse(localStorage.getItem('authUser'));  // authUser 정보 가져오기

    // 관리자인지 확인하여 관리자 아닌 경우 리다이렉트
    useEffect(() => {
        // if (!authUser || authUser.userStatus !== '관리자') {
        //     // alert("관리자만 접근할 수 있습니다.");
        //     navigate("/");  // 메인 페이지로 리다이렉트
        // }
    }, [authUser, navigate]);

    

    /*---일반 메소드 -----------------------------*/
    const getUnionList = () => {
        axios({
            method: 'get', // put, post, delete                   
            url: `${process.env.REACT_APP_API_URL}/api/admin/userlist`,
            responseType: 'json' // 수신타입
        }).then(response => {
            console.log(response.data); // 수신데이터
            setUnionList(response.data.apiData);
        }).catch(error => {
            console.log(error);
        });
    };

    /*---훅(useEffect)메소드-------*/
    useEffect(() => {
        console.log("마운트 됐어요");
        getUnionList(); // 서버에서 데이터 가져오기
    }, []);
    /*---훅(useEffect)+이벤트(handle)메소드-------*/
    
    
    const changeUserStatus = (userNum, newStatus) => {
        return axios.put(`${process.env.REACT_APP_API_URL}/api/admin/user-status`, {
            userNum,
            newStatus
        })
        .then(response => {
            if (response.data.result === 'success') {
                alert('유저 상태가 성공적으로 변경되었습니다.');
            } else {
                alert('유저 상태 변경에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('유저 상태 변경 중 오류 발생:', error);
        });
    };
    

    
    return (
        <>
            <AdminLayout>

                    {/* 매장 리스트관련 내용 */}
                    <div id="user_area">
                        <div id="user_list" >
                            <h2>유저 관리</h2>
                            {/* 반복 구간 */}
                            {unionList.map((union) => {
                                    return (
                                        <div id="user_item" className="clearfix"  key={union.userNum}>
                                            <div className="hjy_user_info">
                                                <p><strong>이름:  </strong>   {union.userName}</p>
                                                <p><strong>지역:    </strong>   {union.regionName}</p>
                                                <p><strong>가입일:  </strong>   {union.joinDate}</p>
                                                <p><strong>소셜가입:  </strong>   {union.socialLogin}</p>
                                            </div>
                                            <div className="hjy_modify_btn">
                                                <button type="button"><Link to={`/admin/user/modify?userNum=${union.userNum}`} rel="noreferrer noopener">수정</Link></button>
                                            </div>
                                            
                                        </div>
                                    );
                                })}

                                <br />
                                {/* axios part */}

                            
                        </div>
                        {/* //user_list */}

                    </div>
                    {/* user_area */}

                
                </AdminLayout>
        </>
    );
}
export default AdminUsers;