import * as React from 'react';
import {
  Column,
  useAsyncDebounce,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import clsxm from '@/lib/clsxm';

import Button from '../buttons/Button';

type TableProps = {
  columns: Column[];
  data: readonly string[];
  onFetch: (pageIndex: number, pageSize: number) => void;
} & React.ComponentPropsWithRef<'table'>;

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, columns, data, onFetch, ...rest }, ref): JSX.Element => {
    const tableInstance = useTable(
      { columns, data },
      useFilters,
      useSortBy,
      usePagination
    );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      pageOptions,
      state: { pageIndex, pageSize },
      pageCount,
      gotoPage,
      previousPage,
      nextPage,
      setPageSize,
      canPreviousPage,
      canNextPage,
    } = tableInstance;

    const onFetchDebounced = useAsyncDebounce(onFetch, 100);

    React.useEffect(() => {
      onFetchDebounced(pageIndex, pageSize);
    }, [onFetchDebounced, pageIndex, pageSize]);

    return (
      <>
        <div className='flex w-full flex-col'>
          <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
              <div className='overflow-hidden !rounded-t-none border-b border-gray-200 shadow sm:rounded-lg'>
                <table
                  className={clsxm(
                    'min-w-full divide-y divide-gray-200',
                    className
                  )}
                  ref={ref}
                  {...getTableProps()}
                  {...rest}
                >
                  <thead className='bg-gray-50'>
                    {headerGroups.map((headerGroup) => (
                      // eslint-disable-next-line
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          // eslint-disable-next-line
                          <th
                            {...column.getHeaderProps()}
                            className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'
                          >
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    {...getTableBodyProps()}
                    className='divide-y divide-gray-200 bg-white'
                  >
                    {rows.map((row) => {
                      prepareRow(row);
                      return (
                        // eslint-disable-next-line
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              // eslint-disable-next-line
                              <td
                                {...cell.getCellProps()}
                                className='whitespace-nowrap px-6 py-4'
                              >
                                {cell.render('Cell')}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-row items-center justify-between pt-3'>
          <div className='flex flex-1 justify-between sm:hidden'>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </Button>
          </div>
          <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
            <div className='flex items-baseline gap-x-2'>
              <span className='text-sm text-gray-700'>
                Page <span className='font-medium'>{pageIndex + 1}</span> of{' '}
                <span className='font-medium'>{pageOptions.length}</span>
              </span>
              <label>
                <span className='sr-only'>Items Per Page</span>
                <select
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[5, 10, 20].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex -space-x-px rounded-md shadow-sm'
                aria-label='Pagination'
              >
                <Button
                  className='rounded-l-md rounded-r-none py-2 px-3'
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  <span className='sr-only'>First</span>
                  {'<<'}
                </Button>
                <Button
                  className='rounded-none py-2 px-3'
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <span className='sr-only'>Previous</span>
                  {'<'}
                </Button>
                <Button
                  className='rounded-none py-2 px-3'
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <span className='sr-only'>Next</span>
                  {'>'}
                </Button>
                <Button
                  className='rounded-r-md rounded-l-none py-2 px-3'
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  <span className='sr-only'>Last</span>
                  {'>>'}
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default Table;
