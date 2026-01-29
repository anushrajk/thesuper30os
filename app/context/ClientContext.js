"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CLIENTS } from '../data/clients';

const ClientContext = createContext();

export function ClientProvider({ children }) {
    const [clients, setClients] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('agency_clients');
                if (saved) return JSON.parse(saved);
            } catch (error) {
                console.error('Error parsing client data from localStorage:', error);
            }
        }
        return INITIAL_CLIENTS;
    });

    // Persistence and Cross-Tab Sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'agency_clients' && e.newValue) {
                try {
                    setClients(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Error parsing updated client data from storage event:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('agency_clients', JSON.stringify(clients));
        }
    }, [clients]);

    const addClient = (client) => {
        const newClient = {
            ...client,
            id: `c${Date.now()}`,
            createdAt: new Date().toISOString(),
            stage: client.stage || 'inquiry',
            health: client.health || 'On Track'
        };
        setClients(prev => [...prev, newClient]);
    };

    const updateClient = (id, updates) => {
        setClients(prev => prev.map(c => {
            if (c.id === id) {
                const updated = { ...c, ...updates };

                // Automation: If moved to 'closed'
                if (updates.stage === 'closed' && c.stage !== 'closed') {
                    updated.onboardingDate = new Date().toISOString();
                    updated.status = 'Active';
                }

                return updated;
            }
            return c;
        }));
    };

    const deleteClient = (id) => {
        setClients(prev => prev.filter(c => c.id !== id));
    };

    const getClientById = (id) => clients.find(c => c.id === id);

    return (
        <ClientContext.Provider value={{
            clients,
            addClient,
            updateClient,
            deleteClient,
            getClientById
        }}>
            {children}
        </ClientContext.Provider>
    );
}

export const useClients = () => useContext(ClientContext);
