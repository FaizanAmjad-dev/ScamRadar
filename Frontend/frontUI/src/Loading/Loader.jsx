


// ya spiner hai ghoomne wala loader
export function Spinner({ size = "w-8 h-8" }) {
  return <span className={`${size} inline-block border-4 border-blue-600 border-t-transparent rounded-full animate-spin`} />
}

// ya ya complete page ka loader hai 
export function PageLoader() {
  return <div className="min-h-[60vh] flex items-center justify-center"><Spinner /></div>
}

// ya hai main post ka loader
export function PostSkeleton() {
  return (
    <div className="w-full sm:max-w-[580px] mx-auto px-4 py-4 border-b-2 border-gray-300 animate-pulse">
      <div className="flex gap-2 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="h-3 w-32 bg-gray-300 rounded" />
      </div>
      <div className="h-3 w-full bg-gray-300 rounded mt-4" />
      <div className="h-3 w-2/3 bg-gray-300 rounded mt-2" />
      <div className="h-[200px] bg-gray-300 rounded-xl mt-4" />
    </div>
  )
}