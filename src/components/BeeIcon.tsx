const BeeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    {/* Clean hexagon */}
    <polygon
      points="20,2 36,11 36,29 20,38 4,29 4,11"
      fill="url(#hiveGrad)"
      rx="2"
    />
    {/* Abstract B letterform */}
    <path
      d="M15 11h4.5c2.5 0 4.5 1.5 4.5 3.5s-1.2 3-3 3.3c2.2.3 3.5 1.8 3.5 3.7 0 2.2-2 3.5-4.5 3.5H15V11z M18 12.5v5h1.5c1.8 0 2.8-1 2.8-2.5s-1-2.5-2.8-2.5H18z M18 19v5.5h2c2 0 3-1 3-2.8 0-1.7-1-2.7-3-2.7H18z"
      fill="white"
      opacity="0.95"
    />
  </svg>
);

export default BeeIcon;
