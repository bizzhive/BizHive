
const BeeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <ellipse cx="20" cy="22" rx="10" ry="12" fill="#FFC107" />
    {/* Stripes */}
    <rect x="10" y="19" width="20" height="3" rx="1" fill="#1A1A1A" />
    <rect x="10" y="25" width="20" height="3" rx="1" fill="#1A1A1A" />
    {/* Head */}
    <circle cx="20" cy="11" r="6" fill="#FFC107" />
    {/* Eyes */}
    <circle cx="17.5" cy="10" r="1.5" fill="#1A1A1A" />
    <circle cx="22.5" cy="10" r="1.5" fill="#1A1A1A" />
    {/* Eye shine */}
    <circle cx="18" cy="9.5" r="0.5" fill="white" />
    <circle cx="23" cy="9.5" r="0.5" fill="white" />
    {/* Antennae */}
    <line x1="16" y1="6" x2="13" y2="2" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="13" cy="2" r="1.2" fill="#FFC107" />
    <line x1="24" y1="6" x2="27" y2="2" stroke="#1A1A1A" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="27" cy="2" r="1.2" fill="#FFC107" />
    {/* Wings */}
    <ellipse cx="12" cy="16" rx="5" ry="7" fill="white" fillOpacity="0.6" transform="rotate(-15 12 16)" />
    <ellipse cx="28" cy="16" rx="5" ry="7" fill="white" fillOpacity="0.6" transform="rotate(15 28 16)" />
    {/* Smile */}
    <path d="M17 13 Q20 16 23 13" stroke="#1A1A1A" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    {/* Stinger */}
    <path d="M20 34 L18.5 37 L21.5 37 Z" fill="#1A1A1A" />
  </svg>
);

export default BeeIcon;
