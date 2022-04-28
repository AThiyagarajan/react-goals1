/**
 *
 * GoalStats
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import { selectGoals } from 'app/pages/HomePage/slice/selectors';
import { GoalStatus } from 'app/pages/HomePage/slice/types';

interface Props {}

export function GoalStats(props: Props) {
  const COLORS = ['#0088FE', '#FFBB28', '#00C49F', '#FF8042'];

  const goals = useSelector(selectGoals);

  const getData = () => {
    const counts = {
      created: 0,
      inProgress: 0,
      completed: 0,
    };
    goals.forEach(item => {
      if (item.status === GoalStatus.CREATED) {
        counts.created++;
      }
      if (item.status === GoalStatus.INPROGRESS) {
        counts.inProgress++;
      }
      if (item.status === GoalStatus.COMPLETED) {
        counts.completed++;
      }
    });

    return [
      { name: 'Created', value: counts.created },
      { name: 'InProgress', value: counts.inProgress },
      { name: 'Completed', value: counts.completed },
    ];
  };

  const getOnTrackData = () => {
    const counts = {
      onTrack: 0,
      overdue: 0,
    };
    goals.forEach(item => {
      const today = new Date().toISOString().slice(0, -14);
      if (new Date(item.dueDate).getTime() < new Date(today).getTime()) {
        counts.overdue++;
      } else {
        counts.onTrack++;
      }
    });

    return [
      { name: 'On Track', value: counts.onTrack },
      { name: 'Overdue', value: counts.overdue },
    ];
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    index,
    ...rest
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${value}`}
      </text>
    );
  };

  const chartData = getData();
  const onTrackChartData = getOnTrackData();

  return (
    <Div>
      <div className="pie-chart-container">
        <h1>Goals Status Report</h1>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Legend verticalAlign="bottom" />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bar-chart-container">
        <h1>On Track vs Overdue</h1>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Legend verticalAlign="bottom" />
            <Pie
              data={onTrackChartData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {onTrackChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Div>
  );
}

const Div = styled.div`
  height: 400px;
  width: 100%;
  display: flex;

  .bar-chart-container,
  .pie-chart-container {
    width: 50%;
    h1 {
      text-align: center;
    }
  }
`;
