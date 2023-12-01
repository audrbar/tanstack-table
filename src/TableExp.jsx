import React from 'react';
import { faker } from '@faker-js/faker';

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    flexRender,
    sortingFns,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    FilterFns,

} from '@tanstack/react-table';
import {
    RankingInfo,
    rankItem,
    compareItems,
} from '@tanstack/match-sorter-utils';

const fuzzyFilter = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)
    // Store the itemRank info
    addMeta({ itemRank })
    // Return if the item should be filtered in/out
    return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
    let dir = 0
    // Only sort by rank if the column has ranking information
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank,
            rowB.columnFiltersMeta[columnId]?.itemRan
        )
    }
    // Provide an alphanumeric fallback for when the item ranks are equal
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

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
                filterFn: 'fuzzy',
                sortingFn: fuzzySort,
            },
            {
                accessorFn: (row) => row.lastName,
                id: 'lastName',
                cell: (info) => info.getValue(),
                header: () => <span>Last Name</span>,
            },
            {
                accessorKey: 'bookings',
                header: 'Bookings',
                cell: (info) => new Date(info.getValue()).toLocaleDateString('lt-Lt'),
                filterFn: 'dateBetweenFilterFn',
            },
            {
                accessorKey: 'visits',
                header: 'Visits',
                cell: (info) => (info.getValue('visits')).toString(),
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
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [sorting, setSorting] = React.useState([]);

    console.log(data);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            expanded,
            columnFilters,
            globalFilter,
        },
        filterFns: {
            dateBetweenFilterFn: dateBetweenFilterFn,
            fuzzy: fuzzyFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        onExpandedChange: setExpanded,
        getSubRows: (row) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    });

    React.useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'firstName') {
            if (table.getState().sorting[0]?.id !== 'firstName') {
                table.setSorting([{ id: 'firstName', desc: false }])
            }
        }
    }, [table.getState().columnFilters[0]?.id]);

    return (
        <div className='row'>
            <div>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="form-control p-2 mx-2"
                    placeholder="Search all columns..."
                />
            </div>
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
                                            <>
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} table={table} />
                                                    </div>
                                                ) : null}
                                            </>
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
            <pre>{JSON.stringify(table.getState(), null, 2)}</pre>
        </div >
    );
};

function Filter({ column, table }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = React.useMemo(
        () =>
            typeof firstValue === 'number'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        [column, firstValue]
    )

    return typeof firstValue === 'number' ? (
        <div className="d-flex w-auto justify-content-center">
            <DebouncedInput
                type="number"
                min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                value={(columnFilterValue)?.[0] ?? ''}
                onChange={value =>
                    column.setFilterValue((old) => [value, old?.[1]])
                }
                placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
                    ? `(${column.getFacetedMinMaxValues()?.[0]})`
                    : ''
                    }`}
                className="border shadow rounded"
            />
            <DebouncedInput
                type="number"
                min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
                max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
                value={(columnFilterValue)?.[1] ?? ''}
                onChange={value =>
                    column.setFilterValue((old) => [old?.[0], value])
                }
                placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
                    ? `(${column.getFacetedMinMaxValues()?.[1]})`
                    : ''
                    }`}
                className="border shadow rounded"
            />
        </div>
    ) : typeof firstValue === 'string' ? (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.slice(0, 5000).map((value) => (
                    <option value={value} key={value} />
                ))}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '')}
                onChange={value => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                className="w-36 border shadow rounded"
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
    ) : (
        <div>
            {'From '}
            <input
                type="date"
                value={columnFilterValue?.[0] ?? ''}
                onChange={e => {
                    const val = e.currentTarget.value
                    column.setFilterValue((old = []) => [val, old[1]])
                }}
                className="border shadow rounded"
            />
            {' to '}
            <input
                type="date"
                value={columnFilterValue?.[1] ?? ''}
                onChange={e => {
                    e.preventDefault();
                    const val = e.currentTarget.value
                    column.setFilterValue((old = []) => [old[0], val])
                }}
                className="border shadow rounded"
            />
        </div>
    );
}

function dateBetweenFilterFn(row, columnIds, filterValue) {
    const from = filterValue[0] ? new Date(filterValue[0]) : undefined
    const to = filterValue[1] ? new Date(filterValue[1]) : undefined
    const value = row.getValue('bookings');
    return (from ? value.getTime() >= from.getTime() : true) && (to ? value.getTime() <= to.getTime() : true);
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

const createDebounceFn = (fn, debounceTime) => {
    /** @type {ReturnType<setInterval> | undefined} */
    let tid;
    return (...props) => {
        clearTimeout(tid);
        tid = setTimeout(() => fn(...props), debounceTime);
    }
}

// eslint-disable-next-line react/prop-types
const DebouncedInput = ({ value: initialValue, onChange, debounceTime = 500, ...props }) => {

    const handleOnChange = createDebounceFn(e => {
        onChange(e.target.value)
    }, debounceTime);

    return (
        <input {...props} onChange={handleOnChange} />
    );
}