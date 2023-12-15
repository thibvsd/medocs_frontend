import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { search: [], token: null },
};

export const drugSlice = createSlice({
  name: 'drug',
  initialState,
  reducers: {

  addLastSearch: (state, action) => {
    state.value.search = action.payload;
  },

  },
});

export const { addLastSearch } = drugSlice.actions;
export default drugSlice.reducer;
