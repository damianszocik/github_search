import axios from "axios";
import { debounce } from "lodash";
import { Option, SearchFunction } from "../components/Autocomplete/types";

export type GitHubApiResponse<T> = {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
};

export type RepositoryResponse = {
  name: string;
  html_url: string;
  id: number;
};
export type UserResponse = {
  login: string;
  html_url: string;
  id: number;
};

const USERS_SERARCH_API_URL = "https://api.github.com/search/users",
  REPOSITORIES_SEARCH_API_URL = "https://api.github.com/search/repositories";

const getReponseError = (rejectionReason: unknown) =>
  axios.isAxiosError(rejectionReason)
    ? `: ${rejectionReason.response?.data.message || rejectionReason.response}`
    : "";

const search: SearchFunction = async (
  query,
  resultsSetter,
  loadingSetter,
  errorsSetter,
  additionalCallback
) => {
  const requestParams = {
    params: { q: query, per_page: 50 },
  };

  const repositoriesRequest = axios.get<GitHubApiResponse<RepositoryResponse>>(
    REPOSITORIES_SEARCH_API_URL,
    requestParams
  );
  const usersRequest = axios.get<GitHubApiResponse<UserResponse>>(
    USERS_SERARCH_API_URL,
    requestParams
  );

  const [repositoriesFetchResults, usersFetchResults] =
    await Promise.allSettled([repositoriesRequest, usersRequest]);

  const combinedResults: Option[] = [];
  const errors: string[] = [];

  if (repositoriesFetchResults.status === "rejected") {
    errors.push(
      "Failed to fetch repositories" +
        getReponseError(repositoriesFetchResults.reason)
    );
  } else {
    combinedResults.push(
      ...repositoriesFetchResults.value.data.items.map(
        ({ name, html_url, id }) => ({
          label: name,
          url: html_url,
          id,
          type: "repository" as const,
        })
      )
    );
  }

  if (usersFetchResults.status === "rejected") {
    errors.push(
      "Failed to fetch users" + getReponseError(usersFetchResults.reason)
    );
  } else {
    combinedResults.push(
      ...usersFetchResults.value.data.items.map(({ login, html_url, id }) => ({
        label: login,
        url: html_url,
        id,
        type: "user" as const,
      }))
    );
  }

  const sortedResults = combinedResults.sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  errorsSetter(errors);
  resultsSetter(sortedResults);
  loadingSetter(false);
  additionalCallback?.();
};

export const getOptions = debounce(search, 2000);
