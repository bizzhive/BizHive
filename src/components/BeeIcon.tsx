
const BeeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    {/* Hexagon */}
    <polygon
      points="20,2 36,11 36,29 20,38 4,29 4,11"
      fill="url(#hiveGrad)"
      stroke="#D97706"
      strokeWidth="0.5"
    />
    {/* Inner hexagon */}
    <polygon
      points="20,8 30,13.5 30,26.5 20,32 10,26.5 10,13.5"
      fill="none"
      stroke="white"
      strokeWidth="0.8"
      opacity="0.3"
    />
    {/* Bee body */}
    <ellipse cx="20" cy="20" rx="5.5" ry="7" fill="white" opacity="0.9" />
    {/* Stripes */}
    <rect x="14.5" y="18" width="11" height="2" rx="1" fill="#1A1A1A" opacity="0.7" />
    <rect x="14.5" y="22" width="11" height="2" rx="1" fill="#1A1A1A" opacity="0.7" />
    {/* Head */}
    <circle cx="20" cy="13.5" r="3.2" fill="white" opacity="0.9" />
    {/* Eyes */}
    <circle cx="18.5" cy="13" r="0.8" fill="#1A1A1A" />
    <circle cx="21.5" cy="13" r="0.8" fill="#1A1A1A" />
    {/* Wings */}
    <ellipse cx="14" cy="17" rx="3" ry="4.5" fill="white" fillOpacity="0.5" transform="rotate(-15 14 17)" />
    <ellipse cx="26" cy="17" rx="3" ry="4.5" fill="white" fillOpacity="0.5" transform="rotate(15 26 17)" />
    {/* Antennae */}
    <line x1="18" y1="10.5" x2="15.5" y2="7" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <line x1="22" y1="10.5" x2="24.5" y2="7" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <circle cx="15.5" cy="7" r="0.8" fill="white" opacity="0.8" />
    <circle cx="24.5" cy="7" r="0.8" fill="white" opacity="0.8" />
  </svg>
);

export default BeeIcon;
