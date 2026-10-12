import {
  Battery,
  Camera,
  Car,
  Check,
  Cpu,
  CreditCard,
  Fingerprint,
  Gauge,
  Headset,
  Lightbulb,
  Lock,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Thermometer,
  Timer,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  zap: Zap,
  wrench: Wrench,
  headset: Headset,
  smartphone: Smartphone,
  lightbulb: Lightbulb,
  gauge: Gauge,
  timer: Timer,
  cpu: Cpu,
  lock: Lock,
  scan: ScanLine,
  car: Car,
  'credit-card': CreditCard,
  thermometer: Thermometer,
  battery: Battery,
  wifi: Wifi,
  camera: Camera,
  fingerprint: Fingerprint,
  check: Check,
}

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = icons[name || 'check'] ?? Check
  return <Cmp className={className} strokeWidth={1.75} aria-hidden />
}
