import { useSupabaseSession } from "./useSupabaseSession"
import useSWR from "swr"

export const useFetch = <T>(endpoint: string) => {
  const { token } = useSupabaseSession()

  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
    })
    return res.json()
  }

  return useSWR<T>(
    token ? endpoint : null,
    fetcher
  )
}