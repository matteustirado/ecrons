export function Button({ children, isLoading, ...props }) {
  return (
    <button
      disabled={isLoading || props.disabled}
      className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors w-full flex items-center justify-center gap-2"
      {...props}
    >
      {isLoading ? (
        <span className="block h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
      ) : children}
    </button>
  );
}