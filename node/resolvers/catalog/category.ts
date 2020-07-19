import { compose, last, prop, split } from 'ramda'

import { getCategoryInfo } from './utils'

const lastSegment = compose<string, string[], string>(
  last,
  split('/')
)

function cleanUrl(url: string) {
  return url.replace(/^.*(vtexcommercestable\.com\.br)/, '')
}

export const pathToCategoryHref = (path: string) => {
  const isDepartment = path.slice(1).indexOf('/') === -1
  return isDepartment ? `${path}/d` : path
}

/** This type has to be created because the Catlog API to get category by ID does not return the url or children for now.
 * These fields only come if you get the category from the categroy tree api.
 */
interface SafeCategory
  extends Pick<
  Category,
  'id' | 'name' | 'hasChildren' | 'MetaTagDescription' | 'Title' | 'url'
  > {
  children: Category[] | null
}

export const resolvers = {
  Category: {
    cacheId: prop('id'),

    href: ({ url }: SafeCategory) => cleanUrl(url),

    metaTagDescription: prop('MetaTagDescription'),

    titleTag: prop('Title'),

    slug: ({ url }: SafeCategory) => url ? lastSegment(url) : null,

    children: async (
      { id, children }: SafeCategory,
      _: any,
      { clients: { catalog } }: Context
    ) => {
      if (children == null) {
        const category = await getCategoryInfo(catalog, id, 5)
        children = category.children
      }
      return children
    },
  },
}
