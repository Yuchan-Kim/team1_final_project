// AdminDataManagement.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../adminpages/AdminLayout.jsx'; // 공통 레이아웃 임포트
import '../admincss/adminDataManagement.css'; // 데이터 관리 페이지용 CSS

const AdminDataManagement = () => {
    const tables = [
        { name: 'categories', displayName: '카테고리' },
        { name: 'roomType', displayName: '방 타입' },
        { name: 'period', displayName: '기간' },
        { name: 'regions', displayName: '지역' },
        { name: 'missionType', displayName: '미션 타입' },
        { name: 'pointPurpose', displayName: '포인트 목적' },
    ];

    const [selectedTable, setSelectedTable] = useState(tables[0].name);
    const [tableData, setTableData] = useState([]);
    const [newEntry, setNewEntry] = useState({});
    const [editingEntry, setEditingEntry] = useState(null);

    useEffect(() => {
        fetchTableData(selectedTable);
    }, [selectedTable]);

    const fetchTableData = (tableName) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/${tableName}`)
            .then(response => {
                if (response.data.result === 'success') {
                    setTableData(response.data.apiData);
                } else {
                    console.error(`${tableName} 데이터를 가져오는 중 오류 발생:`, response.data.message);
                }
            })
            .catch(error => {
                console.error(`${tableName} 데이터를 가져오는 중 오류 발생:`, error);
            });
    };

    const handleAddEntry = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/admin/${selectedTable}`, newEntry)
            .then(response => {
                if (response.data.result === 'success') {
                    fetchTableData(selectedTable);
                    setNewEntry({});
                } else {
                    console.error('데이터 추가 중 오류 발생:', response.data.message);
                }
            })
            .catch(error => {
                console.error('데이터 추가 중 오류 발생:', error);
            });
    };

    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
    };

    const handleUpdateEntry = () => {
        axios.put(`${process.env.REACT_APP_API_URL}/api/admin/${selectedTable}/${editingEntry.id}`, editingEntry)
            .then(response => {
                if (response.data.result === 'success') {
                    fetchTableData(selectedTable);
                    setEditingEntry(null);
                } else {
                    console.error('데이터 수정 중 오류 발생:', response.data.message);
                }
            })
            .catch(error => {
                console.error('데이터 수정 중 오류 발생:', error);
            });
    };

    const handleDeleteEntry = (id) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/${selectedTable}/${id}`)
                .then(response => {
                    if (response.data.result === 'success') {
                        fetchTableData(selectedTable);
                    } else {
                        console.error('데이터 삭제 중 오류 발생:', response.data.message);
                    }
                })
                .catch(error => {
                    console.error('데이터 삭제 중 오류 발생:', error);
                });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingEntry) {
            setEditingEntry({ ...editingEntry, [name]: value });
        } else {
            setNewEntry({ ...newEntry, [name]: value });
        }
    };

    return (
        <AdminLayout>
            <div className="admin-data-management">
                <h2>데이터 관리</h2>
                <div className="table-selector">
                    {tables.map((table) => (
                        <button
                            key={table.name}
                            className={selectedTable === table.name ? 'active' : ''}
                            onClick={() => setSelectedTable(table.name)}
                        >
                            {table.displayName}
                        </button>
                    ))}
                </div>
                <div className="table-operations">
                    <h3>{tables.find(t => t.name === selectedTable).displayName} 테이블</h3>
                    <table>
                        <thead>
                            <tr>
                                {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                ))}
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((entry) => (
                                <tr key={entry.id || entry[Object.keys(entry)[0]]}>
                                    {Object.keys(entry).map((key) => (
                                        <td key={key}>
                                            {editingEntry && editingEntry.id === entry.id ? (
                                                <input
                                                    name={key}
                                                    value={editingEntry[key]}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                entry[key]
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        {editingEntry && editingEntry.id === entry.id ? (
                                            <>
                                                <button onClick={handleUpdateEntry}>저장</button>
                                                <button onClick={() => setEditingEntry(null)}>취소</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditEntry(entry)}>수정</button>
                                                <button onClick={() => handleDeleteEntry(entry.id)}>삭제</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {/* 새 항목 추가 폼 */}
                            <tr>
                                {tableData.length > 0 && Object.keys(tableData[0]).map((key) => (
                                    <td key={key}>
                                        <input
                                            name={key}
                                            value={newEntry[key] || ''}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                ))}
                                <td>
                                    <button onClick={handleAddEntry}>추가</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDataManagement;
