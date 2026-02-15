'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
    solanaBalance: number;
    deductSolana: (amount: number) => boolean;
    canAfford: (amount: number) => boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const INITIAL_BALANCE = 0.68;
const REPORT_COST = 0.015;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [solanaBalance, setSolanaBalance] = useState(INITIAL_BALANCE);

    const deductSolana = (amount: number): boolean => {
        if (solanaBalance >= amount) {
            setSolanaBalance(prev => prev - amount);
            return true;
        }
        return false;
    };

    const canAfford = (amount: number): boolean => {
        return solanaBalance >= amount;
    };

    return (
        <CurrencyContext.Provider value={{ 
            solanaBalance, 
            deductSolana, 
            canAfford 
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}

export { REPORT_COST };
