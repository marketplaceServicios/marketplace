import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'

const COLORS = [
  '#CB7A5B', // terracotta
  '#889B76', // sage
  '#5C757A', // slate
  '#D4A039', // warning
  '#3D4A3A', // primary
  '#747F64', // olive
  '#B94A3D'  // danger
]

export function PieChart({
  data,
  dataKey = 'value',
  nameKey = 'name',
  title,
  className = ''
}) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-cream">
          <p className="font-medium text-primary">{payload[0].name}</p>
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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            formatter={(value) => (
              <span className="text-sm text-slate">{value}</span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
