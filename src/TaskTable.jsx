import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
} from '@tanstack/react-table';
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { TASKS } from './data';
import { FilterIcon, ChevronDown, ChevronRight, ChevronDoubleDown, ChevronDoubleRight, ArrowDownUp } from './icons';

export default function TaskTable({ getRowCanExpand }) {
    // const rerender = useReducer(() => ({}), {})[1]
    const data = useMemo(() => TASKS, []);
    const columns = useMemo(() =>
        [
            {
                id: 'expander',
                header: ({ table }) => (
                    <>
                        <button
                            className='btn'
                            {...{
                                onClick: table.getToggleAllRowsExpandedHandler(),
                            }}
                        >
                            {table.getIsAllRowsExpanded() ? <ChevronDoubleRight /> : <ChevronDoubleDown />}
                        </button>{' '}
                    </>
                ),
                cell: ({ row }) => {
                    return row.getCanExpand() ? (
                        <button
                            className='btn'
                            {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: { cursor: 'pointer' },
                            }}
                        >
                            {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
                        </button>
                    ) : (
                        '🔵'
                    )
                },
                enableHiding: false,
            },
            {
                accessorKey: 'id',
                header: '#',
                enableHiding: false,
            },
            {
                accessorKey: 'taskName',
                header: 'Task Name',
                enableHiding: false,
            },
            {
                accessorFn: (originalRow) => new Date(originalRow.startDate), //convert to date for sorting and filtering
                header: 'Start Date',
                filterVariant: 'date-range',
                cell: ({ cell }) => cell.getValue('startDate').toLocaleDateString("lt-LT", "yyyy.MM.dd"), // convert back to string for display

            },
            {
                accessorFn: (originalRow) => new Date(originalRow.dueDate), //convert to date for sorting and filtering
                header: 'Due Date',
                filterVariant: 'date-range',
                enableHiding: false,
                cell: ({ cell }) => cell.getValue('dueDate').toLocaleDateString("lt-LT", "yyyy.MM.dd"), // convert back to string for display
            },
            {
                accessorKey: 'fullName',
                header: 'Responsible',
                enableHiding: false,
                filterVariant: 'multi-select',
            },
            {
                accessorKey: 'completed',
                header: 'Curr State',
                enableHiding: false,
            },
            {
                accessorKey: 'acquisitionYear',
                header: 'Acquisition Year',

            },
            {
                accessorKey: 'object',
                header: 'Object',

            },
            {
                accessorKey: 'assetType',
                header: 'Asset Type',

            },
            {
                accessorKey: 'capability',
                header: 'Capability',

            },
            {
                accessorKey: 'projectPlaning',
                header: 'Project Planing',

            },
            {
                accessorKey: 'projectSystem',
                header: 'Project System',

            },
            {
                accessorKey: 'program',
                header: 'Program',
                isVisible: false,

            },
        ]
        , []);

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({});
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [expanded, setExpanded] = useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        getRowCanExpand,
        enableFacetedValues: true,

        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onExpandedChange: setExpanded,

        state: {
            sorting,
            columnFilters,
            rowSelection,
            globalFilter,
            expanded,
            columnVisibility: {
                program: false,
                projectSystem: false,
                projectPlaning: false,
                capability: false,
                assetType: false,
                object: false,
                acquisitionYear: false,
            }
        },
    })

    // useEffect(() => {
    //     if (table.getState().columnFilters[0]?.id === 'taskName') {
    //         if (table.getState().sorting[0]?.id !== 'taskName') {
    //             table.setSorting([{ id: 'taskName', desc: false }])
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [table.getState().columnFilters[0]?.id])

    const filterByObject = [...new Set(data?.map((item) => item.object))];
    const filterByProgram = [...new Set(data?.map((item) => item.program))];
    const filterByCapability = [...new Set(data?.map((item) => item.capability))];
    const filterByPlaning = [...new Set(data?.map((item) => item.projectPlaning))];
    const filterBySystem = [...new Set(data?.map((item) => item.projectSystem))];
    const filterByAsset = [...new Set(data?.map((item) => item.assetType))];
    const filterByAcquisition = [...new Set(data?.map((item) => item.acquisitionYear))].sort((a, b) => a.localeCompare(b));

    const renderedUperRow = new Set();

    return (
        <div className='row'>
            {/* Clear ALL Filters and Sorting */}
            <div className="d-flex flex-row justify-content-center gap-2 mb-3">
                <button className="btn btn-outline-primary" onClick={() => table.resetColumnFilters()}>
                    Reset ALL Filters
                </button>
                <button className="btn btn-outline-primary" onClick={() => table.resetSorting(true)}>
                    Clear All Sorting
                </button>
            </div>
            {/* Dropdown Filters by Arrays */}
            <div className="d-flex flex-row justify-content-between mb-3">
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Object select"
                    style={{ width: '9rem' }}
                    value={table.getColumn("object").getFilterValue()}
                    onChange={(e) => table.getColumn("object")?.setFilterValue(e.target.value)}
                >
                    <option id="Object select" value="">Pick Object</option>
                    {filterByObject.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Program select"
                    style={{ width: '10rem' }}
                    value={table.getColumn("object").getFilterValue()}
                    onChange={(e) => table.getColumn("program")?.setFilterValue(e.target.value)}
                >
                    <option id="Program select" value="">Pick Program</option>
                    {filterByProgram.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Capability select"
                    style={{ width: '10rem' }}
                    value={table.getColumn("object").getFilterValue() || 'Pick Capability'}
                    onChange={(e) => table.getColumn("capability")?.setFilterValue(e.target.value)}
                >
                    <option id="Capability select" value="">Pick Capability</option>
                    {filterByCapability.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Project Planing select"
                    style={{ width: '11rem' }}
                    value={table.getColumn("object").getFilterValue() || 'Pick Planed Item'}
                    onChange={(e) => table.getColumn("projectPlaning")?.setFilterValue(e.target.value)}
                >
                    <option id="Project Planing select" value="">Pick Planed Item</option>
                    {filterByPlaning.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Project System select"
                    style={{ width: '13rem' }}
                    value={table.getColumn("object").getFilterValue() || 'Pick System Project'}
                    onChange={(e) => table.getColumn("projectSystem")?.setFilterValue(e.target.value)}
                >
                    <option id="Project System select" value="">Pick System Project</option>
                    {filterBySystem.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Asset Type select"
                    style={{ width: '8rem' }}
                    value={table.getColumn("object").getFilterValue() || 'Pick Asset'}
                    onChange={(e) => table.getColumn("assetType")?.setFilterValue(e.target.value)}
                >
                    <option id="Asset Type select" value="">Pick Asset</option>
                    {filterByAsset.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
            </div>

            <div className='d-flex flex-row justify-content-between align-items-center py-2'>
                {/* Global Text Search */}
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className='form-control p-2 mx-2'
                    placeholder="Search all columns..."
                    style={{ width: '15rem', height: '2.46rem' }}
                    onChange={value => setGlobalFilter(String(value))}
                />
                {/* Filter radio buttons Acquisition Year*/}
                <div className="d-flex justify-content-center gap-2 btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" className="btn-check" name="btnradio" id="btnradiox" autoComplete="off" defaultChecked={true} />
                    <label
                        className="btn btn-outline-secondary"
                        htmlFor="btnradiox"
                        onClick={() => table.getColumn("acquisitionYear")?.setFilterValue('')}
                    >
                        Acquisition Year
                    </label>
                    {filterByAcquisition?.map((year, index) => (
                        <Fragment key={index}>
                            <input key={"input" + index} type="radio" className="btn-check" name="btnradio" id={"btnradio" + index} autoComplete="off" />
                            <label
                                key={"label" + index}
                                className="btn btn-outline-secondary"
                                htmlFor={"btnradio" + index}
                                onClick={() => table.getColumn("acquisitionYear")?.setFilterValue(year)}
                            >
                                {year}
                            </label>
                        </Fragment>
                    ))}
                </div>

                {/* Visible Columns*/}
                <div className='dropdown-center mx-2'>
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="true">
                        Visible Columns
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <li className="dropdown-item" key={"li" + column.id}>
                                        <input
                                            className="form-check-input mx-1"
                                            type='checkbox'
                                            key={"input" + column.id}
                                            checked={column.getIsVisible()}
                                            // eslint-disable-next-line react/no-unknown-property
                                            onChange={column.getToggleVisibilityHandler()}
                                        />
                                        <label htmlFor="" className="form-check-label" key={"label" + column.id}>
                                            {' '}{column.id}
                                        </label>
                                    </li>
                                );
                            })}
                    </ul>
                </div>

                {/* Filter Page Size*/}
                <select
                    className='form-select bg-transparent'
                    aria-label="Page size select"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    style={{ width: '8rem', height: '2.46rem' }}
                >
                    {[10, 20, 30, 50].map((pageSize, index) => (
                        <option key={index} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>

            {/* TABLE TABLE TABLE TABLE*/}
            <table className='table table-sm caption-top table-striped table-hover table-responsive'>
                <caption className='mx-4'>{table.getFilteredRowModel().rows.length} of{" "}
                    {table.getPrePaginationRowModel().rows.length} task(s) filtered</caption>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                >
                                    {header.isPlaceholder ? null : (
                                        <>
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} table={table} />
                                                </div>
                                            ) : null}
                                            <div
                                                {...{
                                                    role: header.column.getCanSort()
                                                        ? 'button'
                                                        : '',
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {
                                                    { asc: '↑', desc: '↓' }[header.column.getIsSorted() ?? null]
                                                }
                                                {
                                                    header.column.getCanSort() && !header.column.getIsSorted() ? <ArrowDownUp /> : null
                                                }

                                            </div>
                                        </>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className='table-group-divider'>
                    {table.getRowModel().rows.map((row, index) => {
                        let upperRow = null;
                        if (!renderedUperRow.has(row.original.object)) {
                            upperRow = <tr key={index}>
                                {/* 2nd row is a custom 1 cell row */}
                                <td colSpan={row.getVisibleCells().length}>
                                    {renderUperRow({ row })}
                                </td>
                            </tr>
                            renderedUperRow.add(row.original.object)
                        }
                        return (
                            <Fragment key={row.id}>
                                {/* upper row is a custom 1 cell row */}
                                {
                                    upperRow
                                }
                                <tr>
                                    {/* first row is a normal row */}
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr>
                                        {/* 2nd row is a custom 1 cell row */}
                                        <td colSpan={row.getVisibleCells().length}>
                                            {renderSubComponent({ row })}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>
            <div className="d-flex flex-row justify-content-between">
                {/* Statistics */}
                <span>
                    {table.getFilteredRowModel().rows.length} of{" "}
                    {table.getPrePaginationRowModel().rows.length} task(s) filtered
                </span>
                {/* Pagination */}
                <div className='d-flex justify-content-center gap-2 btn-group-sm' role="group" aria-label="Basic outlined example" style={{ height: '2.1rem' }}>
                    <button
                        style={{ width: '2.1rem' }}
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => table.setPageIndex(0)}
                    >
                        {"<<"}
                    </button>
                    <button
                        style={{ width: '2.1rem' }}
                        type="button" className="btn btn-outline-secondary"
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                    >
                        {"<"}
                    </button>
                    <span className='d-flex align-items-center'>Page<strong className='mx-1'>{table.getState().pagination.pageIndex + 1}</strong> of <strong className='mx-1'>{table.getPageCount()}</strong></span>
                    <button
                        style={{ width: '2.1rem' }}
                        type="button" className="btn btn-outline-secondary"
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                    >
                        {">"}
                    </button>
                    <button
                        style={{ width: '2.1rem' }}
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    >
                        {">>"}
                    </button>
                </div>
                {/* Filter Page Size*/}
                <select
                    className='form-select bg-transparent'
                    aria-label="Page size select"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    style={{ width: '8rem', height: '2.46rem' }}
                >
                    {[10, 20, 30, 50].map((pageSize, index) => (
                        <option key={index} value={pageSize}>
                            Show{' '}{pageSize}
                        </option>
                    ))}
                </select>
            </div>
            {/* Modal */}
            <div className="modal fade" id="exampleModal19" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div className="modal-body">
                            <p>Modal body text goes here.</p>
                        </div>
                    </div>
                </div>
            </div>
            <button
                type="button"
                className="btn btn-outline-secondary my-3"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal19"
                style={{ width: '7rem' }}
            >
                <FilterIcon />
                {' '}MODAL
            </button >
        </div >
    );
}

const renderSubComponent = ({ row }) => {
    return (
        <div className='row'>
            {/* <code>{JSON.stringify(row.original, null, 2)}</code> */}
            <div className="col ms-5">
                <div className="row ms-4">
                    <div className='col-md-auto'>
                        <p className='mb-0 fw-bold'>Object:</p>
                        <p className='mb-0 fw-bold'>Capability:</p>
                        <p className='mb-0 fw-bold'>Acquisition Year:</p>
                    </div>
                    <div className='col'>
                        <p className='mb-0'>{row.original.object}</p>
                        <p className='mb-0'>{row.original.capability}</p>
                        <p className='mb-0'>{row.original.acquisitionYear}</p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="row">
                    <div className='col-md-auto'>
                        <p className='mb-0 fw-bold'>Program:</p>
                        <p className='mb-0 fw-bold'>Project Planing:</p>
                        <p className='mb-0 fw-bold'>Project System:</p>
                        <p className='mb-0 fw-bold'>Asset Type:</p>
                    </div>
                    <div className='col'>
                        <p className='mb-0'>{row.original.program}</p>
                        <p className='mb-0'>{row.original.projectPlaning}</p>
                        <p className='mb-0'>{row.original.projectSystem}</p>
                        <p className='mb-0'>{row.original.assetType}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const renderUperRow = ({ row }) => {
    return (
        <div className='row'>
            {/* <code>{JSON.stringify(row.original, null, 2)}</code> */}
            <p className='mb-0'>Object: {row.original.object}</p>
        </div>
    );
}

const Filter = ({ column, table }) => {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();
    const sortedUniqueValues = React.useMemo(
        () =>
            typeof firstValue === 'number'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys()).sort(),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [column.getFacetedUniqueValues()]
    );

    return typeof firstValue === 'number' ? (
        <div>
            <div className="d-flex w-auto justify-content-center ">
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
                    className="px-1 border rounded"
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
                    className="px-1 border rounded"
                />
            </div>
        </div>
    ) : (
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
                className="border rounded"
                list={column.id + 'list'}
            />
        </>
    )
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
