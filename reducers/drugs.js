import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: [], token: null },
};

export const drugsSlice = createSlice({
  name: 'drugs',
  initialState,
  reducers: {

  addLastSearch: (state, action) => {
    state.value.search = action.payload;
  },

  },
});

export const { addLastSearch } = drugsSlice.actions;
export default drugsSlice.reducer;
