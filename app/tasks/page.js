"use client";

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useTasks } from '../context/TaskContext';
import { useClients } from '../context/ClientContext';
import { TASK_STATUSES } from '../data/tasks';
import { Plus, Filter, CheckCircle2, Clock, Circle, Trash2, Eye } from 'lucide-react';
import ActionMenu from '../components/ActionMenu';

export default function TasksPage() {
    const { tasks, addTask, openTask, deleteTask } = useTasks();
    const { clients, getClientById } = useClients();
    const [filterClient, setFilterClient] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredTasks = (tasks || []).map(task => {
        // Resolve client name dynamically if it's missing or to ensure it's up to date
        const client = getClientById(task.clientId);
        return {
            ...task,
            clientName: client ? client.name : (task.clientName || 'Unknown Client')
        };
    }).filter(task => {
        if (filterClient !== 'all' && task.clientId !== filterClient) return false;
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        return true;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done': return <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />;
            case 'in-progress': return <Clock size={18} style={{ color: 'var(--warning)' }} />;
            default: return <Circle size={18} style={{ color: '#ccc' }} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#dc2626';
            case 'medium': return '#f59e0b';
            default: return '#9ca3af';
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
            <Sidebar />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', overflow: 'hidden' }}>
                <header style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>All Tasks</h2>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{filteredTasks.length} tasks</p>
                    </div>
                    <button
                        onClick={() => {
                            const newTask = addTask({ title: '', status: 'todo' });
                            openTask(newTask.id);
                        }}
                        style={{ padding: '10px 20px', borderRadius: '8px', background: 'black', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <Plus size={18} /> New Task
                    </button>
                </header>

                {/* Filters */}
                <div style={{ padding: '16px 40px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <Filter size={18} color="#666" />
                    <select
                        value={filterClient}
                        onChange={(e) => setFilterClient(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    >
                        <option value="all">All Clients</option>
                        {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                    >
                        <option value="all">All Statuses</option>
                        {TASK_STATUSES.map(s => (
                            <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Task List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', fontSize: '0.8rem', color: '#666' }}>STATUS</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', fontSize: '0.8rem', color: '#666' }}>TASK</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', fontSize: '0.8rem', color: '#666' }}>CLIENT</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', fontSize: '0.8rem', color: '#666' }}>ASSIGNEE</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', fontSize: '0.8rem', color: '#666' }}>DUE DATE</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', fontSize: '0.8rem', color: '#666' }}>PRIORITY</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: '600', fontSize: '0.8rem', color: '#666' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(task => (
                                <tr key={task.id} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                                    <td style={{ padding: '16px 20px' }}>{getStatusIcon(task.status)}</td>
                                    <td style={{ padding: '16px 20px', fontWeight: '500' }}>{task.title}</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{task.clientName}</span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: task.assigneeColor || '#eee',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                color: task.assigneeColor ? 'white' : '#666'
                                            }}>
                                                {task.assigneeInitials || (task.assignee ? task.assignee.charAt(0) : '?')}
                                            </div>
                                            <span>{task.assigneeName || task.assignee || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#666' }}>{task.dueDate}</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '8px', height: '8px',
                                            borderRadius: '50%',
                                            background: getPriorityColor(task.priority),
                                            marginRight: '6px'
                                        }}></span>
                                        <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <ActionMenu
                                            actions={[
                                                {
                                                    label: 'Open Task',
                                                    icon: <Eye size={14} />,
                                                    onClick: () => openTask(task.id)
                                                },
                                                {
                                                    label: 'Delete Task',
                                                    icon: <Trash2 size={14} />,
                                                    onClick: (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Delete task?')) deleteTask(task.id);
                                                    },
                                                    danger: true
                                                }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTasks.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
                            No tasks found matching your filters.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
