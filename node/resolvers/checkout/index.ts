import { compose, forEach, reject, path } from 'ramda'

import { headers, withAuthToken } from '../headers'
import httpResolver from '../httpResolver'
import { queries as logisticsQueries } from '../logistics/index'
import paths from '../paths'
import { fieldResolvers as slasResolvers } from './checkoutSLA'

import { resolvers as assemblyOptionsItemResolvers } from './assemblyOptionItem'
import {
  addOptionsForItems,
  buildAssemblyOptionsMap,
  isParentItem,
} from './attachmentsHelper'
import { resolvers as orderFormItemResolvers } from './orderFormItem'
import paymentTokenResolver from './paymentTokenResolver'
import { fieldResolvers as shippingFieldResolvers } from './shipping'

import { CHECKOUT_COOKIE, parseCookie } from '../../utils'
import { UserInputError } from '@vtex/api'
import { LogisticPickupPoint } from '../logistics/types'
import logisticPickupResolvers from '../logistics/fieldResolvers'

const SetCookieWhitelist = [CHECKOUT_COOKIE, '.ASPXAUTH']

const isWhitelistedSetCookie = (cookie: string) => {
  const [key] = cookie.split('=')
  return SetCookieWhitelist.includes(key)
}

/**
 * It will convert an integer to float moving the
 * float point two positions left.
 *
 * The OrderForm REST API return an integer
 * colapsing the floating point into the integer
 * part. We needed to make a convention of the product
 * price on different API's. Once the Checkout API
 * returns an integer instead of a float, and the
 * Catalog API returns a float.
 *
 * @param int An integer number
 */
const convertIntToFloat = (int: number) => int * 0.01

interface AddItemArgs {
  orderFormId?: string
  items?: OrderFormItemInput[]
  utmParams?: UTMParams
  utmiParams?: UTMIParams
}

interface SkuPickupSLAListArgs {
  itemId: string
  seller: string
  lat: string
  long: string
  country: string
}

interface SkuPickupSLAArgs extends SkuPickupSLAListArgs {
  pickupId: string
}

interface SLAFromLogistics {
  id: string
  shippingEstimate: null
  pickupStoreInfo: {
    friendlyName: string
    address: CheckoutAddress
  }
}

const checkouSlaFromLogisticPickup = (logisticPickup: LogisticPickupPoint): SLAFromLogistics => {
  return {
    id: logisticPickup.id,
    shippingEstimate: null,
    pickupStoreInfo: {
      friendlyName: logisticPickup.name,
      address: {
        ...logisticPickupResolvers.PickupPoint.address(logisticPickup),
        geoCoordinates: [logisticPickup.address.location.longitude, logisticPickup.address.location.latitude]
      }
    }
  }
}

type AllSLAs = SLAItem | SLAFromLogistics

const shouldUpdateMarketingData = (
  orderFormMarketingTags: OrderFormMarketingData | null,
  utmParams?: UTMParams,
  utmiParams?: UTMIParams,
) => {
  const {
    utmCampaign = null,
    utmMedium = null,
    utmSource = null,
    utmiCampaign = null,
    utmiPart = null,
    utmipage = null,
  } = orderFormMarketingTags || {}

  if (!utmParams?.campaign && !utmParams?.medium && !utmParams?.campaign && !utmiParams?.campaign && !utmiParams?.page && !utmiParams?.part) {
    // Avoid updating at any costs if all fields are invalid
    return false
  }

  return (
    ((utmParams?.source ?? null) !== utmSource) ||
    ((utmParams?.medium ?? null) !== utmMedium) ||
    ((utmParams?.campaign ?? null) !== utmCampaign) ||
    ((utmiParams?.part ?? null) !== utmiPart) ||
    ((utmiParams?.page ?? null) !== utmipage) ||
    ((utmiParams?.campaign ?? null) !== utmiCampaign)
  )
}

type Resolver<TArgs = any, TRoot = any> = (
  root: TRoot,
  args: TArgs,
  context: Context
) => Promise<any>

export const fieldResolvers = {
  OrderForm: {
    cacheId: (orderForm: OrderForm) => {
      return orderForm.orderFormId
    },
    items: (orderForm: OrderForm) => {
      const childs = reject(isParentItem, orderForm.items)
      const assemblyOptionsMap = buildAssemblyOptionsMap(orderForm)
      return orderForm.items.map((item, index) => ({
        ...item,
        assemblyOptionsData: {
          assemblyOptionsMap,
          childs,
          index,
          orderForm,
        },
      }))
    },
    pickupPointCheckedIn: (orderForm: OrderForm, _: any, ctx: Context) => {
      const { isCheckedIn, checkedInPickupPointId } = orderForm
      if (!isCheckedIn || !checkedInPickupPointId) {
        return null
      }
      return logisticsQueries.pickupPoint(
        {},
        { id: checkedInPickupPointId },
        ctx
      )
    },
    value: (orderForm: OrderForm) => {
      return convertIntToFloat(orderForm.value)
    },
  },
  ...assemblyOptionsItemResolvers,
  ...orderFormItemResolvers,
  ...shippingFieldResolvers,
  ...slasResolvers,
}

const replaceDomain = (host: string) => (cookie: string) =>
  cookie.replace(/domain=.+?(;|$)/, `domain=${host};`)

export async function syncWithStoreLocale(
  orderForm: OrderForm,
  cultureInfo: string,
  checkout: Context['clients']['checkout']
) {
  const clientPreferencesData = orderForm.clientPreferencesData || {
    locale: cultureInfo,
  }

  const shouldUpdateClientPreferencesData =
    cultureInfo &&
    clientPreferencesData.locale &&
    cultureInfo !== clientPreferencesData.locale

  if (shouldUpdateClientPreferencesData) {
    const newClientPreferencesData = {
      ...clientPreferencesData,
    }

    newClientPreferencesData.locale = cultureInfo

    try {
      return await checkout.updateOrderFormClientPreferencesData(
        orderForm.orderFormId,
        newClientPreferencesData
      )
    } catch (e) {
      console.error(e)
      return orderForm
    }
  }

  return orderForm
}

export async function setCheckoutCookies(rawHeaders: Record<string, any>, ctx: Context) {
  const responseSetCookies: string[] =
    (rawHeaders && rawHeaders['set-cookie']) || []

  const host = ctx.get('x-forwarded-host')
  const forwardedSetCookies = responseSetCookies.filter(
    isWhitelistedSetCookie
  )
  const parseAndClean = compose(
    parseCookie,
    replaceDomain(host)
  )
  const cleanCookies = forwardedSetCookies.map(parseAndClean)
  forEach(
    ({ name, value, options }) => ctx.cookies.set(name, value, options),
    cleanCookies
  )
}

export const queries: Record<string, Resolver> = {
  orderForm: async (_, __, ctx) => {
    const {
      clients: { checkout },
      vtex: { segment },
    } = ctx

    const { headers, data } = await checkout.orderFormRaw()

    const orderForm = await syncWithStoreLocale(
      data,
      segment!.cultureInfo,
      checkout
    )

    setCheckoutCookies(headers, ctx)

    return orderForm
  },

  orders: (_, __, { clients: { checkout } }) => {
    return checkout.orders()
  },

  shipping: (_, args: any, { clients: { checkout } }) => {
    return checkout.simulation(args)
  },

  skuPickupSLAs: async (
    _: any,
    { itemId, seller, lat, long, country }: SkuPickupSLAListArgs,
    { clients: { checkout, logistics } }: Context
  ) => {
    const simulationPayload = {
      items: [
        {
          id: itemId,
          seller,
          quantity: 1,
        },
      ],
      country,
      shippingData: {
        selectedAddresses: [
          {
            geoCoordinates: [long, lat],
            country,
          },
        ],
      },
    }

    const [simulation, allPickupsOutput] = await Promise.all([checkout.simulation(simulationPayload), logistics.nearPickupPoints(lat, long)])

    const slas = simulation?.logisticsInfo?.[0]?.slas ?? []
    const slasPickup = slas.filter(sla => sla.deliveryChannel === 'pickup-in-point') as AllSLAs[]

    const slaIdsSet = slasPickup.reduce(
      (acc, { pickupStoreInfo }) => {
        if (pickupStoreInfo.address?.addressId) {
          acc.add(pickupStoreInfo.address.addressId)
        }
        return acc
      },
      new Set<string>()
    )

    allPickupsOutput.items.forEach(logisticItem => {
      if (logisticItem.isActive && !slaIdsSet.has(logisticItem.id)) {
        const checkouSla = checkouSlaFromLogisticPickup(logisticItem)
        slasPickup.push(checkouSla)
      }
    })

    return slasPickup
  },

  skuPickupSLA: async (
    _: any,
    { itemId, seller, lat, long, country, pickupId }: SkuPickupSLAArgs,
    ctx: Context
  ) => {
    const slas = (await queries.skuPickupSLAs(
      {},
      { itemId, seller, lat, long, country },
      ctx
    )) as SLA[]

    return slas.find(
      s => path(['pickupStoreInfo', 'address', 'addressId'], s) === pickupId
    )
  },
}

interface UTMParams {
  campaign?: string
  medium?: string
  source?: string
}

interface UTMIParams {
  campaign?: string
  part?: string
  page?: string
}

export const mutations: Record<string, Resolver> = {
  addItem: async (_, { orderFormId, items, utmParams, utmiParams }: AddItemArgs, ctx: Context) => {
    const {
      clients: { checkout },
    } = ctx
    if (orderFormId == null || items == null) {
      throw new UserInputError('No order form id or items to add provided')
    }

    if (ctx.vtex.orderFormId !== orderFormId) {
      ctx.vtex.logger.warn(`Different orderFormId found: provided=${orderFormId} and in cookies=${ctx.vtex.orderFormId}`)
    }

    const { marketingData, items: previousItems } = await checkout.orderForm()

    if (shouldUpdateMarketingData(marketingData, utmParams, utmiParams)) {
      const newMarketingData = {
        ...(marketingData || {}),
      }
      newMarketingData.utmCampaign = utmParams?.campaign
      newMarketingData.utmMedium = utmParams?.medium
      newMarketingData.utmSource = utmParams?.source
      newMarketingData.utmiCampaign = utmiParams?.campaign
      newMarketingData.utmiPart = utmiParams?.part
      newMarketingData.utmipage = utmiParams?.page

      if (newMarketingData.marketingTags == null) {
        delete newMarketingData.marketingTags
      } else if (Array.isArray(newMarketingData.marketingTags)) {
        newMarketingData.marketingTags = newMarketingData.marketingTags.filter(
          Boolean
        )
      }

      const atLeastOneValidField = Object.values(newMarketingData).some(value => {
        if (value == null || value === '') {
          return false
        }
        if (Array.isArray(value) && value.length === 0) {
          return false
        }
        return true
      })

      // If all fields of newMarketingData are invalid, it causes checkout to answer with an error 400
      if (atLeastOneValidField) {
        try {
          await checkout.updateOrderFormMarketingData(orderFormId, newMarketingData)
        } catch (e) {
          ctx.vtex.logger.error({
            message: 'Error when updating orderformmarketing data',
            id: orderFormId,
            chkArgs: JSON.stringify(newMarketingData),
            graphqlArgs: JSON.stringify({ utmParams, utmiParams })
          })
        }

      }
    }

    const cleanItems = items.map(({ options, ...rest }) => rest)
    const withOptions = items.filter(
      ({ options }) => !!options && options.length > 0
    )

    const addItem = await checkout.addItem(orderFormId, cleanItems)

    await addOptionsForItems(withOptions, checkout, addItem, previousItems)

    return withOptions.length === 0 ? addItem : await checkout.orderForm()
  },

  addOrderFormPaymentToken: paymentTokenResolver,

  cancelOrder: async (
    _,
    { orderFormId, reason },
    { clients: { checkout } }
  ) => {
    await checkout.cancelOrder(orderFormId, reason)
    return true
  },

  createPaymentSession: httpResolver({
    enableCookies: true,
    headers: withAuthToken(headers.json),
    method: 'POST',
    secure: true,
    url: paths.gatewayPaymentSession,
  }),

  createPaymentTokens: httpResolver({
    data: ({ payments }: any) => payments,
    enableCookies: true,
    headers: withAuthToken(headers.json),
    method: 'POST',
    url: paths.gatewayTokenizePayment,
  }),

  setOrderFormCustomData: (
    _,
    { orderFormId, appId, field, value },
    { clients: { checkout } }
  ) => {
    return checkout.setOrderFormCustomData(orderFormId, appId, field, value)
  },

  updateItems: (_, { orderFormId, items, splitItem }, { clients: { checkout }, vtex }) => {
    if (vtex.orderFormId !== orderFormId) {
      vtex.logger.warn(`Different orderFormId found: provided=${orderFormId} and in cookies=${vtex.orderFormId}`)
    }
    return checkout.updateItems(orderFormId, items, splitItem)
  },

  updateOrderFormIgnoreProfile: (
    _,
    { orderFormId, ignoreProfileData },
    { clients: { checkout } }
  ) => {
    return checkout.updateOrderFormIgnoreProfile(orderFormId, ignoreProfileData)
  },

  updateOrderFormPayment: (
    _,
    { orderFormId, payments },
    { clients: { checkout } }
  ) => {
    return checkout.updateOrderFormPayment(orderFormId, payments)
  },

  updateOrderFormProfile: (
    _,
    { orderFormId, fields },
    { clients: { checkout } }
  ) => {
    return checkout.updateOrderFormProfile(orderFormId, fields)
  },

  updateOrderFormShipping: async (_, { orderFormId, address }, ctx) => {
    const {
      clients: { checkout },
    } = ctx
    return checkout.updateOrderFormShipping(orderFormId, {
      clearAddressIfPostalCodeNotFound: false,
      selectedAddresses: [address],
    })
  },

  addAssemblyOptions: (
    _,
    { orderFormId, itemId, assemblyOptionsId, options },
    { clients: { checkout } }
  ) => {
    const body = {
      composition: {
        items: options,
      },
      noSplitItem: true,
    }
    return checkout.addAssemblyOptions(
      orderFormId,
      itemId,
      assemblyOptionsId,
      body
    )
  },

  updateOrderFormCheckin: (
    _,
    { orderFormId, checkin }: any,
    { clients: { checkout } }
  ) => {
    return checkout.updateOrderFormCheckin(orderFormId, checkin)
  },
}
