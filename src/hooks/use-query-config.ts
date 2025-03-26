import { isUndefined, omitBy } from 'lodash'
import useQueryParams from '~/hooks/use-query-params'
import { CommonQueryParams } from '~/types/query-params.type'

export type QueryConfig<T = CommonQueryParams> = {
  [key in keyof T]: string
}

export default function useQueryConfig<T = CommonQueryParams>() {
  const queryParams = useQueryParams()

  // Cast the queryParams to the generic type
  const queryConfig: QueryConfig<T> = omitBy({ ...queryParams }, isUndefined) as QueryConfig<T>

  return queryConfig
}
