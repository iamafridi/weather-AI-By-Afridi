export default function Skeleton({ className = '', lines = 3 }) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-3.5 rounded"
          style={{ width: i === lines - 1 ? '65%' : i % 2 === 0 ? '90%' : '80%' }}
        />
      ))}
    </div>
  );
}
