import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: "", token: null, ShowSearchResults: false, favo: "" },
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

  },
});

export const { addLastSearch, addFavorite, addSearchQuery } = drugsSlice.actions;
export default drugsSlice.reducer;
