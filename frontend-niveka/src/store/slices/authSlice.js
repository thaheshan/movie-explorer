import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

// 🔐 LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const { error, data } = await authService.login(email, password);

    if (error) return rejectWithValue(error.message);
    return data;
  }
);

// 🔐 SIGNUP
export const signUpUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    const { error, data } = await authService.signUp(email, password);

    if (error) return rejectWithValue(error.message);
    return data;
  }
);

// 🔐 RESET PASSWORD
export const resetPassword = createAsyncThunk(
  "auth/reset",
  async (email, { rejectWithValue }) => {
    const { error } = await authService.resetPassword(email);

    if (error) return rejectWithValue(error.message);
    return "Reset link sent 📩";
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    message: "",
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = "Login successful 🎬";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signUpUser.fulfilled, (state) => {
        state.message = "Check your email 🎉";
      })

      // RESET
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

