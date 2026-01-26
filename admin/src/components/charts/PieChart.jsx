import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts'

// Colores de la paleta Vive Silver
const COLORS = ['#CB7A5B', '#889B76', '#5C757A', '#3D4A3A', '#984A16', '#747F64']

export function PieChart({ data, title }) {
  // Asignar colores si no vienen definidos
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }))

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <RechartsPie>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E8E2D8',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: '20px' }}
            formatter={(value) => (
              <span className="text-xs text-primary">{value}</span>
            )}
          />
        </RechartsPie>
      </ResponsiveContainer>
      {title && (
        <p className="text-center text-sm font-medium text-primary mt-2">
          {title}
        </p>
      )}
    </div>
  )
}
