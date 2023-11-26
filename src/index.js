import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TaskTable from './TaskTable';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (!root) throw new Error('Failed to find the root element')

root.render(
  <React.StrictMode>
    <div className='container-xl'>
      <h2 className='p-3 text-center'>Tasks traking table</h2>
      <TaskTable
        getRowCanExpand={() => true}
        enableFacetedValues={() => true}
      />
    </div>
  </React.StrictMode>
);