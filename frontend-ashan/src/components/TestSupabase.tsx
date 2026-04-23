import { useEffect } from 'react'
import { supabase } from '../services/supabase'

const TestSupabase = () => {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')

      console.log('DATA:', data)
      console.log('ERROR:', error)
    }

    test()
  }, [])

  return <div>Check console</div>
}

export default TestSupabase