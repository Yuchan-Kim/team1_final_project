import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
    BarChart, Bar,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

import Header from '../../pages/include/DH_Header.jsx';
import Footer from '../../pages/include/JM-Footer.jsx';
// css
import '../../css/reset.css';
import '../admincss/adminMain.css';

const AdminMain = () => {
    const navigate = useNavigate();
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    // 관리자인지 확인하여 관리자 아닌 경우 리다이렉트
    useEffect(() => {
        // if (!authUser || authUser.userStatus !== '관리자') {
        //     alert("관리자만 접근할 수 있습니다.");
        //     navigate("/");
        // }
    }, [authUser, navigate]);

    // 상태 관리
    const [userData, setUserData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [areaData, setAreaData] = useState([]);
    const [radarData, setRadarData] = useState([]);
    const [detailedData, setDetailedData] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [keyStats, setKeyStats] = useState({
        totalUsers: 0,
        totalSales: 0,
        totalOrders: 0,
    });

    // 데이터 로드 (API 호출 예시)
    useEffect(() => {
        // 사용자 등록 추이 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/signupusersrate`)
            .then(response => {
                if (response.data.status === 'success') {
                    const rawData = response.data.data;
                    // joinDate를 월 단위로 변환
                    const formattedData = rawData.map(item => ({
                        month: item.month, // 이미 쿼리에서 월 형식으로 변환
                        users: item.userCount
                    }));
                    setUserData(formattedData);
                } else {
                    console.error("사용자 등록 추이 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("사용자 등록 추이 데이터를 가져오는 중 오류 발생:", error);
            });
        
        // 모든 유저 목록 가져오기 (테이블용)
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/userlist`)
            .then(response => {
                if (response.data.status === 'success') {
                    setDetailedData(response.data.data);
                } else {
                    console.error("유저 목록을 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("유저 목록을 가져오는 중 오류 발생:", error);
            });

        // 판매 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/sales`)
            .then(response => {
                if (response.data.status === 'success') {
                    setSalesData(response.data.data);
                } else {
                    console.error("판매 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("판매 데이터를 가져오는 중 오류 발생:", error);
            });

        // 카테고리 분포 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/category-distribution`)
            .then(response => {
                if (response.data.status === 'success') {
                    setCategoryData(response.data.data);
                } else {
                    console.error("카테고리 분포 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("카테고리 분포 데이터를 가져오는 중 오류 발생:", error);
            });

        // 레이더 차트 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/category-performance`)
            .then(response => {
                if (response.data.status === 'success') {
                    setRadarData(response.data.data);
                } else {
                    console.error("카테고리 퍼포먼스 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("카테고리 퍼포먼스 데이터를 가져오는 중 오류 발생:", error);
            });

        // 최근 활동 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/recent-activities`)
            .then(response => {
                if (response.data.status === 'success') {
                    const rawData = response.data.data;
                    console.log('recentActivities data:', rawData); // 디버깅 로그
                    setRecentActivities(rawData);
                } else {
                    console.error("최근 활동 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("최근 활동 데이터를 가져오는 중 오류 발생:", error);
            });

        // 주요 통계 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/key-stats`)
            .then(response => {
                if (response.data.status === 'success') {
                    setKeyStats(response.data.data);
                } else {
                    console.error("주요 통계 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("주요 통계 데이터를 가져오는 중 오류 발생:", error);
            });

    }, []);

    // 도넛 그래프 색상
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

    return (
        <div>
            <Header/>
            <div id="admin-wrap">
                {/* 컨텐츠 */}
                <div id="contents" className="clearfix">
                    {/* aside */}
                    <div id="asides-admin">
                        <h2><Link to="/admin/main" rel="noreferrer noopener">관리자 페이지</Link></h2>
                        <div id="sub_list">
                            <ul className='lists'>
                                <li><Link to="/admin/user" rel="noreferrer noopener">유저 관리</Link></li>
                                <li><Link to="/admin/point" rel="noreferrer noopener">포인트 상품 관리</Link></li>
                                <li><Link to="/admin/delivery" rel="noreferrer noopener">챌린지 관리</Link></li>
                                <li><Link to="/admin/history" rel="noreferrer noopener">신고 관리</Link></li>
                            </ul>
                        </div>
                    </div>
                    {/* //aside */}
                    {/* admin_main */}
                    <div id="admin_main">
                        <div className="hjy-grid-container">
                            {/* KPI 카드 섹션 */}
                            <div className="kpi-section">
                                <div className="kpi-card">
                                    <h4>총 사용자 수</h4>
                                    <p>{keyStats.totalUsers.toLocaleString()}명</p>
                                </div>
                                <div className="kpi-card">
                                    <h4>총 판매 금액</h4>
                                    <p>₩{keyStats.totalSales.toLocaleString()}</p>
                                </div>
                                <div className="kpi-card">
                                    <h4>총 주문 수</h4>
                                    <p>{keyStats.totalOrders.toLocaleString()}건</p>
                                </div>
                            </div>

                            {/* 사용자 등록 추이 (라인 차트) */}
                            <div className="hjy-list-section">
                                <div className="hjy-list-header">
                                    <h3>사용자 등록 추이</h3>
                                    <Link to="/admin/user" rel="noreferrer noopener">더보기</Link>
                                </div>
                                <div className="hjy-list-status">
                                    <LineChart width={400} height={200} data={userData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </div>
                            </div>

                            {/* 월별 판매 내역 (바 차트) */}
                            <div className="hjy-list-section">
                                <div className="hjy-list-header">
                                    <h3>월별 판매 내역</h3>
                                    <Link to="/admin/history" rel="noreferrer noopener">더보기</Link>
                                </div>
                                <div className="hjy-list-status">
                                    <BarChart width={400} height={200} data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="sales" fill="#82ca9d" />
                                    </BarChart>
                                </div>
                            </div>

                            {/* 카테고리 분포 (도넛 차트) */}
                            <div className="hjy-list-section">
                                <div className="hjy-list-header">
                                    <h3>카테고리 분포</h3>
                                    <Link to="/admin/category" rel="noreferrer noopener">더보기</Link>
                                </div>
                                <div className="hjy-list-status">
                                    <PieChart width={400} height={200}>
                                        <Pie
                                            data={categoryData}
                                            cx={200}
                                            cy={100}
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="roomCount" // 데이터 키 수정
                                            label
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </div>
                            </div>

                            {/* 데이터 테이블 섹션 */}
                            <div className="hjy-list-section">
                                <div className="hjy-list-header">
                                    <h3>사용자 상세 정보</h3>
                                    <Link to="/admin/user-details" rel="noreferrer noopener">더보기</Link>
                                </div>
                                <div className="hjy-list-status">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>이름</th>
                                                <th>이메일</th>
                                                <th>상태</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {detailedData.map(user => (
                                                <tr key={user.userNum}>
                                                    <td>{user.userNum}</td>
                                                    <td>{user.userName}</td>
                                                    <td>{user.userEmail}</td>
                                                    <td>{user.userStatus === 1 ? '활동중' : '비활동중'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 최근 활동 섹션 추가 */}
                            <div className="hjy-list-section">
                                <div className="hjy-list-header">
                                    <h3>최근 활동</h3>
                                    <Link to="/admin/recent-activity" rel="noreferrer noopener">더보기</Link>
                                </div>
                                <div className="hjy-list-status">
                                    <ul className="recent-activities">
                                        {Array.isArray(recentActivities) && recentActivities.length > 0 ? (
                                            recentActivities.map((activity, index) => (
                                                <li key={index}>
                                                    {activity.userName} 님이 {activity.itemName}을(를) {new Date(activity.purchasedDate).toLocaleDateString()}에 구매하셨습니다.
                                                </li>
                                            ))
                                        ) : (
                                            <li>최근 활동이 없습니다.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* 추가적인 섹션이 필요하면 여기에 추가 */}
                        </div>
                        {/* //admin_main */}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );

    export default AdminMain;
};
