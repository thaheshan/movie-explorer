import Navbar from '../components/Navbar/Navbar'

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-white">Welcome to Movie Explorer</h1>
        <p className="text-lg text-gray-300">Discover and explore your favorite movies</p>
      </div>
    </div>
  )
}