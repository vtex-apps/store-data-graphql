import { SegmentData } from '@vtex/api'

const ALLOWED_TEASER_TYPES = ['Catalog', 'Profiler', 'ConditionalPrice']

const getMarketingData = (segment?: SegmentData) => {
  if(!segment?.utm_campaign && !segment?.utm_source && !segment?.utmi_campaign) {
    return
  }

  let marketingData = {}
  if(segment?.utm_campaign) {
    marketingData = {
      utmCampaign: segment?.utm_campaign
    }
  }

  if(segment?.utm_source) {
    marketingData = {
      ...marketingData,
      utmSource: segment?.utm_source
    }
  }

  if(segment?.utmi_campaign) {
    marketingData = {
      ...marketingData,
      utmiCampaign: segment?.utmi_campaign
    }
  }

  return marketingData
}

export const getSimulationPayloadsByItem = (
  item: ItemWithSimulationInput,
  segment?: SegmentData
) => {
  const payloadItems = item.sellers.map((seller) => {
    return {
      id: item.itemId,
      quantity: 1,
      seller: seller.sellerId,
    } as PayloadItem
  })

  return payloadItems.map((item) => {
    return {
      priceTables: segment?.priceTables ? [segment.priceTables] : undefined,
      items: [item],
      shippingData: { logisticsInfo: [{ regionId: segment?.regionId }] },
      marketingData: getMarketingData(segment),
    }
  })
}

export const orderFormItemToSeller = (
  orderFormItem: OrderFormItem & {
    paymentData: any
    ratesAndBenefitsData: RatesAndBenefitsData
  }
) => {
  const unitMultiplier = orderFormItem.unitMultiplier ?? 1

  const commertialOffer = {
    Price: orderFormItem.sellingPrice
      ? Number((orderFormItem.sellingPrice / (unitMultiplier * 100)).toFixed(2))
      : orderFormItem.price / 100,
    PriceValidUntil: orderFormItem.priceValidUntil,
    ListPrice: orderFormItem.listPrice / 100,
    PriceWithoutDiscount: orderFormItem.price / 100,
    AvailableQuantity: orderFormItem?.availability === 'available' ? 10000 : 0,
    Teasers: getTeasers(orderFormItem.ratesAndBenefitsData),
    DiscountHighLight: getDiscountHighLights(
      orderFormItem.ratesAndBenefitsData
    ),
  } as CommertialOffer

  const installmentOptions =
    orderFormItem?.paymentData?.installmentOptions || []

  commertialOffer.Installments = []

  installmentOptions.forEach((installmentOption: InstallmentOption) =>
    installmentOption.installments.map((installment) => {
      commertialOffer.Installments.push({
        Value: installment.value / 100,
        InterestRate: installment.interestRate,
        TotalValuePlusInterestRate: installment.total / 100,
        NumberOfInstallments: installment.count,
        PaymentSystemName: installmentOption.paymentName,
        Name: generatePaymentName(
          installment.interestRate,
          installmentOption.paymentName,
          installment.count
        ),
      } as Installment)
    })
  )

  return {
    sellerId: orderFormItem.id,
    commertialOffer,
  }
}

const getTeasers = (ratesAndBenefitsData: RatesAndBenefitsData) => {
  if (!ratesAndBenefitsData) {
    return []
  }

  return ratesAndBenefitsData.teaser
    .filter((teaser: any) => ALLOWED_TEASER_TYPES.includes(teaser.teaserType))
    .map((teaser: any) => ({ '<Name>k__BackingField': teaser.name, ...teaser }))
}

const getDiscountHighLights = (ratesAndBenefitsData: RatesAndBenefitsData) => {
  if (!ratesAndBenefitsData) {
    return []
  }

  return ratesAndBenefitsData.rateAndBenefitsIdentifiers
    .filter(
      (rateAndBenefitsIdentifier: any) => rateAndBenefitsIdentifier.featured
    )
    .map((rateAndBenefitsIdentifier: any) => ({
      '<Name>k__BackingField': rateAndBenefitsIdentifier.name,
      ...rateAndBenefitsIdentifier,
    }))
}

const generatePaymentName = (
  interestRate: number | null,
  paymentSystemName: string | null,
  numberOfInstallments: number
) => {
  if (interestRate === null) {
    return paymentSystemName
  } else if (interestRate == 0) {
    return `${paymentSystemName} ${
      numberOfInstallments === 1
        ? 'à vista'
        : `${numberOfInstallments} vezes sem juros`
    }`
  } else {
    return `${paymentSystemName} ${
      numberOfInstallments === 1
        ? 'à vista com juros'
        : `${numberOfInstallments} vezes com juros`
    }`
  }
}
