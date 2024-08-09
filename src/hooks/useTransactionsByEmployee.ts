import { useCallback, useState, useEffect, useRef } from "react"
import { RequestByEmployeeParams, Transaction, TransactEmployeeResponse } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<TransactEmployeeResponse<Transaction[]> | null>(null)
  const [eId, setEId] = useState('')
  let index = useRef<number>(0)
  const transactionsPerScroll = 5

  useEffect(() => {
    index.current = 0
    console.log('passes useEffect')
  }, [eId])

  const fetchById = useCallback(
    async (employeeId: string, viewMore: boolean, reset: boolean) => {
      const data = await fetchWithCache<Transaction[], RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          employeeId,
        }
      )
      //console.log(data)
      if (data === null) {
        return 
      }
      setEId(employeeId)
      if (reset === true) {
        index.current = 0
        //console.log("set index to 0")
      } else if (viewMore === true) {
        //console.log('view more is true')
        index.current += transactionsPerScroll
      }
      //console.log(data.slice(0, index.current+transactionsPerScroll))
      //console.log(index)
      setTransactionsByEmployee(() => {
        return { data: data.slice(0, index.current+transactionsPerScroll), index: index.current, length: data.length }
      })

    },
    [fetchWithCache]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}


//figuring out how to get James Smith to only display 5 elements at refresh