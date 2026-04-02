import { createSlice } from '@reduxjs/toolkit'

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    role: localStorage.getItem('vaultiq_role') || 'viewer',
  },
  reducers: {
    setRole(state, action) {
      state.role = action.payload
      localStorage.setItem('vaultiq_role', action.payload)
    },
  },
})

export const { setRole } = roleSlice.actions
export default roleSlice.reducer
