import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export function BarChart({ data, title, dataKey = 'empresas' }) {
  return (
    <div className="w-full">
      {title && (
        <p className="text-center text-xs text-muted mb-4">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <RechartsBar data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D8" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E8E2D8',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar
            dataKey={dataKey}
            fill="#3D4A3A"
            radius={[4, 4, 0, 0]}
          />
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  )
}
