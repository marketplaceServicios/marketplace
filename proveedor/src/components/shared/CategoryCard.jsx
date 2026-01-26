import { Card, CardContent } from '@/components/ui/card'

export function CategoryCard({
  image,
  nombre,
  descripcion,
  onClick
}) {
  return (
    <Card
      className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-semibold text-lg">{nombre}</h3>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-slate line-clamp-2">{descripcion}</p>
      </CardContent>
    </Card>
  )
}
