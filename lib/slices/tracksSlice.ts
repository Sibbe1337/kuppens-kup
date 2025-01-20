import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Track } from '@/types/track'
import { fetchTracks } from '@/lib/api'

interface TracksState {
  items: Track[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: TracksState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchTracksAsync = createAsyncThunk(
  'tracks/fetchTracks',
  async () => {
    const response = await fetchTracks()
    return response
  }
)

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracksAsync.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchTracksAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTracksAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Something went wrong'
      })
  },
})

export default tracksSlice.reducer

