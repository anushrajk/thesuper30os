"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CAMPAIGNS } from '../data/campaigns';

const CampaignContext = createContext();

export function CampaignProvider({ children }) {
    // Initialize campaigns from localStorage or fall back to mock data
    const [campaigns, setCampaigns] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('agency_campaigns');
                if (saved) return JSON.parse(saved);
            } catch (error) {
                console.error('Error parsing campaign data from localStorage:', error);
            }
        }
        return INITIAL_CAMPAIGNS;
    });

    // Persistence and Cross-Tab Sync
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'agency_campaigns' && e.newValue) {
                try {
                    setCampaigns(JSON.parse(e.newValue));
                } catch (error) {
                    console.error('Error parsing updated campaign data from storage event:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('agency_campaigns', JSON.stringify(campaigns));
        }
    }, [campaigns]);

    const addCampaign = (campaign) => {
        const newCampaign = {
            ...campaign,
            id: `camp_${Date.now()}`,
            status: campaign.status || 'active'
        };
        setCampaigns(prev => [...prev, newCampaign]);
    };

    const updateCampaign = (id, updates) => {
        setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCampaign = (id) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
    };

    const getCampaignsByClient = (clientId) => campaigns.filter(c => c.clientId === clientId);

    return (
        <CampaignContext.Provider value={{
            campaigns,
            addCampaign,
            updateCampaign,
            deleteCampaign,
            getCampaignsByClient
        }}>
            {children}
        </CampaignContext.Provider>
    );
}

export const useCampaigns = () => useContext(CampaignContext);
