import { useEffect, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import { Filter } from "./Filter"
import { columns } from "./constants"
import "./style.css"
import axios from 'axios'
import { LOCAL_STORAGE_FILTERS_KEY } from './constants'

const ROWS_PER_PAGE = 10
// Я понимаю, что нужно получать лимит с бека, но успел только так
const MAX_PAGE = 10;

function App() { 
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    state: {
      sorting: sorting,
      globalFilter: filtering,
      columnFilters: columnFilters,
      columnVisibility: columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnFiltersChange: (filterFn) => handleChangeFilters(filterFn),
  })

  const handleChangeFilters = (filterFn) => {
    const newFilters = filterFn()
    const normolizeNewFilters = [...columnFilters, ...newFilters].reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
    const filtersArray = Object.values(normolizeNewFilters)
    const filtersArrayStringify = JSON.stringify(filtersArray)

    if (!newFilters.length) {
      return
    }

    localStorage.setItem(LOCAL_STORAGE_FILTERS_KEY, filtersArrayStringify)
    setColumnFilters(prev => ([
      ...prev,
      ...newFilters
    ]))
  }

  const handleClickSearch = (e) => {
    e.stopPropagation()
  }

  const handleNextPage = () => {
    table.nextPage()
    setPage(prev => prev + 1)
  }

  const handlePrevPage = () => {
    table.previousPage()
    setPage(prev => prev - 1)
  }

  const handleStartPage = () => {
    table.setPageIndex(0)
    setPage(1)
  }

  const handleEndPage = () => {
    table.setPageIndex(table.getPageCount() - 1)
    setPage(MAX_PAGE)
  }

  const initializeFilters = () => {
    const savedStringFilters = localStorage.getItem(LOCAL_STORAGE_FILTERS_KEY)

    if (savedStringFilters) {
      const parsedFilters = JSON.parse(savedStringFilters)
      setColumnFilters(parsedFilters)
    }
  }

  const fetchMoreData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/data", {
        params: {
          "_start": (page - 1) * ROWS_PER_PAGE,
          "_end": page * ROWS_PER_PAGE
        }
      })
      setData(response.data)
    } catch {
      setError("Ошибка при запросе данных")
    }
  }

  useEffect(() => {
    fetchMoreData()
  }, [page])

  useEffect(() => {
    initializeFilters()
  }, [])

  if (error) {
    <h1>Произошла ошибка при загрузке данных</h1>
  }

  return (
    <div className='w3-container container'>
      <input
        type="text"
        value={filtering}
        onChange={e => setFiltering(e.target.value)}
        placeholder='Поиск'
      />

      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map(column => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{' '}
                {column.id}
              </label>
            </div>
          )
        })}
      </div>

      <table className='w3-table-all table'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='w3-blue'>
              {headerGroup.headers.map(header => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: "⬆️", desc: "⬇️" } [header.column.getIsSorted() ?? null]}
                  {header.column.getCanFilter() ? (
                      <div onClick={handleClickSearch}>
                        <Filter column={header.column} table={table} />
                      </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(ceil => (
                <td key={ceil.id}>
                  {flexRender(ceil.column.columnDef.cell, ceil.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <button onClick={handleStartPage}>В начало</button>
      <button onClick={handlePrevPage} disabled={page <= 1}>Предыдущая</button>
      <button onClick={handleNextPage} disabled={page >= MAX_PAGE}>Следующая</button>
      <button
        onClick={handleEndPage}
      >В конец</button>
    </div>
  )
}

export default App
