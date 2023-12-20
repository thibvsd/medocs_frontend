import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: "", favo: "", token: null, ShowSearchResults:false },
};

export const drugsSlice = createSlice({
  name: 'drugs',
  initialState,
  reducers: {

  addLastSearch: (state, action) => {
    state.value.search = action.payload;
  },
  addFavorite: (state, action) => {
    state.value.favo = action.payload;
  },
  removeFavorite: (state, action) => {
    state.value.favo = state.value.filter(favo => favo._id !== action.payload._id);
  }
  },
});

export const { addLastSearch, addSearchQuery, addFavorite } = drugsSlice.actions;
export default drugsSlice.reducer;
