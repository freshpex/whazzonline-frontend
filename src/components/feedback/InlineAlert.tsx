type InlineAlertProps = {
  title: string;
  description?: string;
  tone?: 'info' | 'success' | 'warning' | 'error';
};

const toneStyles: Record<NonNullable<InlineAlertProps['tone']>, string> = {
  info: 'border-slate-200 bg-slate-50 text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800'
};

export function InlineAlert({ title, description, tone = 'info' }: InlineAlertProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${toneStyles[tone]}`} role={tone === 'error' ? 'alert' : 'status'} aria-live="polite">
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-xs opacity-80">{description}</p> : null}
    </div>
  );
}
