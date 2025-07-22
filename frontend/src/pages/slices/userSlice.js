import { USERS_URL } from "../../constants.js";
import { apiSlice } from "./apiSlice.js";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: userData,
      }),
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userSlice;
