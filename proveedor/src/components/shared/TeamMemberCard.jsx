import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MoreVertical } from 'lucide-react'

const roleColorMap = {
  'Operaciones': 'terracotta',
  'Producto': 'sage',
  'Atencion al cliente': 'slate',
  'Administrador': 'olive',
  'Contabilidad': 'warning',
  'Ventas': 'sage'
}

export function TeamMemberCard({
  avatar,
  nombre,
  email,
  celular,
  rol,
  onEmail,
  onCall,
  onMore
}) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const roleColor = roleColorMap[rol] || 'default'

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <Badge variant={roleColor} className="text-xs">
            {rol}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onMore}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 mb-3">
            <AvatarImage src={avatar} alt={nombre} />
            <AvatarFallback className="bg-sage text-white text-lg">
              {getInitials(nombre)}
            </AvatarFallback>
          </Avatar>

          <h3 className="font-semibold text-primary">{nombre}</h3>
          <p className="text-sm text-slate mb-4">{email}</p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onEmail}
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onCall}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
