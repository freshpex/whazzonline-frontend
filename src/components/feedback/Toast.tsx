type ToastProps = {
  title: string;
  tone?: 'success' | 'warning' | 'error' | 'info';
  onClose: () => void;
};

const toneStyles: Record<NonNullable<ToastProps['tone']>, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200',
  error: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-200',
  info: 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
};

export function Toast({ title, tone = 'info', onClose }: ToastProps) {
  return (
    <div className="fixed right-4 top-24 z-30 w-[min(24rem,calc(100vw-2rem))] animate-fade-up" role={tone === 'error' ? 'alert' : 'status'} aria-live="polite">
      <div className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${toneStyles[tone]}`}>
        <p className="font-semibold">{title}</p>
        <button type="button" onClick={onClose} className="text-lg leading-none opacity-70 hover:opacity-100" aria-label="Close notification">
          x
        </button>
      </div>
    </div>
  );
}
