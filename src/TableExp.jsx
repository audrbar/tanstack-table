import React from 'react';
import { faker } from '@faker-js/faker';

import {
    Column,
    Table,
    ExpandedState,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    flexRender,
} from '@tanstack/react-table';

export default function TableExp() {
    const rerender = React.useReducer(() => ({}), {})[1];

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'firstName',
                header: ({ table }) => (
                    <>
                        <button
                            {...{
                                onClick:
                                    table.getToggleAllRowsExpandedHandler(),
                            }}
                        >
                            {table.getIsAllRowsExpanded() ? '👇' : '👉'}
                        </button>{' '}
                        First Name
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <div
                        style={{
                            paddingLeft: `${row.depth * 2}rem`,
                        }}
                    >
                        <>
                            {row.getCanExpand() ? (
                                <button
                                    {...{
                                        onClick: row.getToggleExpandedHandler(),
                                        style: { cursor: 'pointer' },
                                    }}
                                >
                                    {row.getIsExpanded() ? '👇' : '👉'}
                                </button>
                            ) : (
                                '🔵'
                            )}{' '}
                            {getValue()}
                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row.lastName,
                id: 'lastName',
                cell: (info) => info.getValue(),
                header: () => <span>Last Name</span>,
            },
            {
                accessorFn: (originalRow) => new Date(originalRow.bookings), //convert to date for sorting and filtering
                header: 'Bookings',
                cell: ({ cell }) =>
                    cell
                        .getValue('bookings')
                        .toLocaleDateString('lt-Lt', 'yyyy.MM.dd'),
                filterFn: 'isWithinRange',
            },
            {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
        ],
        []
    );

    const [data, setData] = React.useState(() => makeData(100, 4));
    const refreshData = () => setData(() => makeData(100, 4));
    const [expanded, setExpanded] = React.useState({});

    console.log(data);

    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
        },
        filterFns: {
            isWithinRange: isWithinRange,
        },
        onExpandedChange: setExpanded,
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        debugTable: true,
    });

    return (
        <div className='row'>
            <table className='table table-sm table-hover table-responsive'>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div>
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter
                                                            column={
                                                                header.column
                                                            }
                                                            table={table}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody className='table-group-divider'>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            table.setPageIndex(page);
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getRowModel().rows.length} Rows</div>
            <div>
                <button onClick={() => rerender()}>Force Rerender</button>
            </div>
            <div>
                <button onClick={() => refreshData()}>Refresh Data</button>
            </div>
            <pre>{JSON.stringify(expanded, null, 2)}</pre>
        </div>
    );
};

function Filter({ column, table }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === 'number' ? (
        <div className="flex space-x-2">
            <input
                type="number"
                value={columnFilterValue?.[0] ?? ''}
                onChange={(e) =>
                    column.setFilterValue((old) => [e.target.value, old?.[1]])
                }
                placeholder={`Min`}
                className="border shadow rounded"
            />
            <input
                type="number"
                value={columnFilterValue?.[1] ?? ''}
                onChange={(e) =>
                    column.setFilterValue((old) => [old?.[0], e.target.value])
                }
                placeholder={`Max`}
                className="border shadow rounded"
            />
        </div>
    ) : typeof firstValue === 'string' ? (
        <input
            type="text"
            value={columnFilterValue ?? ''}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            className="border shadow rounded"
        />
    ) : (
        <div>
            {'From '}
            <input
                type="date"
                value={columnFilterValue ?? ''}
                onChange={e => {
                    const val = e.target.value
                    column.setFilterValue((old = []) => [val ? val : undefined, old[1]])
                }}
                className="border shadow rounded"
            />
            {' to '}
            <input
                type="date"
                value={columnFilterValue ?? ''}
                onChange={e => {
                    const val = e.target.value
                    column.setFilterValue((old = []) => [old[0], val ? val.concat('T23:59:59.999Z') : undefined])
                }}
                className="border shadow rounded"
            />
        </div>
    );
}

function dateBetweenFilterFn(rows, id, filterValues) {
    const sd = filterValues[0] ? new Date(filterValues[0]) : undefined
    const ed = filterValues[1] ? new Date(filterValues[1]) : undefined

    if (ed || sd) {
        return rows.filter(r => {
            const cellDate = new Date(r.values[id])

            if (ed && sd) {
                return cellDate >= sd && cellDate <= ed
            } else if (sd) {
                return cellDate >= sd
            } else if (ed) {
                return cellDate <= ed
            }
        })
    } else {
        return rows;
    }
}

const isWithinRange = (row, columnId, value) => {
    const date = row.getValue(columnId);
    const [start, end] = value;
    //If one filter defined and date is null filter it
    if ((start || end) && !date) return false;
    if (start && !end) {
        return date.getTime() >= start.getTime()
    } else if (!start && end) {
        return date.getTime() <= end.getTime()
    } else if (start && end) {
        return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
    } else return true;
};

function isValidDate(d) {
    const parsedDate = new Date(d)
    return parsedDate instanceof Date && !isNaN(parsedDate)
}

const range = (len) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int(40),
        bookings: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }),
        visits: faker.number.int(1000),
        progress: faker.number.int(100),
        status: faker.helpers.shuffle(['relationship', 'complicated', 'single'])[0],
    }
}

function makeData(...lens) {
    const makeDataLevel = (depth = 0) => {
        const len = lens[depth]
        return range(len).map((d) => {
            return {
                ...newPerson(),
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
            }
        });
    }

    return makeDataLevel();
}
