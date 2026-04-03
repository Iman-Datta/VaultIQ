const VaultLogo = ({ size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="36" height="36" rx="9" fill="#0ea5e9" />
    <circle
      cx="18"
      cy="18"
      r="10"
      stroke="white"
      strokeWidth="2"
      strokeOpacity="0.25"
    />
    <circle
      cx="18"
      cy="18"
      r="7"
      stroke="white"
      strokeWidth="1.5"
      strokeOpacity="0.5"
    />
    {[0, 90, 180, 270].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 18 + 10 * Math.cos(rad);
      const y1 = 18 + 10 * Math.sin(rad);
      const x2 = 18 + 8 * Math.cos(rad);
      const y2 = 18 + 8 * Math.sin(rad);
      return (
        <line
          key={deg}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="white"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          strokeLinecap="round"
        />
      );
    })}
    <path
      d="M20 10.5L15.5 18.5H18.5L16 25.5L22.5 16H19L20 10.5Z"
      fill="white"
    />
  </svg>
);

export default VaultLogo;
