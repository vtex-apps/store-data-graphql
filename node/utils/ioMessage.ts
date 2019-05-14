import { Segment } from '@vtex/api'
import { prop } from 'ramda'

import { Slugify } from '../resolvers/catalog/slug'

const localeFromDefaultSalesChannel = (segment: Segment) =>
  segment.getSegmentByToken(null).then(prop('cultureInfo'))

export const toIOMessage = async (segment: Segment, content: string, id: string) => ({
  content,
  from: await localeFromDefaultSalesChannel(segment),
  id,
})

export const toProductIOMessage = (field: string) => (segment: Segment, content: string, id: string) => toIOMessage(
  segment,
  content,
  `Product-id.${id}::${field}`
)

export const toCategoryIOMessage = (field: string) => (segment: Segment, content: string, id: string) => toIOMessage(
  segment,
  content,
  `Category-id.${id}::${field}`
)

export const toFacetIOMessage = (segment: Segment, content: string, id: string) => toIOMessage(
  segment,
  content,
  `SpecificationFilter-id.${id}::${content}`
)

export const toSearchTerm = (term: string, from: string, description: string = '') => ({
  id: `Search::${Slugify(term)}`,
  description,
  content: term,
  from,
})
