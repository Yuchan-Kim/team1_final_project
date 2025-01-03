// src/components/AdminMain.jsx

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell,
    BarChart, Bar
} from 'recharts';

import AdminLayout from '../adminpages/AdminLayout.jsx'; // 공통 레이아웃 임포트
import '../admincss/adminMain.css'; // 업데이트된 AdminMain CSS

const AdminMain = () => {
    // 상태 관리
    const [userData, setUserData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
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
                if (response.data.result === 'success') {
                    const rawData = response.data.apiData;
                    // joinDate를 월 단위로 변환
                    const formattedData = rawData.map(item => ({
                        month: item.joinDate, // 'joinDate'로 수정
                        users: item.userCount
                    }));
                    console.log('Signup Users Rate Data:', formattedData); // 추가된 로그
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
                if (response.data.result === 'success') {
                    console.log('User List Data:', response.data.apiData); // 추가된 로그
                    setDetailedData(response.data.apiData);
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
                if (response.data.result === 'success') {
                    const salesData = response.data.apiData;
                    console.log('Sales Data:', salesData); // 추가된 로그
                    setSalesData(salesData);
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
                if (response.data.result === 'success') {
                    const categoryData = response.data.apiData;
                    console.log('Category Distribution Data:', categoryData); // 추가된 로그
                    setCategoryData(categoryData);
                } else {
                    console.error("카테고리 분포 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("카테고리 분포 데이터를 가져오는 중 오류 발생:", error);
            });

        // 카테고리 퍼포먼스 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/category-performance`)
            .then(response => {
                if (response.data.result === 'success') {
                    const radarData = response.data.apiData;
                    console.log('Category Performance Data:', radarData); // 추가된 로그
                    setRadarData(radarData);
                } else {
                    console.error("카테고리 퍼포먼스 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("카테고리 퍼포먼스 데이터를 가져오는 중 오류 발생:", error);
            });

        // 최근 구매 활동 데이터 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/recent-activities`)
            .then(response => {
                if (response.data.result === 'success') {
                    const rawData = response.data.apiData;
                    console.log('Recent Activities Data:', rawData); // 추가된 로그
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
                if (response.data.result === 'success') {
                    console.log('Key Stats Data:', response.data.apiData); // 추가된 로그
                    setKeyStats(response.data.apiData);
                } else {
                    console.error("주요 통계 데이터를 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("주요 통계 데이터를 가져오는 중 오류 발생:", error);
            });

    }, []);

    // 도넛 그래프 색상
    const COLORS = ['#1a73e8', '#34a853', '#fbbc05', '#ea4335', '#6a1b9a'];

    return (
        <>
        <AdminLayout>
            <div className="yc-add-item-container">
                {/* KPI 카드 섹션 */}
                {keyStats && (keyStats.totalUsers || keyStats.totalSales || keyStats.totalOrders) && (
                    <div className="yc-kpi-section">
                        <div className="yc-kpi-card">
                            <h4>총 사용자 수</h4>
                            <p>{keyStats.totalUsers.toLocaleString()}명</p>
                        </div>
                        <div className="yc-kpi-card">
                            <h4>총 판매 금액</h4>
                            <p>₩{keyStats.totalSales.toLocaleString()}</p>
                        </div>
                        <div className="yc-kpi-card">
                            <h4>총 주문 수</h4>
                            <p>{keyStats.totalOrders.toLocaleString()}건</p>
                        </div>
                    </div>
                )}

                {/* 사용자 등록 추이 (라인 차트) */}
                <div className="yc-hjy-list-section">
                    <div className="yc-hjy-list-header">
                        <h3>사용자 등록 추이</h3>
                        <Link to="/admin/user" rel="noreferrer noopener">더보기</Link>
                    </div>
                    <div className="yc-hjy-list-status">
                        {userData.length > 0 ? (
                            <LineChart width={600} height={300} data={userData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#1a73e8" activeDot={{ r: 8 }} />
                            </LineChart>
                        ) : (
                            <p>데이터가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 월별 판매 내역 (바 차트) */}
                <div className="yc-hjy-list-section">
                    <div className="yc-hjy-list-header">
                        <h3>월별 판매 내역</h3>
                        <Link to="/admin/history" rel="noreferrer noopener">더보기</Link>
                    </div>
                    <div className="yc-hjy-list-status">
                        {salesData.length > 0 ? (
                            <BarChart width={600} height={300} data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#1a73e8" />
                            </BarChart>
                        ) : (
                            <p>데이터가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 카테고리 분포 (도넛 차트) */}
                <div className="yc-hjy-list-section">
                    <div className="yc-hjy-list-header">
                        <h3>카테고리 분포</h3>
                        <Link to="/admin/category" rel="noreferrer noopener">더보기</Link>
                    </div>
                    <div className="yc-hjy-list-status">
                        {categoryData.length > 0 ? (
                            <PieChart width={600} height={300}>
                                <Pie
                                    data={categoryData}
                                    cx={300}
                                    cy={150}
                                    innerRadius={80}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    nameKey="categoryName"
                                    dataKey="roomCount"
                                    label
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        ) : (
                            <p>데이터가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 데이터 테이블 섹션 */}
                <div className="yc-hjy-list-section">
                    <div className="yc-hjy-list-header">
                        <h3>사용자 상세 정보</h3>
                        <Link to="/admin/user-details" rel="noreferrer noopener">더보기</Link>
                    </div>
                    <div className="yc-hjy-list-status">
                        {detailedData.length > 0 ? (
                            <table className="yc-data-table">
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
                        ) : (
                            <p>데이터가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 최근 활동 섹션 추가 */}
                <div className="yc-hjy-list-section">
                    <div className="yc-hjy-list-header">
                        <h3>최근 활동</h3>
                        <Link to="/admin/recent-activity" rel="noreferrer noopener">더보기</Link>
                    </div>
                    <div className="yc-hjy-list-status">
                        {recentActivities.length > 0 ? (
                            <ul className="yc-recent-activities">
                                {recentActivities.map((activity, index) => (
                                    <li key={index}>
                                        {activity.userName} 님이 {activity.itemName}을(를) {new Date(activity.purchasedDate).toLocaleDateString()}에 구매하셨습니다.
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>최근 활동이 없습니다.</p>
                        )}
                    </div>
                </div>
                </div>

                </AdminLayout>
            </>
        );

};

export default AdminMain;
