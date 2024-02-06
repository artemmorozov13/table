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
import "./style.css"
import axios from 'axios'

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

  /** @type import("@tanstack/react-table").ColumnDef<any> */
  const columns = [
    {
      header: "Имя",
      accessorKey: "firstName",
      footer: "Имя"
    },
    {
      header: "Дата заявки",
      accessorKey: "dateRequest",
      footer: "Дата заявки"
    },
    {
      header: "Снилс",
      accessorKey: "snils",
      footer: "Снилс"
    },
    {
      header: "Оригинал",
      accessorKey: "sertificateOriginal",
      footer: "Оригинал"
    },
    {
      header: "Фамилия",
      accessorKey: "lastName",
      footer: "Фамилия"
    },
    {
      header: "Дата заведения дела",
      accessorKey: "dateFormed",
      footer: "Дата заведения дела"
    },
    {
      header: "Номер дела",
      accessorKey: "caseNumber",
      footer: "Номер дела"
    },
    {
      header: "Подписка",
      accessorKey: "subscribe",
      footer: "Подписка"
    }
  ]

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
      columnFilters: columnFilters
    },  
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onColumnFiltersChange: setColumnFilters
  })

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
      <table className='w3-table-all table'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr className='w3-blue'>
              {headerGroup.headers.map(header => (
                <th onClick={header.column.getToggleSortingHandler()}>
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
            <tr>
              {row.getVisibleCells().map(ceil => (
                <td>
                  {flexRender(ceil.column.columnDef.cell, ceil.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr>
              {footerGroup.headers.map(header => (
                <th>
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
