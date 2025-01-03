// AdminLayout.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../pages/include/DH_Header.jsx';
import Footer from '../../pages/include/JM-Footer.jsx';
import '../../css/reset.css';
import '../admincss/adminLayout.css'; // 공통 레이아웃 CSS

const AdminLayout = ({ children }) => {
    return (
        <>
            <Header />
            <div id="yc-admin-wrap">
                {/* 사이드바 */} 
                <aside id="yc-asides-admin">
                    <h2><Link to="/admin/main" rel="noreferrer noopener">관리자 페이지</Link></h2>
                    <div id="yc-sub_list">
                        <ul className='yc-lists'>
                        <li><Link to="/admin/user" rel="noreferrer noopener">유저 관리</Link></li>
                            <li><Link to="/admin/viewitems" rel="noreferrer noopener">포인트 상품 관리</Link></li>
                            <li><Link to="/admin/datamanagement" rel="noreferrer noopener">데이터 관리</Link></li> 
                            <li><Link to="/admin/notifications" rel="noreferrer noopener">알림 발송</Link></li> 
                        </ul>
                    </div>
                </aside>
                {/* 메인 컨텐츠 */}
                <main id="yc-admin_main">
                    {children}
                </main>
            </div>
            <Footer />
        </>
    );
};

export default AdminLayout;
