import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',

  initialState: {
    searchQuery: '',
    typeFilter: 'all',   // 'all' | 'income' | 'expense'
    sortField: 'date',   // 'date' | 'amount'
    sortDir: 'desc',     // 'asc' | 'desc'
  },
  
  reducers: {
    setSearch(state, action)     { state.searchQuery = action.payload },
    setTypeFilter(state, action) { state.typeFilter = action.payload },
    setSortField(state, action)  { state.sortField = action.payload },
    setSortDir(state, action)    { state.sortDir = action.payload },
    resetFilters(state) {
      state.searchQuery = ''
      state.typeFilter = 'all'
      state.sortField = 'date'
      state.sortDir = 'desc'
    },
  },
})

export const { setSearch, setTypeFilter, setSortField, setSortDir, resetFilters } = filterSlice.actions
export default filterSlice.reducer
