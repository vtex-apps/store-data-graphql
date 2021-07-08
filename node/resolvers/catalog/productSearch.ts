import { path, zip } from 'ramda'
import { IOResponse } from '@vtex/api'
import { Functions } from '@gocommerce/utils'

interface ProductSearchParent {
  productsRaw: IOResponse<Product[]>
  translatedArgs: SearchArgs
  searchMetaData: {
    titleTag: string | null
    metaTagDescription: string | null
  },
  pageInfo: {
    from?: number
    to?: number
  }
}

export const resolvers = {
  ProductSearch: {
    titleTag: path(['searchMetaData', 'titleTag']),
    metaTagDescription: path(['searchMetaData', 'metaTagDescription']),
    recordsFiltered: ({ productsRaw }: ProductSearchParent) => {
      const {
        headers: { resources },
      } = productsRaw

      const quantity = resources.split('/')[1]

      return parseInt(quantity, 10)
    },
    pagination: ({ productsRaw, pageInfo }: ProductSearchParent) => {
      const {
        headers: { resources },
      } = productsRaw
      
      const from = pageInfo && pageInfo.from? pageInfo.from: 0
      const to = pageInfo && pageInfo.to? pageInfo.to: 0

      const total = resources.split('/')
      const perPage = (to > from)? to - from + 1: 0
  
       return {
        total: total && total.length > 1? total[1]: 0,
        perPage,
        page: perPage? Math.ceil(from / perPage) + 1 : 0,
      }
    },
    products: path(['productsRaw', 'data']),
    breadcrumb: async (
      { translatedArgs, productsRaw: { data: products } }: ProductSearchParent,
      _: any,
      { vtex: { account }, clients: { catalog } }: Context
    ) => {
      const query = translatedArgs.query || ''
      const map = translatedArgs.map || ''
      const queryAndMap = zip(
        query.toLowerCase().split('/').map(decodeURIComponent),
        map.split(',')
      )

      const categoriesSearched = queryAndMap
        .filter(([_, m]) => m === 'c')
        .map(([q]) => q)

      const categoriesCount = map.split(',').filter((m) => m === 'c').length
      const categories =
        !!categoriesCount && Functions.isGoCommerceAcc(account)
          ? await catalog.categories(categoriesCount)
          : []

      return queryAndMap.map(
        ([queryUnit, mapUnit]: [string, string], index: number) => ({
          queryUnit,
          mapUnit,
          index,
          queryArray: query.split('/'),
          mapArray: map.split(','),
          categories,
          categoriesSearched,
          products,
        })
      )
    },
  },
}
