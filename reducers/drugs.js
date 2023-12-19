import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: "", favo: "", token: null },
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

export const { addLastSearch, addFavorite } = drugsSlice.actions;
export default drugsSlice.reducer;
