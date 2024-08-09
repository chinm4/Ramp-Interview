import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [newId, setNewId] = useState('')

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee?.data ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()

    await employeeUtils.fetchAll()
    setIsLoading(false)
    await paginatedTransactionsUtils.fetchAll()

  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string, viewMore=false, reset=false) => {
      paginatedTransactionsUtils.invalidateData()
      transactionsByEmployeeUtils.invalidateData() //when changing off this filter
      
      await employeeUtils.fetchAll()

      //await employeeUtils.fetchAll()
      await transactionsByEmployeeUtils.fetchById(employeeId, viewMore, reset)

    },
    [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])
  //RampLoading--container
  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => { //uses the onChange function newValue from the InputSelectFile
            if (newValue === null) {
              return
            }
            if (newValue.id === '') { // added this conditional to deal with if the newValue.id === '' which is when we click all employees
              setNewId('')
              await loadAllTransactions()
            } else {
              setNewId(newValue.id)
              await loadTransactionsByEmployee(newValue.id, false, true)
            }
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {transactions !== null && paginatedTransactions?.nextPage !== null && ( transactionsByEmployee === null || transactionsByEmployee.index + 5 < transactionsByEmployee.length ) && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                if (newId === '')
                  await loadAllTransactions()
                else
                  await loadTransactionsByEmployee(newId, true)
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
