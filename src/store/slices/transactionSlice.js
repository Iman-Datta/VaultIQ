import { createSlice } from '@reduxjs/toolkit'
import { mockTransactions } from '../../data/mockData'

const stored = localStorage.getItem('vaultiq_transactions')
const initialState = {
  transactions: stored ? JSON.parse(stored) : mockTransactions,
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(state, action) {
      state.transactions.unshift({ ...action.payload, id: Date.now().toString() })
      localStorage.setItem('vaultiq_transactions', JSON.stringify(state.transactions))
    },
    editTransaction(state, action) {
      const idx = state.transactions.findIndex(t => t.id === action.payload.id)
      if (idx !== -1) state.transactions[idx] = action.payload
      localStorage.setItem('vaultiq_transactions', JSON.stringify(state.transactions))
    },
    deleteTransaction(state, action) {
      state.transactions = state.transactions.filter(t => t.id !== action.payload)
      localStorage.setItem('vaultiq_transactions', JSON.stringify(state.transactions))
    },
  },
})

export const { addTransaction, editTransaction, deleteTransaction } = transactionSlice.actions
export default transactionSlice.reducer
