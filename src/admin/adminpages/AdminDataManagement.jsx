import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../adminpages/AdminLayout.jsx'; // 공통 레이아웃 임포트
import '../admincss/adminDataManagement.css'; // 데이터 관리 페이지용 CSS

const AdminDataManagement = () => {
    const tables = [
        { name: 'categories', displayName: '카테고리', primaryKey: 'categoryNum', columns: ['categoryNum', 'categoryName'] },
        { name: 'roomType', displayName: '방 타입', primaryKey: 'roomTypeNum', columns: ['roomTypeNum', 'roomTypeName'] },
        { name: 'period', displayName: '기간', primaryKey: 'periodNum', columns: ['periodNum', 'periodType'] },
        { name: 'regions', displayName: '지역', primaryKey: 'regionNum', columns: ['regionNum', 'regionName'] },
        { name: 'missionType', displayName: '미션 타입', primaryKey: 'missionTypeNum', columns: ['missionTypeNum', 'missionType', 'missionPoint'] },
        { name: 'pointPurpose', displayName: '포인트 목적', primaryKey: 'pointPurposeNum', columns: ['pointPurposeNum', 'purposeName'] },
        { name: 'pointHistory', displayName: '포인트 내역', primaryKey: 'historyNum', columns: ['historyNum', 'userNum', 'pointPurposeNum','historyDate', 'historyPoint', 'historyInfo']},
    ];

    const [editingEntryId, setEditingEntryId] = useState(null); // 수정 중인 항목의 primary key
    const [editingEntryData, setEditingEntryData] = useState({}); // 수정 중인 항목의 데이터


    const [selectedTable, setSelectedTable] = useState(tables[0].name);
    const [tableData, setTableData] = useState([]);
    const [newEntry, setNewEntry] = useState({});
    const [editingEntry, setEditingEntry] = useState(null);
    const selectedColumns = tables.find((table) => table.name === selectedTable)?.columns || [];

    useEffect(() => {
        if (selectedTable) {
            fetchTableData(selectedTable);
        }
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

    const TableSelector = ({ tables, selectedTable, onTableSelect }) => (
        <div className="table-selector">
            {tables.map((table) => (
                <button
                    key={table.name}
                    className={selectedTable === table.name ? 'active' : ''}
                    onClick={() => onTableSelect(table.name)}
                >
                    {table.displayName}
                </button>
            ))}
        </div>
    );

    const handleAddEntry = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/admin/${selectedTable}`, newEntry)
            .then(response => {
                if (response.data.result === 'success') {
                    fetchTableData(selectedTable);
                    setNewEntry({}); // 새 항목 추가 후 초기화
                } else {
                    console.error('데이터 추가 중 오류 발생:', response.data.message);
                }
            })
            .catch(error => {
                console.error('데이터 추가 중 오류 발생:', error);
            });
    };
    

    

    const handleEditEntry = (entry) => {
        const primaryKey = tables.find(table => table.name === selectedTable)?.primaryKey;
        if (primaryKey) {
            setEditingEntryId(entry[primaryKey]);
            setEditingEntryData(entry);
        }
    };
    
    
    const handleUpdateEntry = () => {
        axios.put(`${process.env.REACT_APP_API_URL}/api/admin/${selectedTable}/${editingEntryId}`, editingEntryData)
            .then((response) => {
                if (response.data.result === 'success') {
                    fetchTableData(selectedTable);
                    setEditingEntryId(null);
                    setEditingEntryData({});
                } else {
                    console.error('데이터 수정 중 오류 발생:', response.data.message);
                }
            })
            .catch((error) => {
                console.error('데이터 수정 중 오류 발생:', error);
            });
    };
    
    const handleCancelEdit = () => {
        setEditingEntryId(null);
        setEditingEntryData({});
    };
    
    

    const handleDeleteEntry = (primaryKey) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/${selectedTable}/${primaryKey}`)
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
        if (editingEntryId !== null) {
            setEditingEntryData({ ...editingEntryData, [name]: value });
        } else {
            setNewEntry({ ...newEntry, [name]: value });
        }
    };
    
    const handleTableChange = (tableName) => {
        if (selectedTable !== tableName) {
            setTableData([]);
            setNewEntry({});
            setEditingEntry(null); // 수정 상태 초기화
            setSelectedTable(tableName);
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
                        onClick={() => handleTableChange(table.name)}
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
                                {selectedColumns.map((column) => (
                                    <th key={column}>{column}</th>
                                ))}
                                <th>작업</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((entry) => (
                                <tr key={entry.id || entry[selectedColumns[0]]}>
                                    {selectedColumns.map((column) => (
                                        <td key={column}>
                                            {editingEntry === entry[selectedColumns[0]] ? (
                                                <input
                                                    name={column}
                                                    value={entry[column] || ''}
                                                    onChange={(e) =>
                                                        setTableData((prevData) =>
                                                            prevData.map((item) =>
                                                                item[selectedColumns[0]] === editingEntry
                                                                    ? { ...item, [e.target.name]: e.target.value }
                                                                    : item
                                                            )
                                                        )
                                                    }
                                                />
                                            ) : (
                                                entry[column]
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
                                                <button onClick={() => handleDeleteEntry(entry[selectedColumns[0]])}>삭제</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {/* 새 항목 추가 폼 */}
                            <tr>
                                {selectedColumns.map((column) => (
                                    <td key={column}>
                                        <input
                                            name={column}
                                            value={newEntry[column] || ''}
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
