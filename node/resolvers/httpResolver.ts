import axios from 'axios'
import { ColossusContext, IOContext } from 'colossus'
import { prop } from 'ramda'
import * as parse from 'url-parse'

const defaultMerge = (bodyData, resData, resResponse) => resData

export type URLBuilder = (account: string, data: any, root: any) => string

export type DataBuilder = (data: any) => any

export type HeadersBuider = (ioContext: IOContext) => Record<string, string>

export type ResponseMerger = (bodyData: any, responseData: any, response?: any) => any

export interface HttpResolverOptions {
  method?: string
  url: string | URLBuilder
  data?: any | DataBuilder
  headers?: Record<string, string> | HeadersBuider,
  enableCookies?: boolean,
  secure?: boolean,
  merge?: ResponseMerger
}

export default (options: HttpResolverOptions) => {
  return async (root, args, { vtex: ioContext, request: { headers: { cookie, 'x-forwarded-host': host } }, response }: ColossusContext) => {
    const { secure = false, url, enableCookies, data, method = 'GET', headers = {}, merge = defaultMerge } = options

    const builtUrl = (typeof url === 'function') ? url(ioContext.account, args, root) : url
    const builtData = (typeof data === 'function') ? data(args) : data
    const builtHeaders = (typeof headers === 'function') ? await headers(ioContext) : headers

    const config = { method, url: builtUrl, data: builtData, headers: builtHeaders }
    if (enableCookies && cookie) {
      config.headers.cookie = cookie
      config.headers.host = host
    }
    if (secure) {
      config.headers['X-Vtex-Proxy-To'] = `https://${parse(builtUrl).hostname}`
    }

    const vtexResponse = await axios.request(config)

    if (enableCookies) {
      const setCookie = prop('set-cookie', vtexResponse.headers)
      if (setCookie) {
        response.set('Set-Cookie', setCookie)
      }
    }
    return merge(args, vtexResponse.data, vtexResponse)
  }
}
