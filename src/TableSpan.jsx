import React from 'react';
import { data } from "./data";

const deps = new Set();
const tasksByDep = new Map();
const functionsByTasks = new Map();

data.forEach((item) => {
    const tasks = tasksByDep.get(item.dep) || new Set();
    const functions = functionsByTasks.get(item.task) || new Set();
    deps.add(item.dep);
    tasks.add(item.task);
    functions.add(item.name);
    tasksByDep.set(item.dep, tasks);
    functionsByTasks.set(item.task, functions);
});

console.log('data: ', data)
console.log('tasksByDep: ', tasksByDep)
console.log('functionsByTasks: ', functionsByTasks)

const TableSpan = () => {
    return (
        <main>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Dep</th>
                        <th scope="col">Task</th>
                        <th scope="col">Function</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(deps).map((dep) => {
                        const tasks = Array.from(tasksByDep.get(dep));
                        const depFunctionsTotal = tasks.reduce(
                            (acc, task) => acc + functionsByTasks.get(task).size,
                            0,
                        );
                        return tasks.map((task, taskId) => {
                            const functions = Array.from(functionsByTasks.get(task));
                            return functions.map((func, funcId) => {
                                return (
                                    <tr key={func}>
                                        {!taskId && !funcId && (
                                            <td rowSpan={depFunctionsTotal}>{dep}</td>
                                        )}
                                        {!funcId && <td rowSpan={functions.length}>{task}</td>}
                                        <td>{func}</td>
                                    </tr>
                                );
                            });
                        });
                    })}
                </tbody>
            </table>
        </main>
    )
}

export default TableSpan
