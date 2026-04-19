export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
