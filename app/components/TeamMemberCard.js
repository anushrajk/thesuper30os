"use client";

import { Mail, Briefcase, Award, Zap, AlertCircle, Clock, Trash2, Eye } from "lucide-react";
import { useTeam } from "../context/TeamContext";
import { useTasks } from "../context/TaskContext";
import ActionMenu from "./ActionMenu";

export default function TeamMemberCard({ member, onClick }) {
    const { tasks } = useTasks();
    const { deleteMember } = useTeam();

    // Calculate stats
    const memberTasks = (tasks || []).filter(t => t.assigneeId === member.id);
    const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
    const highPriority = memberTasks.filter(t => t.priority === 'high' || t.priority === 'critical').length;
    const completedToday = memberTasks.filter(t => {
        if (t.status !== 'done') return false;
        const today = new Date().toLocaleDateString();
        const updated = new Date(t.updatedAt || Date.now()).toLocaleDateString();
        return today === updated;
    }).length;

    return (
        <div
            onClick={onClick}
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #efefef',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.borderColor = member.color || '#333';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.05)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#efefef';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Workload Indicator Bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: member.color || '#333',
                opacity: 0.8
            }} />

            {/* Header: Avatar & Info */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: member.color || '#333',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    {member.avatar}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: '#1a1a1a' }}>{member.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={12} /> {member.role}
                    </p>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <ActionMenu
                        actions={[
                            {
                                label: 'View Profile',
                                icon: <Eye size={14} />,
                                onClick: onClick
                            },
                            {
                                label: 'Remove from Team',
                                icon: <Trash2 size={14} />,
                                onClick: (e) => {
                                    e.stopPropagation();
                                    if (confirm(`Remove ${member.name} from team?`)) deleteMember(member.id);
                                },
                                danger: true
                            }
                        ]}
                    />
                </div>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {(member.skills || []).map(skill => (
                    <span key={skill} style={{
                        fontSize: '0.7rem',
                        background: '#f8f8f8',
                        color: '#666',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        border: '1px solid #eee'
                    }}>
                        {skill}
                    </span>
                ))}
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                marginTop: '8px',
                padding: '12px',
                background: '#fafafa',
                borderRadius: '8px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>{activeTasks}</div>
                    <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase' }}>Active</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: highPriority > 0 ? '#ef4444' : '#333' }}>
                        {highPriority}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase' }}>Urgent</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>{completedToday}</div>
                    <div style={{ fontSize: '0.65rem', color: '#999', textTransform: 'uppercase' }}>Today</div>
                </div>
            </div>

            {/* Status Footer */}
            <div style={{
                marginTop: 'auto',
                paddingTop: '12px',
                borderTop: '1px solid #f5f5f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{
                    fontSize: '0.75rem',
                    color: member.status === 'Active' ? '#10b981' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '600'
                }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
                    {member.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#999' }}>{member.email}</span>
            </div>
        </div>
    );
}
