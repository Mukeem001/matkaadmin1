import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Admin, AppSettings, BidListResponse, CreateMarketRequest, CreateNoticeRequest, DashboardStats, DeclareResultRequest, Deposit, ErrorResponse, FetchResultResponse, GameRates, GetBidsParams, GetDepositsParams, GetResultsParams, GetScraperLogsParams, GetUsersParams, GetWithdrawalsParams, HealthStatus, LoginRequest, LoginResponse, Market, MarketAutoConfigRequest, Notice, Result, ScraperLog, ScraperStatus, SignupRequest, SignupResponse, SuccessResponse, UpdateUserRequest, User, UserListResponse, Withdrawal } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Admin login
 */
export declare const getAdminLoginUrl: () => string;
export declare const adminLogin: (loginRequest: LoginRequest, options?: RequestInit) => Promise<LoginResponse>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<LoginRequest>;
export type AdminLoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Admin login
 */
export declare const useAdminLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
/**
 * @summary Register a new user
 */
export declare const getUserSignupUrl: () => string;
export declare const userSignup: (signupRequest: SignupRequest, options?: RequestInit) => Promise<SignupResponse>;
export declare const getUserSignupMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof userSignup>>, TError, {
        data: BodyType<SignupRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof userSignup>>, TError, {
    data: BodyType<SignupRequest>;
}, TContext>;
export type UserSignupMutationResult = NonNullable<Awaited<ReturnType<typeof userSignup>>>;
export type UserSignupMutationBody = BodyType<SignupRequest>;
export type UserSignupMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Register a new user
 */
export declare const useUserSignup: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof userSignup>>, TError, {
        data: BodyType<SignupRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof userSignup>>, TError, {
    data: BodyType<SignupRequest>;
}, TContext>;
/**
 * @summary Get current admin info
 */
export declare const getGetAdminMeUrl: () => string;
export declare const getAdminMe: (options?: RequestInit) => Promise<Admin>;
export declare const getGetAdminMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminMe>>>;
export type GetAdminMeQueryError = ErrorType<unknown>;
/**
 * @summary Get current admin info
 */
export declare function useGetAdminMe<TData = Awaited<ReturnType<typeof getAdminMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get dashboard statistics
 */
export declare const getGetDashboardStatsUrl: () => string;
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/dashboard/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard statistics
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all users
 */
export declare const getGetUsersUrl: (params?: GetUsersParams) => string;
export declare const getUsers: (params?: GetUsersParams, options?: RequestInit) => Promise<UserListResponse>;
export declare const getGetUsersQueryKey: (params?: GetUsersParams) => readonly ["/api/users", ...GetUsersParams[]];
export declare const getGetUsersQueryOptions: <TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<unknown>>(params?: GetUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getUsers>>>;
export type GetUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users
 */
export declare function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<unknown>>(params?: GetUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get user by ID
 */
export declare const getGetUserByIdUrl: (id: number) => string;
export declare const getUserById: (id: number, options?: RequestInit) => Promise<User>;
export declare const getGetUserByIdQueryKey: (id: number) => readonly [`/api/users/${number}`];
export declare const getGetUserByIdQueryOptions: <TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getUserById>>>;
export type GetUserByIdQueryError = ErrorType<unknown>;
/**
 * @summary Get user by ID
 */
export declare function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update user (block/unblock, update wallet)
 */
export declare const getUpdateUserUrl: (id: number) => string;
export declare const updateUser: (id: number, updateUserRequest: UpdateUserRequest, options?: RequestInit) => Promise<User>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: number;
        data: BodyType<UpdateUserRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: number;
    data: BodyType<UpdateUserRequest>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UpdateUserRequest>;
export type UpdateUserMutationError = ErrorType<unknown>;
/**
 * @summary Update user (block/unblock, update wallet)
 */
export declare const useUpdateUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        id: number;
        data: BodyType<UpdateUserRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    id: number;
    data: BodyType<UpdateUserRequest>;
}, TContext>;
/**
 * @summary List all markets
 */
export declare const getGetMarketsUrl: () => string;
export declare const getMarkets: (options?: RequestInit) => Promise<Market[]>;
export declare const getGetMarketsQueryKey: () => readonly ["/api/markets"];
export declare const getGetMarketsQueryOptions: <TData = Awaited<ReturnType<typeof getMarkets>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMarkets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMarkets>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMarketsQueryResult = NonNullable<Awaited<ReturnType<typeof getMarkets>>>;
export type GetMarketsQueryError = ErrorType<unknown>;
/**
 * @summary List all markets
 */
export declare function useGetMarkets<TData = Awaited<ReturnType<typeof getMarkets>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMarkets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new market
 */
export declare const getCreateMarketUrl: () => string;
export declare const createMarket: (createMarketRequest: CreateMarketRequest, options?: RequestInit) => Promise<Market>;
export declare const getCreateMarketMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMarket>>, TError, {
        data: BodyType<CreateMarketRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMarket>>, TError, {
    data: BodyType<CreateMarketRequest>;
}, TContext>;
export type CreateMarketMutationResult = NonNullable<Awaited<ReturnType<typeof createMarket>>>;
export type CreateMarketMutationBody = BodyType<CreateMarketRequest>;
export type CreateMarketMutationError = ErrorType<unknown>;
/**
 * @summary Create a new market
 */
export declare const useCreateMarket: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMarket>>, TError, {
        data: BodyType<CreateMarketRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMarket>>, TError, {
    data: BodyType<CreateMarketRequest>;
}, TContext>;
/**
 * @summary Get market by ID
 */
export declare const getGetMarketByIdUrl: (id: number) => string;
export declare const getMarketById: (id: number, options?: RequestInit) => Promise<Market>;
export declare const getGetMarketByIdQueryKey: (id: number) => readonly [`/api/markets/${number}`];
export declare const getGetMarketByIdQueryOptions: <TData = Awaited<ReturnType<typeof getMarketById>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMarketById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMarketById>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMarketByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getMarketById>>>;
export type GetMarketByIdQueryError = ErrorType<unknown>;
/**
 * @summary Get market by ID
 */
export declare function useGetMarketById<TData = Awaited<ReturnType<typeof getMarketById>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMarketById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update market
 */
export declare const getUpdateMarketUrl: (id: number) => string;
export declare const updateMarket: (id: number, createMarketRequest: CreateMarketRequest, options?: RequestInit) => Promise<Market>;
export declare const getUpdateMarketMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMarket>>, TError, {
        id: number;
        data: BodyType<CreateMarketRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMarket>>, TError, {
    id: number;
    data: BodyType<CreateMarketRequest>;
}, TContext>;
export type UpdateMarketMutationResult = NonNullable<Awaited<ReturnType<typeof updateMarket>>>;
export type UpdateMarketMutationBody = BodyType<CreateMarketRequest>;
export type UpdateMarketMutationError = ErrorType<unknown>;
/**
 * @summary Update market
 */
export declare const useUpdateMarket: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMarket>>, TError, {
        id: number;
        data: BodyType<CreateMarketRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMarket>>, TError, {
    id: number;
    data: BodyType<CreateMarketRequest>;
}, TContext>;
/**
 * @summary Delete market
 */
export declare const getDeleteMarketUrl: (id: number) => string;
export declare const deleteMarket: (id: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteMarketMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMarket>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMarket>>, TError, {
    id: number;
}, TContext>;
export type DeleteMarketMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMarket>>>;
export type DeleteMarketMutationError = ErrorType<unknown>;
/**
 * @summary Delete market
 */
export declare const useDeleteMarket: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMarket>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMarket>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Update market auto-update configuration
 */
export declare const getUpdateMarketAutoConfigUrl: (id: number) => string;
export declare const updateMarketAutoConfig: (id: number, marketAutoConfigRequest: MarketAutoConfigRequest, options?: RequestInit) => Promise<Market>;
export declare const getUpdateMarketAutoConfigMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMarketAutoConfig>>, TError, {
        id: number;
        data: BodyType<MarketAutoConfigRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMarketAutoConfig>>, TError, {
    id: number;
    data: BodyType<MarketAutoConfigRequest>;
}, TContext>;
export type UpdateMarketAutoConfigMutationResult = NonNullable<Awaited<ReturnType<typeof updateMarketAutoConfig>>>;
export type UpdateMarketAutoConfigMutationBody = BodyType<MarketAutoConfigRequest>;
export type UpdateMarketAutoConfigMutationError = ErrorType<unknown>;
/**
 * @summary Update market auto-update configuration
 */
export declare const useUpdateMarketAutoConfig: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMarketAutoConfig>>, TError, {
        id: number;
        data: BodyType<MarketAutoConfigRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMarketAutoConfig>>, TError, {
    id: number;
    data: BodyType<MarketAutoConfigRequest>;
}, TContext>;
/**
 * @summary Manually trigger result fetch for a market
 */
export declare const getFetchMarketResultNowUrl: (id: number) => string;
export declare const fetchMarketResultNow: (id: number, options?: RequestInit) => Promise<FetchResultResponse>;
export declare const getFetchMarketResultNowMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fetchMarketResultNow>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof fetchMarketResultNow>>, TError, {
    id: number;
}, TContext>;
export type FetchMarketResultNowMutationResult = NonNullable<Awaited<ReturnType<typeof fetchMarketResultNow>>>;
export type FetchMarketResultNowMutationError = ErrorType<unknown>;
/**
 * @summary Manually trigger result fetch for a market
 */
export declare const useFetchMarketResultNow: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof fetchMarketResultNow>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof fetchMarketResultNow>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get scraper logs
 */
export declare const getGetScraperLogsUrl: (params?: GetScraperLogsParams) => string;
export declare const getScraperLogs: (params?: GetScraperLogsParams, options?: RequestInit) => Promise<ScraperLog[]>;
export declare const getGetScraperLogsQueryKey: (params?: GetScraperLogsParams) => readonly ["/api/scraper/logs", ...GetScraperLogsParams[]];
export declare const getGetScraperLogsQueryOptions: <TData = Awaited<ReturnType<typeof getScraperLogs>>, TError = ErrorType<unknown>>(params?: GetScraperLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScraperLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getScraperLogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetScraperLogsQueryResult = NonNullable<Awaited<ReturnType<typeof getScraperLogs>>>;
export type GetScraperLogsQueryError = ErrorType<unknown>;
/**
 * @summary Get scraper logs
 */
export declare function useGetScraperLogs<TData = Awaited<ReturnType<typeof getScraperLogs>>, TError = ErrorType<unknown>>(params?: GetScraperLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScraperLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get scraper scheduler status
 */
export declare const getGetScraperStatusUrl: () => string;
export declare const getScraperStatus: (options?: RequestInit) => Promise<ScraperStatus>;
export declare const getGetScraperStatusQueryKey: () => readonly ["/api/scraper/status"];
export declare const getGetScraperStatusQueryOptions: <TData = Awaited<ReturnType<typeof getScraperStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScraperStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getScraperStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetScraperStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getScraperStatus>>>;
export type GetScraperStatusQueryError = ErrorType<unknown>;
/**
 * @summary Get scraper scheduler status
 */
export declare function useGetScraperStatus<TData = Awaited<ReturnType<typeof getScraperStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getScraperStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List results
 */
export declare const getGetResultsUrl: (params?: GetResultsParams) => string;
export declare const getResults: (params?: GetResultsParams, options?: RequestInit) => Promise<Result[]>;
export declare const getGetResultsQueryKey: (params?: GetResultsParams) => readonly ["/api/results", ...GetResultsParams[]];
export declare const getGetResultsQueryOptions: <TData = Awaited<ReturnType<typeof getResults>>, TError = ErrorType<unknown>>(params?: GetResultsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getResults>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetResultsQueryResult = NonNullable<Awaited<ReturnType<typeof getResults>>>;
export type GetResultsQueryError = ErrorType<unknown>;
/**
 * @summary List results
 */
export declare function useGetResults<TData = Awaited<ReturnType<typeof getResults>>, TError = ErrorType<unknown>>(params?: GetResultsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getResults>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Declare a result
 */
export declare const getDeclareResultUrl: () => string;
export declare const declareResult: (declareResultRequest: DeclareResultRequest, options?: RequestInit) => Promise<Result>;
export declare const getDeclareResultMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof declareResult>>, TError, {
        data: BodyType<DeclareResultRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof declareResult>>, TError, {
    data: BodyType<DeclareResultRequest>;
}, TContext>;
export type DeclareResultMutationResult = NonNullable<Awaited<ReturnType<typeof declareResult>>>;
export type DeclareResultMutationBody = BodyType<DeclareResultRequest>;
export type DeclareResultMutationError = ErrorType<unknown>;
/**
 * @summary Declare a result
 */
export declare const useDeclareResult: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof declareResult>>, TError, {
        data: BodyType<DeclareResultRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof declareResult>>, TError, {
    data: BodyType<DeclareResultRequest>;
}, TContext>;
/**
 * @summary List all bids
 */
export declare const getGetBidsUrl: (params?: GetBidsParams) => string;
export declare const getBids: (params?: GetBidsParams, options?: RequestInit) => Promise<BidListResponse>;
export declare const getGetBidsQueryKey: (params?: GetBidsParams) => readonly ["/api/bids", ...GetBidsParams[]];
export declare const getGetBidsQueryOptions: <TData = Awaited<ReturnType<typeof getBids>>, TError = ErrorType<unknown>>(params?: GetBidsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBids>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBids>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBidsQueryResult = NonNullable<Awaited<ReturnType<typeof getBids>>>;
export type GetBidsQueryError = ErrorType<unknown>;
/**
 * @summary List all bids
 */
export declare function useGetBids<TData = Awaited<ReturnType<typeof getBids>>, TError = ErrorType<unknown>>(params?: GetBidsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBids>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List deposit requests
 */
export declare const getGetDepositsUrl: (params?: GetDepositsParams) => string;
export declare const getDeposits: (params?: GetDepositsParams, options?: RequestInit) => Promise<Deposit[]>;
export declare const getGetDepositsQueryKey: (params?: GetDepositsParams) => readonly ["/api/deposits", ...GetDepositsParams[]];
export declare const getGetDepositsQueryOptions: <TData = Awaited<ReturnType<typeof getDeposits>>, TError = ErrorType<unknown>>(params?: GetDepositsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDeposits>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDeposits>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDepositsQueryResult = NonNullable<Awaited<ReturnType<typeof getDeposits>>>;
export type GetDepositsQueryError = ErrorType<unknown>;
/**
 * @summary List deposit requests
 */
export declare function useGetDeposits<TData = Awaited<ReturnType<typeof getDeposits>>, TError = ErrorType<unknown>>(params?: GetDepositsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDeposits>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Approve a deposit
 */
export declare const getApproveDepositUrl: (id: number) => string;
export declare const approveDeposit: (id: number, options?: RequestInit) => Promise<Deposit>;
export declare const getApproveDepositMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveDeposit>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof approveDeposit>>, TError, {
    id: number;
}, TContext>;
export type ApproveDepositMutationResult = NonNullable<Awaited<ReturnType<typeof approveDeposit>>>;
export type ApproveDepositMutationError = ErrorType<unknown>;
/**
 * @summary Approve a deposit
 */
export declare const useApproveDeposit: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveDeposit>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof approveDeposit>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Reject a deposit
 */
export declare const getRejectDepositUrl: (id: number) => string;
export declare const rejectDeposit: (id: number, options?: RequestInit) => Promise<Deposit>;
export declare const getRejectDepositMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rejectDeposit>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof rejectDeposit>>, TError, {
    id: number;
}, TContext>;
export type RejectDepositMutationResult = NonNullable<Awaited<ReturnType<typeof rejectDeposit>>>;
export type RejectDepositMutationError = ErrorType<unknown>;
/**
 * @summary Reject a deposit
 */
export declare const useRejectDeposit: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rejectDeposit>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof rejectDeposit>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List withdrawal requests
 */
export declare const getGetWithdrawalsUrl: (params?: GetWithdrawalsParams) => string;
export declare const getWithdrawals: (params?: GetWithdrawalsParams, options?: RequestInit) => Promise<Withdrawal[]>;
export declare const getGetWithdrawalsQueryKey: (params?: GetWithdrawalsParams) => readonly ["/api/withdrawals", ...GetWithdrawalsParams[]];
export declare const getGetWithdrawalsQueryOptions: <TData = Awaited<ReturnType<typeof getWithdrawals>>, TError = ErrorType<unknown>>(params?: GetWithdrawalsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWithdrawals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWithdrawals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWithdrawalsQueryResult = NonNullable<Awaited<ReturnType<typeof getWithdrawals>>>;
export type GetWithdrawalsQueryError = ErrorType<unknown>;
/**
 * @summary List withdrawal requests
 */
export declare function useGetWithdrawals<TData = Awaited<ReturnType<typeof getWithdrawals>>, TError = ErrorType<unknown>>(params?: GetWithdrawalsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWithdrawals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Approve a withdrawal
 */
export declare const getApproveWithdrawalUrl: (id: number) => string;
export declare const approveWithdrawal: (id: number, options?: RequestInit) => Promise<Withdrawal>;
export declare const getApproveWithdrawalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveWithdrawal>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof approveWithdrawal>>, TError, {
    id: number;
}, TContext>;
export type ApproveWithdrawalMutationResult = NonNullable<Awaited<ReturnType<typeof approveWithdrawal>>>;
export type ApproveWithdrawalMutationError = ErrorType<unknown>;
/**
 * @summary Approve a withdrawal
 */
export declare const useApproveWithdrawal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof approveWithdrawal>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof approveWithdrawal>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Reject a withdrawal
 */
export declare const getRejectWithdrawalUrl: (id: number) => string;
export declare const rejectWithdrawal: (id: number, options?: RequestInit) => Promise<Withdrawal>;
export declare const getRejectWithdrawalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rejectWithdrawal>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof rejectWithdrawal>>, TError, {
    id: number;
}, TContext>;
export type RejectWithdrawalMutationResult = NonNullable<Awaited<ReturnType<typeof rejectWithdrawal>>>;
export type RejectWithdrawalMutationError = ErrorType<unknown>;
/**
 * @summary Reject a withdrawal
 */
export declare const useRejectWithdrawal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof rejectWithdrawal>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof rejectWithdrawal>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get game rates
 */
export declare const getGetGameRatesUrl: () => string;
export declare const getGameRates: (options?: RequestInit) => Promise<GameRates>;
export declare const getGetGameRatesQueryKey: () => readonly ["/api/game-rates"];
export declare const getGetGameRatesQueryOptions: <TData = Awaited<ReturnType<typeof getGameRates>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGameRates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGameRates>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGameRatesQueryResult = NonNullable<Awaited<ReturnType<typeof getGameRates>>>;
export type GetGameRatesQueryError = ErrorType<unknown>;
/**
 * @summary Get game rates
 */
export declare function useGetGameRates<TData = Awaited<ReturnType<typeof getGameRates>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGameRates>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update game rates
 */
export declare const getUpdateGameRatesUrl: () => string;
export declare const updateGameRates: (gameRates: GameRates, options?: RequestInit) => Promise<GameRates>;
export declare const getUpdateGameRatesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGameRates>>, TError, {
        data: BodyType<GameRates>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGameRates>>, TError, {
    data: BodyType<GameRates>;
}, TContext>;
export type UpdateGameRatesMutationResult = NonNullable<Awaited<ReturnType<typeof updateGameRates>>>;
export type UpdateGameRatesMutationBody = BodyType<GameRates>;
export type UpdateGameRatesMutationError = ErrorType<unknown>;
/**
 * @summary Update game rates
 */
export declare const useUpdateGameRates: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGameRates>>, TError, {
        data: BodyType<GameRates>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGameRates>>, TError, {
    data: BodyType<GameRates>;
}, TContext>;
/**
 * @summary List notices
 */
export declare const getGetNoticesUrl: () => string;
export declare const getNotices: (options?: RequestInit) => Promise<Notice[]>;
export declare const getGetNoticesQueryKey: () => readonly ["/api/notices"];
export declare const getGetNoticesQueryOptions: <TData = Awaited<ReturnType<typeof getNotices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNotices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNotices>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNoticesQueryResult = NonNullable<Awaited<ReturnType<typeof getNotices>>>;
export type GetNoticesQueryError = ErrorType<unknown>;
/**
 * @summary List notices
 */
export declare function useGetNotices<TData = Awaited<ReturnType<typeof getNotices>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNotices>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a notice
 */
export declare const getCreateNoticeUrl: () => string;
export declare const createNotice: (createNoticeRequest: CreateNoticeRequest, options?: RequestInit) => Promise<Notice>;
export declare const getCreateNoticeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNotice>>, TError, {
        data: BodyType<CreateNoticeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createNotice>>, TError, {
    data: BodyType<CreateNoticeRequest>;
}, TContext>;
export type CreateNoticeMutationResult = NonNullable<Awaited<ReturnType<typeof createNotice>>>;
export type CreateNoticeMutationBody = BodyType<CreateNoticeRequest>;
export type CreateNoticeMutationError = ErrorType<unknown>;
/**
 * @summary Create a notice
 */
export declare const useCreateNotice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createNotice>>, TError, {
        data: BodyType<CreateNoticeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createNotice>>, TError, {
    data: BodyType<CreateNoticeRequest>;
}, TContext>;
/**
 * @summary Delete a notice
 */
export declare const getDeleteNoticeUrl: (id: number) => string;
export declare const deleteNotice: (id: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteNoticeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNotice>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteNotice>>, TError, {
    id: number;
}, TContext>;
export type DeleteNoticeMutationResult = NonNullable<Awaited<ReturnType<typeof deleteNotice>>>;
export type DeleteNoticeMutationError = ErrorType<unknown>;
/**
 * @summary Delete a notice
 */
export declare const useDeleteNotice: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteNotice>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteNotice>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Get app settings
 */
export declare const getGetSettingsUrl: () => string;
export declare const getSettings: (options?: RequestInit) => Promise<AppSettings>;
export declare const getGetSettingsQueryKey: () => readonly ["/api/settings"];
export declare const getGetSettingsQueryOptions: <TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof getSettings>>>;
export type GetSettingsQueryError = ErrorType<unknown>;
/**
 * @summary Get app settings
 */
export declare function useGetSettings<TData = Awaited<ReturnType<typeof getSettings>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSettings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update app settings
 */
export declare const getUpdateSettingsUrl: () => string;
export declare const updateSettings: (appSettings: AppSettings, options?: RequestInit) => Promise<AppSettings>;
export declare const getUpdateSettingsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<AppSettings>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<AppSettings>;
}, TContext>;
export type UpdateSettingsMutationResult = NonNullable<Awaited<ReturnType<typeof updateSettings>>>;
export type UpdateSettingsMutationBody = BodyType<AppSettings>;
export type UpdateSettingsMutationError = ErrorType<unknown>;
/**
 * @summary Update app settings
 */
export declare const useUpdateSettings: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSettings>>, TError, {
        data: BodyType<AppSettings>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSettings>>, TError, {
    data: BodyType<AppSettings>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map