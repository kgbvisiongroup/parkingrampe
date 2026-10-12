const Shield = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" fill="#2bb04a" />
    <path d="m8.5 12 2.4 2.4 4.6-4.8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Shield size={44} />
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '0.02em' }}>KGB Automation</div>
        <div style={{ fontSize: 13, opacity: 0.6 }}>Upravljanje sajtom</div>
      </div>
    </div>
  )
}

export function Icon() {
  return <Shield size={26} />
}
