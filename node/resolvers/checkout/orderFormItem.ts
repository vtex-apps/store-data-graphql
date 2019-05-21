import { AssemblyOption } from './types'

interface Params extends OrderFormItem{
  assemblyOptionsData: {
    childs: OrderFormItem[]
    index: number
    assemblyOptionsMap: Record<string, AssemblyOption[]>
    orderForm: any
  }
}

export const resolvers = {
  OrderFormItem: {
    assemblyOptions: ({ assemblyOptionsData: { childs, index, orderForm, assemblyOptionsMap }, ...item }: Params) => ({ item, childs, index, orderForm, assemblyOptionsMap }),
    cartIndex: ({ assemblyOptionsData: { index }}: any) => index,
    listPrice: ({ listPrice }: Params) => listPrice / 100,
    price: ({ price }: Params) => price / 100,
    sellingPrice: ({ sellingPrice }: Params) => sellingPrice / 100,
    productCategoryIds: ({ productCategoryIds }: Params) => productCategoryIds,
    priceTags: ({ priceTags }: Params) => priceTags,
    measurementUnit: ({ measurementUnit }: Params) => measurementUnit,
  }
}
