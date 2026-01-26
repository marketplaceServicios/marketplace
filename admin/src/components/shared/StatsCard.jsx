import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatsCard({
  title,
  children,
  className
}) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        {children}
        {title && (
          <p className="text-center text-sm font-medium text-primary mt-4">
            {title}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
