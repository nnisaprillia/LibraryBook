export type LoanStatus = 'returned' | 'borrowed';
export type LoanFilter = 'all' | 'borrowed' | 'returned';

export interface Loan {
  id: string;
  borrowerName: string;
  bookTitle: string;
  borrowDate: string;
  isReturned: boolean;
}

export interface LoanState {
  loans: Loan[];
  filter: LoanFilter;
}

export type LoanAction =
  | { type: 'ADD_LOAN'; payload: Omit<Loan, 'id' | 'isReturned'> }
  | { type: 'TOGGLE_RETURN'; payload: { id: string } }
  | { type: 'DELETE_LOAN'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: LoanFilter };
