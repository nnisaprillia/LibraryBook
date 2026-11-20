import React, { createContext, useContext, useMemo, useReducer, ReactNode } from 'react';
import { loanReducer, initialState } from '@/reducers/loanReducer';
import { Loan, LoanAction, LoanState } from '@/types';

interface LoanContextValue {
  state: LoanState;
  dispatch: React.Dispatch<LoanAction>;
  totalLoans: number;
  borrowedCount: number;
  returnedCount: number;
  filteredLoans: Loan[];
}

const LoanContext = createContext<LoanContextValue | undefined>(undefined);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  const value = useMemo(() => {
    const returnedCount = state.loans.filter((l) => l.isReturned).length;
    const filteredLoans = state.loans.filter((l) => {
      if (state.filter === 'all') return true;
      if (state.filter === 'returned') return l.isReturned;
      return !l.isReturned;
    });
    return {
      state,
      dispatch,
      totalLoans: state.loans.length,
      returnedCount,
      borrowedCount: state.loans.length - returnedCount,
      filteredLoans,
    };
  }, [state]);

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
}

export function useLoans() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error('useLoans harus dipakai di dalam LoanProvider');
  return ctx;
}
