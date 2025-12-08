interface OrderStatusBadgeProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

const statusConfig = {
  PENDING: { label: 'Na čekanju', className: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  CONFIRMED: { label: 'Potvrđeno', className: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
  COMPLETED: { label: 'Završeno', className: 'bg-green-500/10 text-green-500 border-green-500/30' },
  CANCELLED: { label: 'Otkazano', className: 'bg-red-500/10 text-red-500 border-red-500/30' },
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${config.className}`}>
      {config.label}
    </span>
  )
}
