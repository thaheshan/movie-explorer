export default function SkeletonCard({ darkMode }) {
  return (
    <div className={`rounded-xl overflow-hidden animate-pulse
      ${darkMode ? "bg-gray-900 border border-gray-800" : "bg-gray-100 border border-gray-200"}`}>
      <div className={`aspect-[2/3] ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}></div>
    </div>
  );
}