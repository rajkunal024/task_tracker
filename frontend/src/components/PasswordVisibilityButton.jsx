const PasswordVisibilityButton = ({ visible, onPressStart, onPressEnd }) => {
  return (
    <button
      type="button"
      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      onMouseDown={onPressStart}
      onMouseUp={onPressEnd}
      onMouseLeave={onPressEnd}
      onTouchStart={onPressStart}
      onTouchEnd={onPressEnd}
      onTouchCancel={onPressEnd}
      onBlur={onPressEnd}
      aria-label="Hold to show password"
      title="Hold to show password"
    >
      {visible ? (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3l18 18" />
          <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6" />
          <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9.3 4 11 8a13.3 13.3 0 0 1-2.2 3.4" />
          <path d="M6.6 6.6A13.3 13.3 0 0 0 1 12c1.7 4 6 8 11 8a10.8 10.8 0 0 0 5.4-1.5" />
        </svg>
      ) : (
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
};

export default PasswordVisibilityButton;
