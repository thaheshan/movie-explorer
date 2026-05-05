export default function LoadingScreen(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-lg text-white animate-pulse">
        Loading application...
      </div>
    </div>
  )
}