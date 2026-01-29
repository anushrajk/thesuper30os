"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REQUESTS } from '../data/requests';
import { useTasks } from './TaskContext';
import { useTeam } from './TeamContext';
import { useClients } from './ClientContext';

const RequestContext = createContext();

export function RequestProvider({ children }) {
    const { addTask } = useTasks();
    const { getMemberById } = useTeam();
    const { getClientById } = useClients();
    const [requests, setRequests] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('molten_requests');
            if (saved) return JSON.parse(saved);
        }
        return INITIAL_REQUESTS;
    });

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'molten_requests' && e.newValue) {
                setRequests(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('molten_requests', JSON.stringify(requests));
        }
    }, [requests]);

    const addRequest = (requestData) => {
        const newRequest = {
            id: `r-${Date.now()}`,
            status: 'Pending',
            createdAt: new Date().toISOString(),
            ...requestData
        };
        setRequests(prev => [...prev, newRequest]);
        return newRequest;
    };

    const updateRequest = (requestId, updates) => {
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, ...updates } : r));
    };

    const approveRequest = (requestId, agencyMemberId) => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        const member = getMemberById(agencyMemberId);
        if (!member) return;

        const client = getClientById(request.clientId);

        // Create Agency Task
        addTask({
            title: request.title,
            clientId: request.clientId,
            clientName: client ? client.name : 'Unknown Client',
            status: 'todo',
            priority: request.priority || 'medium',
            assignee: member.name,
            assigneeInitials: member.avatar,
            assigneeColor: member.color,
            taskType: request.type || 'New Work',
            ownerRole: 'Agency',
            description: request.details,
            dueDate: new Date().toISOString().split('T')[0] // Default to today
        });

        // Update Request Status
        updateRequest(requestId, { status: 'Approved' });
    };

    const rejectRequest = (requestId, reason) => {
        updateRequest(requestId, { status: 'Rejected', rejectionReason: reason });
    };

    const getClientRequests = (clientId) => {
        return requests.filter(r => r.clientId === clientId);
    };

    return (
        <RequestContext.Provider value={{
            requests,
            addRequest,
            updateRequest,
            approveRequest,
            rejectRequest,
            getClientRequests
        }}>
            {children}
        </RequestContext.Provider>
    );
}

export function useRequests() {
    const context = useContext(RequestContext);
    if (!context) {
        throw new Error('useRequests must be used within a RequestProvider');
    }
    return context;
}
