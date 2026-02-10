import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loans: [],
    selectedLoan: null,
    applications: [],
};

const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        setLoans: (state, action) => {
            state.loans = action.payload;
        },
        setSelectedLoan: (state, action) => {
            state.selectedLoan = action.payload;
        },
        setApplications: (state, action) => {
            state.applications = action.payload;
        },
    },
});

export const { setLoans, setSelectedLoan, setApplications } = loanSlice.actions;
export default loanSlice.reducer;
