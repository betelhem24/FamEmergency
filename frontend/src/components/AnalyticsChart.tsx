import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface IChartData {
    name: string;
    patients: number;
}

const data: IChartData[] = [
    { name: 'Mon', patients: 12 },
    { name: 'Tue', patients: 19 },
    { name: 'Wed', patients: 15 },
    { name: 'Thu', patients: 22 },
    { name: 'Fri', patients: 30 },
    { name: 'Sat', patients: 10 },
    { name: 'Sun', patients: 5 },
];

const AnalyticsChart: React.FC = () => {
    return (
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="var(--glass-text)"
                        tick={{ fill: 'var(--glass-text)' }}
                    />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Bar dataKey="patients" radius={[4, 4, 0, 0]}>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                        ))}
                    </Bar>
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00d2ff" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#3a7bd5" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
