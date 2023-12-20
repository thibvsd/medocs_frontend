import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { token: null, email: null, username: null },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      console.log('reducer payload', action.payload);
      state.value.token = action.payload.token;
      state.value.username = action.payload.username;
      state.value.email = action.payload.email;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.username = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
<<<<<<< HEAD
export default userSlice.reducer;
=======
export default userSlice.reducer;
>>>>>>> 855d0940b92d608c2251e2216c2b5dd6adcf29bb
