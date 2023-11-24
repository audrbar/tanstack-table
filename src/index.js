import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TaskTable from './TaskTable';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='container-xl'>
      <h2 className='p-3 text-center'>Tasks traking table</h2>
      <TaskTable />
    </div>
  </React.StrictMode>
);