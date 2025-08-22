'use client';

interface VerificationBadgeProps {
  verified: boolean;
  domain?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function VerificationBadge({ verified, domain, size = 'md' }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  if (!verified) {
    return (
      <span className={`${sizeClasses[size]} rounded-full bg-neutral-800/50 border border-neutral-700 text-neutral-400`}>
        Unverified
      </span>
    );
  }

  return (
    <span className={`${sizeClasses[size]} rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1`}>
      <span>✓</span>
      <span>Verified</span>
      {domain && size !== 'sm' && <span className="opacity-70">• {domain}</span>}
    </span>
  );
}
