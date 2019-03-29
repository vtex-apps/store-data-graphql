import { concat, filter, groupBy, last, map, nth, path, prop, values } from 'ramda'

import ResolverError from '../../errors/resolverError'
import { mapKeyValues } from '../../utils/object'
import { acronymList, acronymListProduct, fields, fieldsListProduct } from './util'
import { validateItems } from './util'

const getListItemsWithProductInfo = (items: any, catalog: any) => Promise.all(
  map(async item => {
    const productsResponse = await catalog.productBySku([path(['skuId'], item)])
    const product = nth(0, productsResponse)
    return { ...item, product }
  }, items)
)

const getListItems = async (itemsId: any, dataSources: any) => {
  const { catalog, document } = dataSources
  const items = itemsId ? await Promise.all(map(id =>
    document.getDocument(acronymListProduct, id, fieldsListProduct), itemsId)) : []
  return getListItemsWithProductInfo(items, catalog)
}

const addListItem = async (item: any, document: any) => {
  const { DocumentId } = await document.createDocument(acronymListProduct, mapKeyValues({ ...item }))
  return DocumentId
}

const addItems = async (items = [], dataSources: any) => {
  const { document } = dataSources
  validateItems(items, dataSources)
  const promises = map(async item => addListItem(item, document), items)
  return Promise.all(promises)
}

const deleteItems = (items: any, document: any) => (
  items && items.forEach((item: any) => document.deleteDocument(acronymListProduct, path(['id'], item)))
)

const updateItems = async (items: any, dataSources: any) => {
  const { document } = dataSources
  const itemsWithoutDuplicated = map(item => last(item),
    values(groupBy(prop('skuId') as any, items)))
  const itemsToBeDeleted = filter(item => path<any>(['id'], item) && path(['quantity'], item) === 0, itemsWithoutDuplicated)
  const itemsToBeAdded = filter(item => !path(['id'], item), itemsWithoutDuplicated)
  const itemsToBeUpdated = filter(item => path<any>(['id'], item) && path<any>(['quantity'], item) > 0, itemsWithoutDuplicated)

  deleteItems(itemsToBeDeleted, document)

  const itemsIdAdded = await Promise.all(
    map(async item => await addListItem(item, document), itemsToBeAdded)
  )

  const itemsIdUpdated = map(
    item => {
      document.updateDocument(
        acronymListProduct,
        path(['id'], item),
        mapKeyValues(item))
      return path(['id'], item)
    },
    itemsToBeUpdated
  )

  return concat(itemsIdAdded, itemsIdUpdated)
}

export const queries = {
  list: async (_: any, { id }: any, { dataSources, dataSources: { document } }: any) => {
    const list = await document.getDocument(acronymList, id, fields)
    const items = await getListItems(list.items, dataSources)
    return { id, ...list, items }
  },

  listsByOwner: async (_: any, { owner, page, pageSize }: any, context: any) => {
    const { dataSources, dataSources: { document } } = context
    const lists = await document.searchDocuments(acronymList, fields, `owner=${owner}`, { page, pageSize })
    const listsWithProducts = map(async list => {
      const items = await getListItems(path(['items'], list), dataSources)
      return { ...list, items }
    }, lists)
    return Promise.all(listsWithProducts)
  }
}

export const mutation = {
  createList: async (_: any, { list, list: { items } }: any, context: any) => {
    const { dataSources, dataSources: { document } } = context
    try {
      const itemsId = await addItems(items, dataSources)
      const { DocumentId } = await document.createDocument(acronymList, mapKeyValues({ ...list, items: itemsId }))
      return queries.list(_, { id: DocumentId }, context)
    } catch (error) {
      throw new ResolverError(`Cannot create list: ${error}`, 406)
    }
  },

  deleteList: async (_: any, { id }: any, { dataSources: { document } }: any) => {
    const { items } = await document.getDocument(acronymList, id, fields)
    deleteItems(items, document)
    return document.deleteDocument(acronymList, id)
  },

  /**
   * Update the list informations and its items.
   * If the item given does not have the id, add it as a new item in the list
   * If the item given has got an id, but its quantity is 0, remove it from the list
   * Otherwise, update it.
   */
  updateList: async (_: any, { id, list, list: { items } }: any, context: any) => {
    const { dataSources, dataSources: { document } } = context
    try {
      const itemsUpdatedId = await updateItems(items, dataSources)
      await document.updateDocument(acronymList, id, mapKeyValues({ ...list, items: itemsUpdatedId }))
      return queries.list(_, { id }, context)
    } catch (error) {
      throw new ResolverError(`Cannot update the list: ${error}`, 406)
    }
  },
}
