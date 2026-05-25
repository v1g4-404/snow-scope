import { useSupabaseSession } from "./useSupabaseSession"
import useSWR from "swr"

export const useFetch = <T>(endpoint: string) => {
  const { token } = useSupabaseSession()

  const fetcher = async (url: string) => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = token
    }
    const res = await fetch(url, { headers })
    return res.json()
  }

  return useSWR<T>(endpoint, fetcher)
}