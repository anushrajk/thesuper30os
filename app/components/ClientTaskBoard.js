"use client";

import { useState } from 'react';
import { DndContext, closestCorners, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskColumn from './TaskColumn';

export default function ClientTaskBoard({ clientId }) {
    const { getClientTasks, addTask, insertTaskAfter, updateTask, deleteTask } = useTasks();
    const tasks = getClientTasks(clientId);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleUpdateTask = (id, updates) => {
        updateTask(id, updates);
    };

    const handleAddNext = (currentId) => {
        const currentTask = tasks.find(t => t.id === currentId);
        insertTaskAfter(currentId, {
            title: '',
            status: currentTask ? currentTask.status : 'todo',
            clientId: clientId, // Auto-link to this client
            isNew: true
        });
    };

    const handleRemoveTask = (id) => {
        deleteTask(id);
    };

    const handleAddFirst = (statusColumn) => {
        addTask({
            title: '',
            status: statusColumn,
            dueDate: new Date().toISOString().split('T')[0],
            clientId: clientId, // Auto-link to this client
            isNew: true
        });
    };

    const handleDragStart = (event) => setActiveId(event.active.id);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) { setActiveId(null); return; }

        const activeTask = tasks.find(t => t.id === active.id);
        const overId = over.id;

        if (activeTask && activeTask.isNew) {
            updateTask(active.id, { isNew: false });
        }

        const statusMap = {
            'ToDo': 'todo',
            'InProgress': 'in-progress',
            'Done': 'done'
        };

        const isColumn = Object.keys(statusMap).includes(overId);

        if (isColumn) {
            updateTask(active.id, { status: statusMap[overId] });
        } else {
            const overTask = tasks.find(t => t.id === overId);
            if (overTask && activeTask.status !== overTask.status) {
                updateTask(active.id, { status: overTask.status });
            }
        }
        setActiveId(null);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>

            <TaskColumn
                id="ToDo"
                title="To Do"
                tasks={tasks.filter(t => t.status === 'todo')}
                onUpdate={handleUpdateTask}
                onAddNext={handleAddNext}
                onRemove={handleRemoveTask}
                onAddFirst={() => handleAddFirst('todo')}
                className="flex-1"
                hideClientPicker={true}
            />

            <TaskColumn
                id="InProgress"
                title="In Progress"
                tasks={tasks.filter(t => t.status === 'in-progress')}
                onUpdate={handleUpdateTask}
                onAddNext={handleAddNext}
                onRemove={handleRemoveTask}
                onAddFirst={() => handleAddFirst('in-progress')}
                className="flex-1"
                hideClientPicker={true}
            />

            <TaskColumn
                id="Done"
                title="Done"
                tasks={tasks.filter(t => t.status === 'done')}
                onUpdate={handleUpdateTask}
                onAddNext={handleAddNext}
                onRemove={handleRemoveTask}
                onAddFirst={() => handleAddFirst('done')}
                className="flex-1"
                hideClientPicker={true}
            />

            <DragOverlay>
                {activeId ? <TaskCard task={tasks.find(t => t.id === activeId)} isOverlay showClientName={false} hideClientPicker={true} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
