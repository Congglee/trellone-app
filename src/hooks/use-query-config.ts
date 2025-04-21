import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '~/constants/pagination'
import { useQueryParams } from '~/hooks/use-query-params'
import { CommonQueryParams } from '~/types/query-params.type'

export type QueryConfig<T = CommonQueryParams> = {
  [key in keyof T]: string
}

export const useQueryConfig = <T = CommonQueryParams>() => {
  const queryParams = useQueryParams()

  // Cast the queryParams to the generic type
  const queryConfig: QueryConfig<T> = omitBy(
    {
      ...queryParams,
      page: queryParams.page || DEFAULT_PAGINATION_PAGE,
      limit: queryParams.limit || DEFAULT_PAGINATION_LIMIT
    },
    isUndefined
  ) as QueryConfig<T>

  return queryConfig
}
