import { baseApi } from "shared/api";
import type { Task } from "../model/types";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], void>({
      query: () => "todos",
      transformResponse: (response: Task[]) => response,
      providesTags: ["Tasks"],
    }),
  }),
});

export const { useGetTasksQuery } = tasksApi;
