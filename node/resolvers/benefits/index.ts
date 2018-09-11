import axios from 'axios'
import { flatten, indexOf, path, prop } from 'ramda'

// import { resolveLocalProductFields } from '../catalog/fieldsResolver'
import { queries as checkoutQueries } from '../checkout'
import { withAuthToken } from '../headers'
import paths from '../paths'

const SKU_SEPARATOR = ','
const CATALOG = 'Catalog'
const DEFAULT_SELLER = '1'
const DEFAULT_QUANTITY = '1'

/**
 * Receives an Array of SKU Ids and returns an Array of the Products that each SKU Belongs.
 *
 * @param skuIds Array of SKU Ids which will be used to retrieve all the products that each SKU belongs.
 * @param ioContext Helper object which holds the account and the authentication headers.
 */
const resolveProducts = async (skuIds, ioContext) => axios.get(
  paths.productBySku(ioContext.account, { skuIds }),
  {headers: withAuthToken()(ioContext),}
).then(prop('data'))

export const fieldResolvers = {
  Benefit: {
    items: async (benefit, _, ctx) => {
      const { teaserType, conditions, effects } = benefit

      if (teaserType === CATALOG) {
        const {
          parameters: conditionsParameters,
          minimumQuantity = parseInt(DEFAULT_QUANTITY),
        } = conditions

        const { parameters: effectsParameters } = effects

        const items = await Promise.all(
          conditionsParameters.map(async (conditionsParameter, index) => {
            const skuIds = conditionsParameter.value.split(SKU_SEPARATOR)
            const discount = effectsParameters[index].value
            const products = await resolveProducts(skuIds, ctx.vtex)

            return products.map(product => {
              const benefitSKUIds = []

              product.items.map(item => {
                if (indexOf(item.itemId, skuIds) > -1) {
                  benefitSKUIds.push(item.itemId)
                }
              })

              return {
                benefitProduct: product,
                benefitSKUIds,
                discount,
                minQuantity: minimumQuantity,
              }
            })
          })
        )
        return flatten(items)
      }
    }
  }
}

export const queries = {
  /**
   * There are two ways to make the request data
   * First of them is passing the graphql args with the items property which is an array of Shipping Items.
   * Second is passing just the id of the product itself as a graphql argument.
   */
  benefits: async (_, args, config) => {
    const requestBody = {
      items: args.items
        ? args.items
        : [
            {
              id: args.id,
              quantity: DEFAULT_QUANTITY,
              seller: DEFAULT_SELLER,
            },
          ],
    }
    const benefitsData = await checkoutQueries.shipping(_, requestBody, config)
    return path(['ratesAndBenefitsData', 'teaser'], benefitsData) || []
  },
}
