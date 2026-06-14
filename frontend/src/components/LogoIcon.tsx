interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className = "w-5 h-5" }: LogoIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
      <circle cx="6" cy="7.5" r="1.5" fill="currentColor" opacity="0.85" />
      <circle cx="18" cy="7.5" r="1.5" fill="currentColor" opacity="0.85" />
      <circle cx="6" cy="16.5" r="1.5" fill="currentColor" opacity="0.85" />
      <circle cx="18" cy="16.5" r="1.5" fill="currentColor" opacity="0.85" />
      <path
        d="M12 12L6 7.5M12 12L18 7.5M12 12L6 16.5M12 12L18 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}
