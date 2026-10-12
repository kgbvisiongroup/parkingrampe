import type { Field } from 'payload'

/** Bilingual label for the admin panel (Serbian Latin + English). */
export const t = (sr: string, en: string) => ({ 'rs-latin': sr, en })

export const iconOptions = [
  { label: 'Štit / sigurnost', value: 'shield' },
  { label: 'Munja / brzina', value: 'zap' },
  { label: 'Ključ / montaža', value: 'wrench' },
  { label: 'Slušalice / podrška', value: 'headset' },
  { label: 'Telefon / aplikacija', value: 'smartphone' },
  { label: 'Sijalica / osvetljenje', value: 'lightbulb' },
  { label: 'Merač / performanse', value: 'gauge' },
  { label: 'Tajmer', value: 'timer' },
  { label: 'Čip / elektronika', value: 'cpu' },
  { label: 'Katanac', value: 'lock' },
  { label: 'Skener / senzor', value: 'scan' },
  { label: 'Automobil', value: 'car' },
  { label: 'Kartica', value: 'credit-card' },
  { label: 'Termometar / vremenski uslovi', value: 'thermometer' },
  { label: 'Baterija', value: 'battery' },
  { label: 'WiFi', value: 'wifi' },
  { label: 'Kamera', value: 'camera' },
  { label: 'Otisak prsta', value: 'fingerprint' },
  { label: 'Kvačica', value: 'check' },
]

export const iconField: Field = {
  name: 'icon',
  label: t('Ikonica', 'Icon'),
  type: 'select',
  options: iconOptions,
  defaultValue: 'check',
}

export const orderField: Field = {
  name: 'order',
  label: t('Redosled', 'Order'),
  type: 'number',
  defaultValue: 0,
  admin: {
    position: 'sidebar',
    description: t('Manji broj se prikazuje prvi.', 'Lower numbers are shown first.'),
  },
}
