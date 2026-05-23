import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface ChartDataPoint {
    year: string;
    value: number;
}

interface GrowthChartProps {
    data: ChartDataPoint[];
    title: string;
    dataKey: string;
}

const GrowthChart: React.FC<GrowthChartProps> = ({ data, title, dataKey }) => {
    // פונקציית עזר לפרמוט מספרים עם מפריד אלפים
    const formatNumber = (value: any) => {
        if (value === null || value === undefined) return "";
        return value.toLocaleString(undefined, { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 2 
        });
    };

    return (
        <div className="chart-wrapper">
            <h4 className="chart-title">{title}</h4>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis 
                        dataKey="year" 
                        stroke="#8b949e" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <YAxis 
                        stroke="#8b949e" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        // כאן הוספנו את המפרמט לציר ה-Y
                        tickFormatter={formatNumber}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#161b22', border: '1px solid #30363d', color: '#c9d1d9' }}
                        itemStyle={{ color: '#58a6ff' }}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                        separator="" 
                        formatter={(value: any) => {
                            // שימוש באותה לוגיקת פרמוט גם עבור ה-Tooltip
                            return [formatNumber(value), ""];
                        }}
                    />
                    <ReferenceLine y={0} stroke="#444" />
                    <Bar dataKey={dataKey} fill="#58a6ff" radius={[4, 4, 0, 0]} name="" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GrowthChart;