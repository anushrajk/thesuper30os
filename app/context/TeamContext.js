"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_TEAM } from '../data/team';

const TeamContext = createContext();

export function TeamProvider({ children }) {
    const [members, setMembers] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('agency_team');
            if (saved) return JSON.parse(saved);
        }
        return INITIAL_TEAM;
    });

    // Persistence and Cross-Tab Sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'agency_team' && e.newValue) {
                setMembers(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('agency_team', JSON.stringify(members));
        }
    }, [members]);

    const addMember = (member) => {
        const newMember = {
            type: 'agency', // Default to agency
            ...member,
            id: Date.now().toString(),
            status: 'Active',
            avatar: (member.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        };
        setMembers(prev => [...prev, newMember]);
    };

    const updateMember = (id, updates) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const deleteMember = (id) => {
        setMembers(prev => prev.filter(m => m.id !== id));
    };

    const getMemberById = (id) => members.find(m => m.id === id);

    const getClientTeam = (clientId) => {
        return members.filter(m => m.type === 'client' && m.clientId === clientId);
    };

    const getAgencyTeam = () => {
        return members.filter(m => m.type === 'agency');
    };

    return (
        <TeamContext.Provider value={{
            members,
            addMember,
            updateMember,
            deleteMember,
            getMemberById,
            getClientTeam,
            getAgencyTeam
        }}>
            {children}
        </TeamContext.Provider>
    );
}

export const useTeam = () => {
    const context = useContext(TeamContext);
    if (!context) {
        return {
            members: [],
            addMember: () => { },
            updateMember: () => { },
            deleteMember: () => { },
            getMemberById: () => null,
            getClientTeam: () => [],
            getAgencyTeam: () => []
        };
    }
    return context;
};
