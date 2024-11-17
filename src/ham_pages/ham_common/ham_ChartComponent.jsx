import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

const ChartComponent = ({ chart }) => {
    console.log("ChartComponent에 전달된 데이터:", chart);

    if (!chart || !chart.data) {
        console.log("차트 데이터 없음");
        return <div>차트 데이터가 없습니다.</div>;
    }

    try {
        // data가 문자열이면 JSON으로 파싱
        const chartData = typeof chart.data === 'string' ? JSON.parse(chart.data) : chart.data;
        console.log("가공된 차트 데이터:", chartData);
        
        // 데이터 포맷팅
        const data = [
            { name: '완료', value: chartData[0] },
            { name: '미완료', value: chartData[1] }
        ];

        const COLORS = [chart.color || '#3a7afe', '#E0E0E0'];

        return (
            <div className="chart-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <PieChart width={150} height={150}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}
                >
                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{chart.label}</div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("차트 데이터 처리 중 오류:", error);
        console.error(`Invalid chart data for chart ID ${chart.id}`, error);
        return <div>차트 데이터 오류</div>;
    }
};

export default ChartComponent;