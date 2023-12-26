import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TaskTable from './TaskTable';
import TableExp from './TableExp';
import GanttChart from './GanttChart';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (!root) throw new Error('Failed to find the root element')

root.render(
  <React.StrictMode>
    <div className='container-xl'>
      <h2 className='p-3 text-center'>Table Expandable</h2>
      <TableExp />
      <h2 className='p-3 text-center'>Tasks traking table</h2>
      <TaskTable
        getRowCanExpand={() => true}
        enableFacetedValues={() => true}
      />
      <GanttChart
      />
    </div>
  </React.StrictMode>
);