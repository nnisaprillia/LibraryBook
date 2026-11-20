import { LoanAction, LoanState } from '@/types';

export const initialState: LoanState = {
  loans: [
    { id: '1', borrowerName: 'Andi Pratama', bookTitle: 'Laskar Pelangi', borrowDate: '2026-11-02', isReturned: false },
    { id: '2', borrowerName: 'Siti Rahma', bookTitle: 'Bumi Manusia', borrowDate: '2026-11-05', isReturned: true },
    { id: '3', borrowerName: 'Budi Santoso', bookTitle: 'Filosofi Teras', borrowDate: '2026-11-10', isReturned: false },
    { id: '4', borrowerName: 'Dewi Lestari', bookTitle: 'Atomic Habits', borrowDate: '2026-11-12', isReturned: true },
  ],
  filter: 'all',
};

export function loanReducer(state: LoanState, action: LoanAction): LoanState {
  switch (action.type) {
    case 'ADD_LOAN':
      return {
        ...state,
        loans: [
          { id: Date.now().toString(), isReturned: false, ...action.payload },
          ...state.loans,
        ],
      };
    case 'TOGGLE_RETURN':
      return {
        ...state,
        loans: state.loans.map((l) =>
          l.id === action.payload.id ? { ...l, isReturned: !l.isReturned } : l
        ),
      };
    case 'DELETE_LOAN':
      return { ...state, loans: state.loans.filter((l) => l.id !== action.payload.id) };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}
