import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User } from '@/types/user'
import { fetchUserData } from '@/lib/api'

interface UserState {
  data: User | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UserState = {
  data: null,
  status: 'idle',
  error: null,
}

export const fetchUserDataAsync = createAsyncThunk(
  'user/fetchUserData',
  async (userId: string) => {
    const response = await fetchUserData(userId)
    return response
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDataAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUserDataAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchUserDataAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export const { logout } = userSlice.actions
export default userSlice.reducer

