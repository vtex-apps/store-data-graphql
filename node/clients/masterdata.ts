import {
  InstanceOptions,
  IOContext,
  ExternalClient,
  RequestConfig,
  UserInputError,
} from '@vtex/api'
import FormData from 'form-data'

import { statusToError } from '../utils'

export class MasterData extends ExternalClient {
  public constructor(ctx: IOContext, options?: InstanceOptions) {
    super(`http://api.vtex.com/${ctx.account}/dataentities`, ctx, {
      ...options,
      headers: {
        ...(options && options.headers),
        ...{ Accept: 'application/vnd.vtex.ds.v10+json' },
        ...(ctx.adminUserAuthToken
          ? { VtexIdclientAutCookie: ctx.adminUserAuthToken }
          : null),
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
      },
    })
  }

  public getSchema = <T>(dataEntity: string, schema: string) =>
    this.get<T>(this.routes.schema(dataEntity, schema), {
      metric: 'masterdata-getSchema',
    })

  public getDocument = <T>(acronym: string, id: string, fields: string[]) =>
    this.get<T>(this.routes.document(acronym, id), {
      metric: 'masterdata-getDocument',
      params: {
        _fields: generateFieldsArg(fields),
      },
    })

  public createDocument = (acronym: string, fields: object) =>
    this.post<DocumentResponse>(this.routes.documents(acronym), fields, {
      metric: 'masterdata-createDocument',
    })

  public updateDocument = (acronym: string, id: string, fields: object) =>
    this.patch(this.routes.document(acronym, id), fields, {
      metric: 'masterdata-updateDocument',
    })

  public searchDocuments = <T>(
    acronym: string,
    fields: string[],
    where: string,
    pagination: PaginationArgs,
    schema?: string
  ) =>{
    return this.get<T[]>(this.routes.search(acronym), {
      headers: paginationArgsToHeaders(pagination),
      metric: 'masterdata-searchDocuments',
      params: {
        _fields: generateFieldsArg(fields),
        _where: where,
        ...schema ? {_schema: schema} : null
      },
    })}

  public deleteDocument = (acronym: string, id: string) =>
    this.delete(this.routes.document(acronym, id), {
      metric: 'masterdata-deleteDocument',
    })

  public uploadAttachment = (
    acronym: string,
    id: string,
    fields: string,
    formData: FormData
  ) =>
    this.post<any>(this.routes.attachments(acronym, id, fields), formData, {
      headers: formData.getHeaders(),
      metric: 'masterdata-uploadAttachment',
    })

  protected get = <T>(url: string, config?: RequestConfig) => {
    return this.http.get<T>(url, config).catch(statusToError)
  }

  protected post = <T>(url: string, data?: any, config?: RequestConfig) => {
    return this.http.post<T>(url, data, config).catch(statusToError)
  }

  protected delete = <T>(url: string, config?: RequestConfig) => {
    return this.http.delete<T>(url, config).catch(statusToError)
  }

  protected patch = <T>(url: string, data?: any, config?: RequestConfig) => {
    return this.http.patch<T>(url, data, config).catch(statusToError)
  }

  private get routes() {
    return {
      attachments: (acronym: string, id: string, fields: string) =>
        `${acronym}/documents/${id}/${fields}/attachments`,
      document: (acronym: string, id: string) => `${acronym}/documents/${id}`,
      documents: (acronym: string) => `${acronym}/documents`,
      schema: (acronym: string, schema: string) => `${acronym}/schemas/${schema}`,
      search: (acronym: string) => `${acronym}/search`,
    }
  }
}

function paginationArgsToHeaders({ page, pageSize }: PaginationArgs) {
  if (page < 1) {
    throw new UserInputError('Smallest page value is 1')
  }

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize

  return {
    'REST-Range': `resources=${startIndex}-${endIndex}`,
  }
}

function generateFieldsArg(fields: string[]) {
  return fields.join(',')
}

interface PaginationArgs {
  page: number
  pageSize: number
}
