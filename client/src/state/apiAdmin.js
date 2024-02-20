import { 
  createApi, 
  fetchBaseQuery 
} from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  tagTypes: [
    "Users",
    "UsersChats",
    "UsersContacts",
    "Webs",
    "Mobiles",
  ],
  endpoints: (build) => ({
    getUsers: build.query({
      query: ({
        search,
        filter,        
        sort,
        page,
        pageSize
      }) => ({ 
        url: "users",
        method: "GET",
        params: { 
          search,
          filter,          
          sort,
          page,
          pageSize
        },
      }),
      providesTags: ["Users"],
    }),
    getUsersChats: build.query({
      query: ({
        search,
        filter,        
        sort,
      }) => ({ 
        url: "users/chats",
        method: "GET",
        params: { 
          search,
          filter,
          sort,
        },
      }),
      providesTags: ["UsersChats"],
    }),
    getUsersContacts: build.query({
      query: ({
        search,
        filter,        
        sort,
      }) => ({ 
        url: "users/contacts",
        method: "GET",
        params: { 
          search,
          filter,
          sort,
        },
      }),
      providesTags: ["UsersContacts"],
    }),
    getWebs: build.query({
      query: ({
        search,
        filter,
        sort,
        page,
        pageSize
      }) => ({ 
        url: "webs",
        method: "GET",
        params: { 
          search,
          filter,
          sort,
          page,
          pageSize
        },
      }),
      providesTags: ["Webs"],
    }),
    getMobiles: build.query({
      query: ({
        search,
        filter,        
        sort,
        page,
        pageSize
      }) => ({ 
        url: "mobiles",
        method: "GET",
        params: { 
          search,
          filter,          
          sort,
          page,
          pageSize
        },
      }),
      providesTags: ["Mobiles"],
    }),
    // getUser: build.query({
    //   query: (id) => `general/user/${id}`,
    //   providesTags: ["User"],
    // }),
    // getSales: build.query({
    //   query: () => "sales/sales",
    //   providesTags: ["Sales"],
    // }),
    // * Agriggate (Joining Multiple Table)
    // getUserPerformance: build.query({
    //   query: (id) => `management/performance/${id}`,
    //   providesTags: ["Performance"],
    // }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUsersChatsQuery,
  useGetUsersContactsQuery,
  useGetWebsQuery,
  useGetMobilesQuery,
} = api;
