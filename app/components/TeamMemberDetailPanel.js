"use client";

import { useTasks } from "../context/TaskContext";
import { useTeam } from "../context/TeamContext";
import { X, Briefcase, Mail, Star, AlertCircle, CheckCircle2, Clock, Trash2, Plus, Zap } from "lucide-react";
import TaskCard from "./TaskCard";

export default function TeamMemberDetailPanel({ memberId, onClose }) {
    const { members } = useTeam();
    const { tasks, updateTask } = useTasks();
    const member = (members || []).find(m => m.id === memberId);
    if (!member) return null;

    const memberTasks = (tasks || []).filter(t => t.assigneeId === member.id);
    const todoTasks = memberTasks.filter(t => t.status === 'todo');
    const inProgressTasks = memberTasks.filter(t => t.status === 'in-progress');
    const doneTasks = memberTasks.filter(t => t.status === 'done');

    const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
    const highPriority = memberTasks.filter(t => t.priority === 'high' || t.priority === 'critical').length;

    const handleUpdateTask = (id, updates) => {
        updateTask(id, updates);
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '600px',
                background: 'white',
                boxShadow: '-4px 0 32px rgba(0,0,0,0.15)',
                zIndex: 1100,
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideIn 0.3s ease-out'
            }}
        >
            <style jsx>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>

            {/* Header */}
            <header style={{
                padding: '24px 32px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: member.color || '#333',
                color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        backdropFilter: 'blur(4px)'
                    }}>
                        {member.avatar}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{member.name}</h2>
                        <p style={{ fontSize: '0.85rem', margin: 0, opacity: 0.9 }}>{member.role}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    style={{ background: 'rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer', color: 'white', padding: '8px', borderRadius: '50%' }}
                >
                    <X size={20} />
                </button>
            </header>

            {/* Scrollable Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

                {/* Stats Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ padding: '16px', background: '#f8f8f8', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a1a1a' }}>{memberTasks.length}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Total Tasks</div>
                    </div>
                    <div style={{ padding: '16px', background: '#f8f8f8', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#333' }}>{inProgressTasks.length}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>In Progress</div>
                    </div>
                    <div style={{ padding: '16px', background: '#f8f8f8', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{doneTasks.length}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>Finished</div>
                    </div>
                </div>

                {/* Info Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* Skills & Contact */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', color: '#bbb', letterSpacing: '0.1em', marginBottom: '16px' }}>BIOGRAPHY & SKILLS</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                            {(member.skills || []).map(skill => (
                                <span key={skill} style={{ padding: '4px 12px', background: `${member.color}10`, color: member.color, borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', color: '#666', fontSize: '0.9rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> {member.email}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {member.status}</span>
                        </div>
                    </div>

                    {/* Task Breakdown */}
                    <div>
                        <h4 style={{ fontSize: '0.8rem', color: '#bbb', letterSpacing: '0.1em', marginBottom: '16px' }}>CURRENT FOCUS</h4>

                        {/* Task List (Simplified TaskCards) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#f0f0f0', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                            {memberTasks.filter(t => t.status !== 'done').length === 0 ? (
                                <div style={{ padding: '24px', background: 'white', color: '#999', fontSize: '0.9rem', textAlign: 'center' }}>
                                    No active tasks at the moment.
                                </div>
                            ) : (
                                memberTasks.filter(t => t.status !== 'done').map(task => (
                                    <div key={task.id} style={{ background: 'white', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            background: task.status === 'in-progress' ? '#333' : '#ddd'
                                        }} />
                                        <span style={{ flex: 1, fontSize: '0.95rem', color: '#333' }}>{task.title}</span>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            background: '#f5f5f5',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                            color: '#666'
                                        }}>
                                            {task.clientName || 'No Client'}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Workload Insight */}
                    <div style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <Zap size={18} style={{ color: member.color }} />
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>Workload Insight</h4>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
                            {member.name} is currently managing <strong>{activeTasks} active tasks</strong>.
                            {highPriority > 0 ? ` There are ${highPriority} urgent items that need attention.` : " No urgent items detected."}
                        </p>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <footer style={{ padding: '24px 32px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={onClose}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontWeight: '600' }}
                >
                    Close Profile
                </button>
            </footer>
        </div>
    );
}
