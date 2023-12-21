import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  value: {
    token: string | null;
    email: string | null;
    username: string | null;
    photos: string[];
  };
};

const initialState : UserState = {
  value: { token: null, email: null, username: null, photos: [],
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
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
    addPhoto: (state, action: PayloadAction<string>) => {
      console.log('reducer payload', action.payload);
      state.value.photos.push(action.payload);
    },
    removePhoto: (state, action: PayloadAction<string>) => {
      state.value.photos = state.value.photos.filter((data) => data !== action.payload);
    },
  },
});

export const { login, logout, addPhoto } = userSlice.actions;

export default userSlice.reducer;
