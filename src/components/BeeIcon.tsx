const BeeIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bizhive-mark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9B40" />
        <stop offset="100%" stopColor="#FF6A1A" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="40" height="40" rx="14" fill="url(#bizhive-mark)" />
    <path
      d="M18 14h9.5c3.9 0 6.5 2.2 6.5 5.4 0 2.3-1.2 3.9-3.3 4.7 2.7.7 4.3 2.7 4.3 5.5 0 3.7-2.9 6-7.5 6H18V14Zm6 5v4.8h2.6c1.6 0 2.5-.9 2.5-2.3 0-1.6-1-2.5-2.8-2.5H24Zm0 9.1V33h3.1c1.9 0 2.9-.9 2.9-2.4 0-1.7-1.1-2.5-3.3-2.5H24Z"
      fill="#fff"
    />
  </svg>
);

export default BeeIcon;
