// AdminNotification.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../adminpages/AdminLayout.jsx'; // 공통 레이아웃 임포트
import '../admincss/adminNotification.css'; // 알림 페이지용 CSS

const AdminNotification = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [sendToAll, setSendToAll] = useState(false);

    useEffect(() => {
        // 유저 목록 가져오기
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/userlist`)
            .then(response => {
                if (response.data.result === 'success') {
                    setUsers(response.data.apiData);
                } else {
                    console.error("유저 목록을 가져오는 중 오류 발생:", response.data.message);
                }
            })
            .catch(error => {
                console.error("유저 목록을 가져오는 중 오류 발생:", error);
            });
    }, []);

    const handleUserSelection = (userNum) => {
        if (selectedUsers.includes(userNum)) {
            setSelectedUsers(selectedUsers.filter(num => num !== userNum));
        } else {
            setSelectedUsers([...selectedUsers, userNum]);
        }
    };

    const handleSendNotification = () => {
        const payload = {
            noticeTitle: title,    // 'noticeTitle'으로 변경
            noticeMsg: message,    // 'noticeMsg'으로 변경
            userNums: sendToAll ? 'all' : selectedUsers,
        };
        

        axios.post(`${process.env.REACT_APP_API_URL}/api/admin/send-notification`, payload)
            .then(response => {
                if (response.data.result === 'success') {
                    alert('알림이 발송되었습니다.');
                    // 초기화
                    setTitle('');
                    setMessage('');
                    setSelectedUsers([]);
                    setSendToAll(false);
                } else {
                    console.error('알림 발송 중 오류 발생:', response.data.message);
                }
            }) 
            .catch(error => {
                console.error('알림 발송 중 오류 발생:', error);
            });
    };

    return (
        <AdminLayout>
            <div className="admin-notification">
                <h2>알림 발송</h2>
                <div className="notification-form">
                    <label>
                        <input
                            type="checkbox"
                            checked={sendToAll}
                            onChange={() => setSendToAll(!sendToAll)}
                        />
                        전체 유저에게 발송
                    </label>
                    {!sendToAll && (
                        <div className="user-selection">
                            <h3>유저 선택</h3>
                            <ul>
                                {users.map(user => (
                                    <li key={user.userNum}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.userNum)}
                                                onChange={() => handleUserSelection(user.userNum)}
                                            />
                                            {user.userName} ({user.userEmail})
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="message-input">
                        <label>
                            제목:
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            내용:
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </label>
                    </div>
                    <button onClick={handleSendNotification}>알림 발송</button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminNotification;
