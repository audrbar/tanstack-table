import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
} from '@tanstack/react-table';
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { TASKS } from './data';
import { FilterIcon, CalendarIcon, ChevronDown, ChevronRight, ChevronDoubleDown, ChevronDoubleRight } from './icons';

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
            },
            {
                accessorKey: 'id',
                header: 'ID',
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'taskName',
                header: 'Task Name',
                enableHiding: false,
            },
            {
                accessorKey: 'startDate',
                header: 'Start Date',
                cell: info =>
                    new Date(info.getValue('startDate')).toLocaleDateString("lt-LT", "yyyy.MM.dd",),
            },
            {
                accessorKey: 'dueDate',
                header: 'Due Date',
                enableHiding: false,
                cell: info =>
                    new Date(info.getValue('dueDate')).toLocaleDateString("lt-LT", "yyyy.MM.dd",),
            },
            {
                accessorKey: 'fullName',
                header: 'Responsible',
                enableHiding: false,
            },
            {
                accessorKey: 'completed',
                header: 'Completed',
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
                header: 'program',

            },
            {
                id: 'actions',
                enableHiding: false,
                enableSorting: false,
                cell: ({ row }) => {
                    const task = row.original;
                    const taskId = task.id;
                    return (
                        <>
                            <div className="modal fade" id={"exampleModal" + task.id} tabIndex="-1" aria-labelledby={"exampleModalLabel" + task.id} aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        <div className="modal-body">
                                            <p>Modal body text goes here {taskId}.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                id={"exampleModal" + task.id}
                                className="btn btn-outline-secondary"
                                data-bs-toggle="modal"
                                data-bs-target={"#exampleModal" + task.id}
                            >
                                <CalendarIcon />
                            </button >
                        </>
                    );
                }
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
        getRowCanExpand,

        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onExpandedChange: setExpanded,

        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            expanded,
        },
    })

    const filterByObject = [...new Set(data?.map((item) => item.object))];
    const filterByProgram = [...new Set(data?.map((item) => item.program))];
    const filterByCapability = [...new Set(data?.map((item) => item.capability))];
    const filterByPlaning = [...new Set(data?.map((item) => item.projectPlaning))];
    const filterBySystem = [...new Set(data?.map((item) => item.projectSystem))];
    const filterByAsset = [...new Set(data?.map((item) => item.assetType))];
    const filterByAcquisition = [...new Set(data?.map((item) => item.acquisitionYear))].sort((a, b) => a.localeCompare(b));

    return (
        <div className='row'>
            <div className="d-flex flex-row justify-content-center mb-3">
                <button className="btn btn-outline-secondary" onClick={() => table.resetColumnFilters()}>
                    Reset ALL Filters
                </button>
            </div>
            {/* Dropdown Filters by Arrays */}
            <div className="d-flex flex-row justify-content-between mb-3">
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Default select example"
                    style={{ width: '9rem' }}
                    value={table.getColumn("object").getFilterValue()}
                    onChange={(e) => table.getColumn("object")?.setFilterValue(e.target.value)}
                >
                    <option defaultValue={"Pick Object"} value="">Pick Object</option>
                    {filterByObject.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Default select example"
                    style={{ width: '10rem' }}
                    onChange={(e) => table.getColumn("program")?.setFilterValue(e.target.value)}
                >
                    <option defaultValue={"Pick Program"}>Pick Program</option>
                    {filterByProgram.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Default select example"
                    style={{ width: '10rem' }}
                    onChange={(e) => table.getColumn("capability")?.setFilterValue(e.target.value)}
                >
                    <option defaultValue={"Pick Capability"}>Pick Capability</option>
                    {filterByCapability.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Default select example"
                    style={{ width: '11rem' }}
                    onChange={(e) => table.getColumn("projectPlaning")?.setFilterValue(e.target.value)}
                >
                    <option defaultValue="Pick Planed Item">Pick Planed Item</option>
                    {filterByPlaning.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Default select example"
                    style={{ width: '13rem' }}
                    onChange={(e) => table.getColumn("projectSystem")?.setFilterValue(e.target.value)}
                >
                    <option defaultValue="Pick System Project">Pick System Project</option>
                    {filterBySystem.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}>{columnFilter}</option>))}
                </select>
                <select
                    className="form-select bg-transparent mx-2"
                    aria-label="Default select example"
                    style={{ width: '8rem' }}
                    onChange={(e) => table.getColumn("assetType")?.setFilterValue(e.target.value)}
                >
                    <option defaultValue="Pick Asset">Pick Asset</option>
                    {filterByAsset.map((columnFilter, index) => (
                        <option key={index} value={columnFilter}

                        >{columnFilter}</option>))}
                </select>
            </div>

            {/* Filter radio buttons Acquisition Year*/}
            <div className="d-flex justify-content-center gap-2 btn-group-sm" role="group" aria-label="Basic radio toggle button group">
                <input type="radio" className="btn-check" name="btnradio" id="btnradiox" autoComplete="off" defaultChecked={true} />
                <label
                    className="btn btn-outline-secondary"
                    htmlFor="btnradiox"
                    onChange={() => table.getColumn("acquisitionYear")?.setFilterValue('')}
                >
                    Acquisition Year
                </label>
                {filterByAcquisition?.map((year, index) => (
                    <React.Fragment key={index}>
                        <input key={"input" + index} type="radio" className="btn-check" name="btnradio" id={"btnradio" + index} autoComplete="off" />
                        <label
                            key={"label" + index}
                            className="btn btn-outline-secondary"
                            htmlFor={"btnradio" + index}
                            onClick={() => table.getColumn("acquisitionYear")?.setFilterValue(year)}
                        >
                            {year}
                        </label>
                    </React.Fragment>
                ))}
            </div>

            <div className='d-flex flex-row justify-content-between py-2'>
                {/* Global Text Search */}
                <DebouncedInput
                    value={globalFilter ?? ''}
                    className='form-control p-2 mx-2'
                    placeholder="Search all columns..."
                    style={{ width: '15rem' }}
                    onChange={value => setGlobalFilter(String(value))}
                />
                <span>
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} task(s) selected
                </span>
                {/* Filter Page Size*/}
                <select
                    className='form-select bg-transparent'
                    aria-label="Page size select"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    style={{ width: '8rem' }}
                >
                    {[10, 20, 30, 50].map((pageSize, index) => (
                        <option key={index} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                {/* Visible Columns*/}
                <div className='dropdown-center'>
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
                                            className="form-check-input"
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
            </div>

            {/* Table */}
            <table className='table table-striped table-hover table-responsive'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {
                                                { asc: '↑', desc: '↓' }[
                                                header.column.getIsSorted() ?? null
                                                ]
                                            }
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody className='table-group-divider'>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <Fragment key={row.id}>
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
                                )
                                }
                            </Fragment>
                        )
                    })}
                </tbody>
            </table>
            {/* Pagination */}
            <div className='d-flex justify-content-center gap-2 btn-group-sm' role="group" aria-label="Basic outlined example">
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
            {/* Statistics */}
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
                <div>{table.getRowModel().rows.length} Rows</div>
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
                className="btn btn-outline-secondary"
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

// eslint-disable-next-line react/prop-types
const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value, debounce, onChange]);

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
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
    )
}
