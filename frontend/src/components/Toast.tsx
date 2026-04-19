import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => dismissToast(t.id)}>
          <span className="toast-icon">
            {t.type === 'success' && '\u2713'}
            {t.type === 'error' && '\u2717'}
            {t.type === 'info' && '\u2139'}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
