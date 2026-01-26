import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'

const COLORS = [
  '#CB7A5B', // terracotta
  '#889B76', // sage
  '#5C757A', // slate
  '#D4A039', // warning
  '#3D4A3A', // primary
  '#747F64', // olive
]

export function BarChart({
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  title,
  color = '#889B76',
  showGrid = true,
  useMultipleColors = false,
  className = ''
}) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-cream">
          <p className="font-medium text-primary">{label}</p>
          <p className="text-accent font-bold">{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={className}>
      {title && (
        <h3 className="text-lg font-semibold text-primary mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D8" />
          )}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fill: '#5C757A', fontSize: 12 }}
            axisLine={{ stroke: '#E8E2D8' }}
            tickLine={{ stroke: '#E8E2D8' }}
          />
          <YAxis
            tick={{ fill: '#5C757A', fontSize: 12 }}
            axisLine={{ stroke: '#E8E2D8' }}
            tickLine={{ stroke: '#E8E2D8' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={dataKey}
            radius={[4, 4, 0, 0]}
            fill={color}
          >
            {useMultipleColors &&
              data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
