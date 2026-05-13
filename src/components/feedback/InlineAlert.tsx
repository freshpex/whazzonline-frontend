type InlineAlertProps = {
  title: string;
  description?: string;
  tone?: 'info' | 'success' | 'warning' | 'error';
};

const toneStyles: Record<NonNullable<InlineAlertProps['tone']>, string> = {
  info: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200'
};

export function InlineAlert({ title, description, tone = 'info' }: InlineAlertProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${toneStyles[tone]}`} role={tone === 'error' ? 'alert' : 'status'} aria-live="polite">
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-xs opacity-80">{description}</p> : null}
    </div>
  );
}
