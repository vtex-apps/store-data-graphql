import { ServiceContext } from '@vtex/api'
import { RESTDataSource as ApolloRESTDataSource } from 'apollo-datasource-rest'
import { BodyInit, RequestInit as ApolloRequestInit , URLSearchParamsInit } from 'apollo-server-env'

type Body = BodyInit | object

interface RequestInit extends ApolloRequestInit {
  metric?: string
}

export class RESTDataSource extends ApolloRESTDataSource<ServiceContext> {
  protected async get <TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init?: RequestInit,
  ): Promise<TResult> {
    return this.withMetrics(() => super.get<TResult>(path, params, init), init && init.metric)
  }

  protected async post <TResult = any>(
    path: string,
    body?: Body,
    init?: RequestInit,
  ): Promise<TResult> {
    return this.withMetrics(() => super.post<TResult>(path, body, init), init && init.metric)
  }

  protected async patch <TResult = any>(
    path: string,
    body?: Body,
    init?: RequestInit,
  ): Promise<TResult> {
    return this.withMetrics(() => super.patch<TResult>(path, body, init), init && init.metric)
  }

  protected async put <TResult = any>(
    path: string,
    body?: Body,
    init?: RequestInit,
  ): Promise<TResult> {
    return this.withMetrics(() => super.put<TResult>(path, body, init), init && init.metric)
  }

  protected async delete <TResult = any>(
    path: string,
    params?: URLSearchParamsInit,
    init?: RequestInit,
  ): Promise<TResult> {
    return this.withMetrics(() => super.delete<TResult>(path, params, init), init && init.metric)
  }

  private withMetrics = async <TResult = any> (handler: () => Promise<TResult>, metric?: string) => {
    const {vtex: {production}} = this.context
    const start = metric && process.hrtime()
    let status

    try {
      status = 'APOLLO_REST_OK'
      return await handler()
    } catch (err) {
      status = 'APOLLO_REST_ERROR'
      throw err
    } finally {
      if (metric) {
        const label = `http-client-${status}-${metric}`
        metrics.batchHrTimeMetric(label, start as [number, number], production)
      }
    }
  }
}
