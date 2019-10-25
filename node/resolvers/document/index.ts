import { UserInputError } from '@vtex/api'
import { compose, map, union, prop, replace, path } from 'ramda'
import { parseFieldsToJson } from '../../utils/object'
import { resolvers as documentSchemaResolvers} from './documentSchema'

export const queries = {
  documents: async (_: any, args: DocumentsArgs, context: Context) => {
    const { acronym, fields, page, pageSize, where, schema } = args
    const { clients: { masterdata } } = context
    const fieldsWithId = union(fields, ['id'])
    const data = await masterdata.searchDocuments(acronym, fieldsWithId, where, {
      page,
      pageSize,
    }, schema) as any
    return map(
      (document: any) =>
      ({
        cacheId: document.id,
        id: document.id,
        fields: mapKeyAndStringifiedValues(document)
      })
    )(data)
  },

  documentsWithPagination: async (_: any, args: DocumentsArgs, context: Context) => {
    const { acronym, fields, page, pageSize, where, schema } = args
    const { clients: { masterdata } } = context
    const fieldsWithId = union(fields, ['id'])

    const documentsRow = await masterdata.searchDocumentRaw(acronym, fieldsWithId, where, {
        page,
        pageSize,
      }, schema) as any

    const documents = path(['data'], documentsRow) as any
    const pageInfo = path(['pageInfo'], documentsRow) as any
    
    return {
      items: map((document: any) =>({
        cacheId: document.id,
        id: document.id,
        fields: mapKeyAndStringifiedValues(document)
        }))(documents),
      pagination: pageInfo
    }
  },

  document: async (_: any, args: DocumentArgs, context: Context) => {
    const { acronym, fields, id } = args
    const {
      clients: { masterdata },
    } = context
    const data = await masterdata.getDocument(acronym, id, fields)
    return {
      cacheId: id,
      id,
      fields: mapKeyAndStringifiedValues(data),
    }
  },

  documentSchema: async(_: any, args: DocumentSchemaArgs, context: Context) => {
    const { dataEntity, schema } = args;

    const {
      clients: { masterdata },
    } = context

    const data = await masterdata.getSchema(dataEntity, schema);

    return {...data, name: data? args.schema : null}
  },
}

export const fieldResolvers = {
  ...documentSchemaResolvers
}

export const mutations = {
  createDocument: async (
    _: any,
    args: CreateDocumentArgs,
    context: Context
  ) => {
    const {
      acronym,
      document: { fields },
      schema
    } = args
    const {
      clients: { masterdata },
    } = context
    const response = (await masterdata.createDocument(
      acronym,
      parseFieldsToJson(fields),
      schema
    )) as DocumentResponse

    const documentId = removeAcronymFromId(acronym, response)
    return {
      cacheId: documentId,
      id: prop('Id', response),
      href: prop('Href', response),
      documentId: removeAcronymFromId(acronym, response),
    }
  },

  updateDocument: async (
    _: any,
    args: UpdateDocumentArgs,
    context: Context
  ) => {
    const {
      acronym,
      document: { fields },
    } = args
    const documentId = prop('id', parseFieldsToJson(fields)) as string
    if (!documentId) {
      throw new UserInputError('document id field cannot be null/undefined')
    }
    const {
      clients: { masterdata },
      vtex: { account },
    } = context
    await masterdata.updateDocument(
      acronym,
      documentId,
      parseFieldsToJson(fields)
    )
    return {
      cacheId: documentId,
      documentId,
      href: generateHref(account, acronym, documentId),
      id: getId(acronym, documentId),
    }
  },

  deleteDocument: async (
    _: any,
    args: DeleteDocumentArgs,
    context: Context
  ) => {
    const { acronym, documentId } = args
    const {
      clients: { masterdata },
      vtex: { account },
    } = context
    await masterdata.deleteDocument(acronym, documentId)
    return {
      documentId,
      href: generateHref(account, acronym, documentId),
      id: getId(acronym, documentId),
      cacheId: documentId,
    }
  },
}

/**
 * Map a document object to a list of {key: 'property', value: 'propertyValue'},
 * Uses `JSON.stringify` in every value.
 */
const mapKeyAndStringifiedValues = (document: any) =>
  Object.keys(document).map(key => ({
    key,
    value:
      typeof document[key] === 'string'
        ? document[key]
        : JSON.stringify(document[key]),
  }))

const removeAcronymFromId = (acronym: string, data: { Id: string }) => {
  return compose<any, any, any>(
    replace(new RegExp(`${acronym}-`), ''),
    prop('Id')
  )(data)
}

const getId = (acronym: string, documentId: string) =>
  `${acronym}-${documentId}`

const generateHref = (account: string, acronym: string, documentId: string) =>
  `http://api.vtex.com/${account}/dataentities/${acronym}/documents/${documentId}`
