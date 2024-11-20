// src/ham_common/ham_ChartComponent.jsx

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ChartComponent = ({ chart }) => {
    console.log("ChartComponent에 전달된 데이터:", chart);

    // attendedCount와 totalCount 추출 및 유효성 검사
    const attendedCount = typeof chart.attendedCount === 'number' ? chart.attendedCount : 0;
    const totalCount = typeof chart.totalCount === 'number' ? chart.totalCount : 0;
    const displayValue = chart.displayValue || '0.0%';

    // 데이터 포맷팅: totalCount가 0이면 미완료만 표시
    const data = totalCount === 0 ? [{ name: '미완료', value: 1 }] : [
        { name: '완료', value: attendedCount },
        { name: '미완료', value: totalCount - attendedCount }
    ];

    // 차트 색상 설정: 완료는 chart.color 또는 기본 색상, 미완료는 회색
    // totalCount가 0인 경우 zeroColor를 사용
    const COLORS = totalCount === 0 ? [chart.zeroColor || '#E0E0E0'] : [chart.color || '#3a7afe', '#E0E0E0'];

    // 퍼센트 계산
    const percentage = totalCount > 0 ? ((attendedCount / totalCount) * 100).toFixed(1) : '0.0%';

    return (
        <div className="chart-wrapper">
            <ResponsiveContainer className="chart-container">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40} // 도넛 차트의 내부 반경 (조정 가능)
                        outerRadius={60} // 도넛 차트의 외부 반경 (조정 가능)
                        dataKey="value"
                        label={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#333' // 중앙 텍스트 색상 조정
                }}
            >
                {/* 중앙에 퍼센트 값 표시 */}
                <div style={{ fontSize: '1em', fontWeight: 'bold' }}>{displayValue}</div>
                {totalCount > 0 && (
                    <div style={{ fontSize: '0.8em' }}>
                        {`${attendedCount}/${totalCount}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartComponent;
