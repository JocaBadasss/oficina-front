import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface MonthlyStat {
  month: string;
  total: number;
}

interface ChartLineProps {
  data: MonthlyStat[];
}

export function ChartLine({ data }: ChartLineProps) {
  return (
    <ResponsiveContainer
      width='100%'
      height={250}
    >
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='#2C2C31'
        />
        <XAxis
          dataKey='month'
          tick={{ fill: '#C4C4CC', fontSize: 12 }}
        />
        <YAxis
          tick={{ fill: '#C4C4CC', fontSize: 12 }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#202024', border: 'none' }}
          labelStyle={{ color: '#F4B400' }}
          formatter={(value: number) => [`${value} ordens`, 'Total']}
        />
        <Line
          type='monotone'
          dataKey='total'
          stroke='#F4B400'
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
