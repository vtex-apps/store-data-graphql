import { Functions } from '@gocommerce/utils'
import { NotFoundError, ResolverWarning, UserInputError } from '@vtex/api'
import {
  compose,
  equals,
  filter,
  head,
  isEmpty,
  isNil,
  join,
  map,
  path,
  prop,
  split,
  test,
  toLower,
  zip,
} from 'ramda'

import { resolvers as autocompleteResolvers } from './autocomplete'
import { resolvers as brandResolvers } from './brand'
import { resolvers as categoryResolvers } from './category'
import { resolvers as discountResolvers } from './discount'
import { resolvers as facetsResolvers } from './facets'
import { resolvers as itemMetadataResolvers } from './itemMetadata'
import { resolvers as itemMetadataUnitResolvers } from './itemMetadataUnit'
import { resolvers as itemMetadataPriceTableItemResolvers } from './itemMetadataPriceTableItem'
import { resolvers as offerResolvers } from './offer'
import { resolvers as productResolvers } from './product'
import { resolvers as productSearchResolvers } from './productSearch'
import { resolvers as recommendationResolvers } from './recommendation'
import { resolvers as searchResolvers } from './search'
import { resolvers as breadcrumbResolvers } from './searchBreadcrumb'
import { resolvers as skuResolvers } from './sku'
import {
  CatalogCrossSellingTypes,
  findCategoryInTree,
  getBrandFromSlug,
  searchContextGetCategory,
  translatePageType,
} from './utils'
import { catalogSlugify } from './slug'

interface SearchContext {
  brand: string | null
  category: string | number | null
  contextKey: string
}

interface SearchContextParams {
  brand?: string
  department?: string
  category?: string
  subcategory?: string
}

interface SearchMetadataArgs {
  query?: string | null
  map?: string | null
}

interface ProductIndentifier {
  field: 'id' | 'slug' | 'ean' | 'reference' | 'sku'
  value: string
}

interface ProductArgs {
  slug?: string
  identifier?: ProductIndentifier
}

interface PageTypeArgs {
  path: string
  query: string
}

enum CrossSellingInput {
  view = 'view',
  buy = 'buy',
  similars = 'similars',
  viewAndBought = 'viewAndBought',
  suggestions = 'suggestions',
  accessories = 'accessories',
}

interface ProductRecommendationArg {
  identifier?: ProductIndentifier
  type?: CrossSellingInput
}

interface ProductsByIdentifierArgs {
  field: 'id' | 'ean' | 'reference' | 'sku'
  values: [string]
}

const inputToCatalogCrossSelling = {
  [CrossSellingInput.buy]: CatalogCrossSellingTypes.whoboughtalsobought,
  [CrossSellingInput.view]: CatalogCrossSellingTypes.whosawalsosaw,
  [CrossSellingInput.similars]: CatalogCrossSellingTypes.similars,
  [CrossSellingInput.viewAndBought]: CatalogCrossSellingTypes.whosawalsobought,
  [CrossSellingInput.accessories]: CatalogCrossSellingTypes.accessories,
  [CrossSellingInput.suggestions]: CatalogCrossSellingTypes.suggestions,
}

const brandFromList = async (
  slug: string,
  catalog: Context['clients']['catalog']
) => {
  const brandFromList = await getBrandFromSlug(toLower(slug), catalog)

  return brandFromList ? brandFromList.id : null
}

const getBrandId = async (
  brand: string | undefined,
  catalog: Context['clients']['catalog'],
  isVtex: boolean,
  logger: Context['clients']['logger']
) => {
  if (!brand) {
    return null
  }

  if (!isVtex) {
    return brandFromList(brand, catalog)
  }

  const slugified = catalogSlugify(brand)
  const brandPagetype = await catalog.pageType(slugified).catch(() => null)

  if (!brandPagetype) {
    logger.info(`brand ${brand}, slug ${slugified}`, 'pagetype-brand-error')
  }

  if (!brandPagetype || brandPagetype.pageType !== 'Brand') {
    return brandFromList(brand, catalog)
  }

  return brandPagetype.id
}

type TupleString = [string, string]

const isTupleMap = compose<TupleString, string, boolean>(equals('c'), prop('1'))

const categoriesOnlyQuery = compose<
  TupleString[],
  TupleString[],
  string[],
  string
>(join('/'), map(prop('0')), filter(isTupleMap))

const getAndParsePagetype = async (path: string, ctx: Context) => {
  const pagetype = await ctx.clients.catalog.pageType(path).catch(() => null)

  if (!pagetype) {
    return { titleTag: null, metaTagDescription: null }
  }

  return {
    titleTag: pagetype.title || pagetype.name,
    metaTagDescription: pagetype.metaTagDescription,
  }
}

const getCategoryMetadata = async (
  { map, query }: SearchMetadataArgs,
  ctx: Context
) => {
  const {
    vtex: { account },
  } = ctx

  const queryAndMap: TupleString[] = zip(
    (query || '').split('/'),
    (map || '').split(',')
  )

  const cleanQuery = categoriesOnlyQuery(queryAndMap)

  if (Functions.isGoCommerceAcc(account)) {
    // GoCommerce does not have pagetype query implemented yet
    const category =
      findCategoryInTree(
        await queries.categories(
          {},
          { treeLevel: cleanQuery.split('/').length },
          ctx
        ),
        cleanQuery.split('/')
      ) || {}

    return {
      metaTagDescription: path(['MetaTagDescription'], category),
      titleTag: path(['Title'], category) || path(['Name'], category),
    }
  }

  return getAndParsePagetype(cleanQuery, ctx)
}

const getBrandMetadata = async (
  { query }: SearchMetadataArgs,
  ctx: Context
) => {
  const {
    vtex: { account },
    clients: { catalog },
  } = ctx

  const cleanQuery = head(split('/', query || '')) || ''

  if (Functions.isGoCommerceAcc(account)) {
    const brand = (await getBrandFromSlug(toLower(cleanQuery), catalog)) || {}

    return {
      metaTagDescription: path(['metaTagDescription'], brand),
      titleTag: path(['title'], brand) || path(['name'], brand),
    }
  }

  return getAndParsePagetype(cleanQuery, ctx)
}

/**
 * Get metadata of category/brand APIs
 *
 * @param _
 * @param args
 * @param ctx
 */
const getSearchMetaData = async (
  _: any,
  args: SearchMetadataArgs,
  ctx: Context
) => {
  const map = args.map || ''
  const firstMap = head(map.split(','))

  if (firstMap === 'c') {
    return getCategoryMetadata(args, ctx)
  }

  if (firstMap === 'b') {
    return getBrandMetadata(args, ctx)
  }

  return { titleTag: null, metaTagDescription: null }
}

const translateToStoreDefaultLanguage = async (
  clients: Context['clients'],
  term: string
): Promise<any> => {
  const { segment, messagesGraphQL } = clients
  const [{ cultureInfo: to }, { cultureInfo: from }] = await Promise.all([
    segment.getSegmentByToken(null),
    segment.getSegment(),
  ])

  return from && from !== to
    ? messagesGraphQL
        .translateV2({
          indexedByFrom: [
            {
              from,
              messages: [{ content: term }],
            },
          ],
          to,
        })
        .then(head)
    : term
}

export const fieldResolvers = {
  ...autocompleteResolvers,
  ...brandResolvers,
  ...categoryResolvers,
  ...facetsResolvers,
  ...itemMetadataResolvers,
  ...itemMetadataUnitResolvers,
  ...itemMetadataPriceTableItemResolvers,
  ...offerResolvers,
  ...discountResolvers,
  ...productResolvers,
  ...recommendationResolvers,
  ...searchResolvers,
  ...skuResolvers,
  ...breadcrumbResolvers,
  ...productSearchResolvers,
}

const isValidProductIdentifier = (identifier: ProductIndentifier | undefined) =>
  !!identifier && !isNil(identifier.value) && !isEmpty(identifier.value)

export const queries = {
  autocomplete: async (_: any, args: any, ctx: Context) => {
    const {
      clients: { catalog },
      clients,
    } = ctx

    const translatedTerm = await translateToStoreDefaultLanguage(
      clients,
      args.searchTerm
    )

    const { itemsReturned } = await catalog.autocomplete({
      maxRows: args.maxRows,
      searchTerm: translatedTerm,
    })

    return {
      cacheId: args.searchTerm,
      itemsReturned,
    }
  },

  facets: async (
    _: any,
    { facets, query, map, hideUnavailableItems }: FacetsArgs,
    ctx: Context
  ) => {
    const {
      clients: { catalog },
      clients,
    } = ctx

    if (facets && facets.includes('undefined')) {
      throw new UserInputError('Bad facets parameter provided')
    }

    let result
    const translatedQuery = await translateToStoreDefaultLanguage(
      clients,
      query
    )

    const segmentData = ctx.vtex.segment
    const salesChannel = (segmentData && segmentData.channel.toString()) || ''

    const unavailableString = hideUnavailableItems
      ? `&fq=isAvailablePerSalesChannel_${salesChannel}:1`
      : ''

    if (facets) {
      result = await catalog.facets(facets)
    } else {
      result = await catalog.facets(
        `${translatedQuery}?map=${map}${unavailableString}`
      )
    }

    result.queryArgs = {
      query: translatedQuery,
      map,
    }

    return result
  },

  product: async (_: any, rawArgs: ProductArgs, ctx: Context) => {
    const {
      vtex: { account },
      clients: { catalog },
    } = ctx

    const args =
      rawArgs &&
      isValidProductIdentifier(rawArgs.identifier) &&
      !Functions.isGoCommerceAcc(account)
        ? rawArgs
        : { identifier: { field: 'slug', value: rawArgs.slug! } }

    if (!args.identifier) {
      throw new UserInputError('No product identifier provided')
    }

    const { field, value } = args.identifier
    let products = [] as Product[]

    switch (field) {
      case 'id':
        products = await catalog.productById(value)
        break

      case 'slug':
        products = await catalog.product(value)
        break

      case 'ean':
        products = await catalog.productByEan(value)
        break

      case 'reference':
        products = await catalog.productByReference(value)
        break

      case 'sku':
        products = await catalog.productBySku([value])
        break
    }

    if (products.length > 0) {
      return head(products)
    }

    throw new NotFoundError(
      `No product was found with requested ${field} ${JSON.stringify(args)}`
    )
  },

  products: async (_: any, args: SearchArgs, ctx: Context) => {
    const {
      clients: { catalog },
    } = ctx

    const queryTerm = args.query

    if (queryTerm == null || test(/[?&[\]=]/, queryTerm)) {
      throw new UserInputError(
        `The query term contains invalid characters. query=${queryTerm}`
      )
    }

    if (args.to && args.to > 2500) {
      throw new UserInputError(
        `The maximum value allowed for the 'to' argument is 2500`
      )
    }

    return catalog.products(args)
  },

  productsByIdentifier: async (
    _: any,
    args: ProductsByIdentifierArgs,
    ctx: Context
  ) => {
    const {
      clients: { catalog },
    } = ctx

    let products = [] as Product[]
    const { field, values } = args

    switch (field) {
      case 'id':
        products = await catalog.productsById(values)
        break

      case 'ean':
        products = await catalog.productsByEan(values)
        break

      case 'reference':
        products = await catalog.productsByReference(values)
        break

      case 'sku':
        products = await catalog.productBySku(values)
        break
    }

    if (products.length > 0) {
      return products
    }

    throw new NotFoundError(`No products were found with requested ${field}`)
  },

  productSearch: async (_: any, args: SearchArgs, ctx: Context) => {
    const {
      clients,
      clients: { catalog },
    } = ctx

    const queryTerm = args.query

    if (queryTerm == null || test(/[?&[\]=]/, queryTerm)) {
      throw new UserInputError(
        `The query term contains invalid characters. query=${queryTerm}`
      )
    }

    if (args.to && args.to > 2500) {
      throw new UserInputError(
        `The maximum value allowed for the 'to' argument is 2500`
      )
    }

    const query = await translateToStoreDefaultLanguage(
      clients,
      args.query || ''
    )

    const translatedArgs = {
      ...args,
      query,
    }

    const [productsRaw, searchMetaData] = await Promise.all([
      catalog.products(args, true),
      getSearchMetaData(_, translatedArgs, ctx),
    ])

    return {
      translatedArgs,
      searchMetaData,
      productsRaw,
      pageInfo: { from: args.from, to: args.to }
    }
  },

  brand: async (
    _: any,
    { id }: { id?: number },
    { clients: { catalog } }: Context
  ) => {
    if (id == null) {
      throw new ResolverWarning(`No brand ID provided`)
    }

    const brand = await catalog.brand(id)

    if (!brand) {
      throw new NotFoundError(`Brand not found`)
    }

    return brand
  },

  brands: async (_: any, __: any, { clients: { catalog } }: Context) =>
    catalog.brands(),

  category: async (
    _: any,
    { id }: { id?: number },
    { clients: { catalog } }: Context
  ) => {
    if (id == null) {
      throw new ResolverWarning(`No category ID provided`)
    }

    return catalog.category(id)
  },

  categories: async (
    _: any,
    { treeLevel }: { treeLevel: number },
    { clients: { catalog } }: Context
  ) => catalog.categories(treeLevel),

  /** TODO: This method should be removed in the next major.
   * @author Bruno Dias
   */
  search: async (_: any, args: any, ctx: Context) => {
    const { map, query } = args

    if (query == null || map == null) {
      throw new UserInputError('Search query/map cannot be null')
    }

    const { titleTag, metaTagDescription }: any = await getSearchMetaData(
      _,
      args,
      ctx
    )

    return {
      metaTagDescription,
      queryArgs: args,
      titleTag,
    }
  },

  searchContextFromParams: async (
    _: any,
    args: SearchContextParams,
    { clients: { catalog, logger }, vtex: { account } }: Context
  ) => {
    const isVtex = !Functions.isGoCommerceAcc(account)
    const response: SearchContext = {
      brand: null,
      category: null,
      contextKey: 'search',
    }

    const [brandId, categoryId] = await Promise.all<
      string | null,
      string | number | null
    >([
      getBrandId(args.brand, catalog, isVtex, logger),
      searchContextGetCategory(args, catalog, isVtex, logger),
    ])

    response.brand = brandId
    response.category = categoryId

    return response
  },

  pageType: async (_: any, { path, query }: PageTypeArgs, ctx: Context) => {
    const response = await ctx.clients.catalog.pageType(path, query)

    return {
      id: response.id,
      type: translatePageType(response.pageType),
    }
  },

  productRecommendations: async (
    _: any,
    { identifier, type }: ProductRecommendationArg,
    ctx: Context
  ) => {
    if (identifier == null || type == null) {
      throw new UserInputError('Wrong input provided')
    }

    const catalogType = inputToCatalogCrossSelling[type]
    let productId = identifier.value

    if (identifier.field !== 'id') {
      const product = await queries.product(_, { identifier }, ctx)

      productId = product!.productId
    }

    return ctx.clients.catalog.crossSelling(productId, catalogType)
  },

  searchMetadata: async (_: any, args: SearchMetadataArgs, ctx: Context) => {
    const { clients } = ctx
    const queryTerm = args.query

    if (queryTerm == null || test(/[?&[\]=]/, queryTerm)) {
      throw new UserInputError(
        `The query term contains invalid characters. query=${queryTerm}`
      )
    }

    const query = await translateToStoreDefaultLanguage(
      clients,
      args.query || ''
    )

    const translatedArgs = {
      ...args,
      query,
    }

    return getSearchMetaData(_, translatedArgs, ctx)
  },
}
