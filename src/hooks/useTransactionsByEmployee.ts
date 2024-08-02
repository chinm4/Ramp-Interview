import { useCallback, useState } from "react"
import { RequestByEmployeeParams, Transaction, PaginatedResponse } from "../utils/types"
import { TransactionsByEmployeeResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function useTransactionsByEmployee(): TransactionsByEmployeeResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [transactionsByEmployee, setTransactionsByEmployee] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchById = useCallback(
    async (employeeId: string) => {
      const resp = await fetchWithCache<PaginatedResponse<Transaction[]>, RequestByEmployeeParams>(
        "transactionsByEmployee",
        {
          page: transactionsByEmployee === null ? 0 : transactionsByEmployee.nextPage,
          employeeId,
        }
      )
      console.log(employeeId)
      setTransactionsByEmployee((previousResponse) => {
        console.log('runs', previousResponse?.data, previousResponse?.nextPage)
        console.log(resp?.data, resp?.nextPage)
        if (resp === null || previousResponse === null) {
          return resp
        }
        for (let i = 0; i < resp.data.length; i++) {
          previousResponse.data.push(resp.data[i])
        }
        return { data: previousResponse.data, nextPage: resp.nextPage}
      })
    },
    [fetchWithCache, transactionsByEmployee]
  )

  const invalidateData = useCallback(() => {
    setTransactionsByEmployee(null)
  }, [])

  return { data: transactionsByEmployee, loading, fetchById, invalidateData }
}


//figuring out how to get James Smith to only display 5 elements at refresh