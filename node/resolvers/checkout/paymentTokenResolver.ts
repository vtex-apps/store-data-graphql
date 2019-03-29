import http from 'axios'
import { mapSeries } from 'bluebird'
import { last, merge, propEq, reject } from 'ramda'
import paths from '../paths'

const createClient = (account: any, orderFormId: any, authToken: any) => {

  const headers = {
    Accept: 'application/json',
    Authorization: `bearer ${authToken}`,
    'Content-Type': 'application/json',
  }

  return {
    addToken: (paymentToken: any) => {
      const payload = { paymentToken, expectedOrderFormSections: ['items', 'paymentData'] }
      const url = paths.orderFormPaymentToken(account, { orderFormId })

      return http.put(url, payload, { headers })
    },

    removeToken: (tokenId: any) => {
      const url = paths.orderFormPaymentTokenId(account, { orderFormId, tokenId })
      return http.delete(url, { headers, data: { expectedOrderFormSections: ['items'] } })
    },
  }
}

export default async (body: any, ioContext: any) => {
  const { data: { orderFormId, paymentToken } } = body
  const checkout = createClient(ioContext.account, orderFormId, ioContext.authToken)

  const response = await checkout.addToken(paymentToken)

  const { data: { paymentData: { availableTokens } } } = response
  const tokensToRemove = reject(propEq('tokenId', paymentToken.tokenId), availableTokens)

  if (tokensToRemove.length === 0) {
    return { data: merge(body.data, response.data) }
  }

  const lastDeleteResponse = await mapSeries(tokensToRemove, ({ tokenId }: any) => checkout.removeToken(tokenId)).then<any>(last)
  return { data: merge(body.data, lastDeleteResponse.data) }
}
