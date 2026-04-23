import { useEffect } from 'react'
import { getTrending } from '../services/tmdb'

const TestTMDB = () => {
  useEffect(() => {
    const test = async () => {
      const data = await getTrending()
      console.log(data)
    }

    test()
  }, [])

  return <div>Check TMDB console</div>
}

export default TestTMDB