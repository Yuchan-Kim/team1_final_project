import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
    BarChart, Bar,
    AreaChart, Area,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// css
import '../../css/reset.css';
import '../admincss/adminMain.css';

const AdminMain = () => {
    const navigate = useNavigate();
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    // 관리자인지 확인하여 관리자 아닌 경우 리다이렉트
    // useEffect(() => {
    //     if (!authUser || authUser.userStatus !== '관리자') {
    //         alert("관리자만 접근할 수 있습니다.");
    //         navigate("/");
    //     }
    // }, [authUser, navigate]);

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
        axios.get('/api/admin/user-registrations')
            .then(response => setUserData(response.data))
            .catch(error => console.error("사용자 등록 추이 데이터를 가져오는 중 오류 발생:", error));

        // 판매 데이터 가져오기
        axios.get('/api/admin/sales')
            .then(response => setSalesData(response.data))
            .catch(error => console.error("판매 데이터를 가져오는 중 오류 발생:", error));

        // 카테고리 분포 데이터 가져오기
        axios.get('/api/admin/category-distribution')
            .then(response => setCategoryData(response.data))
            .catch(error => console.error("카테고리 분포 데이터를 가져오는 중 오류 발생:", error));

        // 지역별 판매 데이터 가져오기
        axios.get('/api/admin/sales-by-region')
            .then(response => setAreaData(response.data))
            .catch(error => console.error("지역별 판매 데이터를 가져오는 중 오류 발생:", error));

        // 레이더 차트 데이터 가져오기
        axios.get('/api/admin/category-performance')
            .then(response => setRadarData(response.data))
            .catch(error => console.error("카테고리 퍼포먼스 데이터를 가져오는 중 오류 발생:", error));

        // 상세 사용자 데이터 가져오기
        axios.get('/api/admin/user-details')
            .then(response => setDetailedData(response.data))
            .catch(error => console.error("사용자 상세 데이터를 가져오는 중 오류 발생:", error));

        // 최근 활동 데이터 가져오기
        axios.get('/api/admin/recent-activities')
            .then(response => setRecentActivities(response.data))
            .catch(error => console.error("최근 활동 데이터를 가져오는 중 오류 발생:", error));

        // 주요 통계 데이터 가져오기
        axios.get('/api/admin/key-stats')
            .then(response => setKeyStats(response.data))
            .catch(error => console.error("주요 통계 데이터를 가져오는 중 오류 발생:", error));

    }, []);

    // 도넛 그래프 색상
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

    return (
        <>
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
                                            dataKey="value"
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

                            {/* 지역별 판매 내역 (에어리어 차트) */}
                            <div className="hjy-list-section">
                                <div className="hjy-list-header">
                                    <h3>지역별 판매 내역</h3>
                                    <Link to="/admin/sales-by-region" rel="noreferrer noopener">더보기</Link>
                                </div>
                                <div className="hjy-list-status">
                                    <AreaChart width={400} height={200} data={areaData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="region" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                </div>
                            </div>

                            {/* 레이더 차트 */}
                            <div className="hjy-list-section">
                                <div className="hjy-list-header">
                                    <h3>카테고리별 퍼포먼스</h3>
                                    <Link to="/admin/category-performance" rel="noreferrer noopener">더보기</Link>
                                </div>
                                <div className="hjy-list-status">
                                    <RadarChart outerRadius={90} width={400} height={250} data={radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                                        <Radar name="A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        <Radar name="B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                        <Legend />
                                    </RadarChart>
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
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.status}</td>
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
                                        {recentActivities.map((activity, index) => (
                                            <li key={index}>{activity}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* 추가적인 섹션이 필요하면 여기에 추가 */}
                        </div>
                        {/* //admin_main */}
                    </div>
                </div>
                </div>
            </>
        );
    };

    export default AdminMain;
