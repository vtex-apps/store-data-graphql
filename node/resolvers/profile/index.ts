import { path } from 'ramda'
import { MutationSaveAddressArgs } from 'vtex.store-graphql'

import fieldR from './fieldResolvers'
import {
  createAddress,
  deleteAddress,
  getProfile,
  updateAddress,
  updateProfile,
  updateProfilePicture,
  saveAddress,
} from './services'

const TRUE = 'True'
const FALSE = 'False'

interface SubscribeNewsletterArgs {
  email: string
  fields?: {
    name?: string
    phone?: string
    bindingUrl?: string
    bindingId?: string
  }
  isNewsletterOptIn: boolean
}

export const mutations = {
  createAddress: (_: any, { fields }: any, context: Context) =>
    createAddress(context, fields),

  saveAddress: (_: void, args: MutationSaveAddressArgs, context: Context) =>
    saveAddress(context, args),

  deleteAddress: (_: any, { id }: any, context: Context) =>
    deleteAddress(context, id),

  updateAddress: (_: any, args: any, context: Context) =>
    updateAddress(context, args),

  updateProfile: (_: any, { fields, customFields }: any, context: Context) =>
    updateProfile(context, fields, customFields),

  updateProfilePicture: (_: any, __: any, context: Context) =>
    updateProfilePicture('updateProfilePicture', context),

  uploadProfilePicture: (_: any, __: any, context: Context) =>
    updateProfilePicture('uploadProfilePicture', context),

  subscribeNewsletter: async (
    _: any,
    { fields, isNewsletterOptIn }: SubscribeNewsletterArgs,
    context: Context
  ) => {
    const { profile } = context.clients
    const optIn =
      isNewsletterOptIn === undefined || isNewsletterOptIn === true
        ? TRUE
        : FALSE

    const updatedPersonalPreferences: PersonalPreferences = {
      isNewsletterOptIn: optIn,
    }

    // Not logged in
    if(!context.vtex.currentProfile) throw new Error("You need to be logged in to use this mutation!")


    if (fields) {
      const userProfile = await profile.getProfileInfo(context.vtex.currentProfile)

      const { name, phone, bindingId, bindingUrl } = fields

      const userHasFirstName = Boolean(userProfile.firstName)
      const userHasPhone = Boolean(userProfile.cellPhone)
      const userHasBindingId = Boolean(userProfile.bindingId)
      const userHasBindingUrl = Boolean(userProfile.bindingUrl)

      // Prevents 'firstName' field from being overridden.
      if (!userHasFirstName && name) {
        updatedPersonalPreferences.firstName = name
      }

      // Prevents 'homePhone' field from being overridden.
      if (!userHasPhone && phone) {
        updatedPersonalPreferences.homePhone = phone
      }

      // Prevents 'bindingId' field from being overridden.
      if (!userHasBindingId && bindingId) {
        updatedPersonalPreferences.bindingId = bindingId
      }

      // Prevents 'bindingUrl' field from being overridden.
      if (!userHasBindingUrl && bindingUrl) {
        updatedPersonalPreferences.bindingUrl = bindingUrl
      }
    }

    await profile.updatePersonalPreferences(context.vtex.currentProfile,
      updatedPersonalPreferences
    )

    return true
  },
}

export const queries = {
  profile: (_: any, { customFields }: any, context: Context) =>
    getProfile(context, customFields),

  checkProfileAllowed: async (_: any, __: any, context: Context) => {
    const {
      clients: { catalog, customSession },
      vtex: { segment },
      cookies,
    } = context

    const salesChannel = segment ? segment.channel : null

    const { sessionData } = await customSession.getSession(
      cookies.get('vtex_session')!,
      ['*']
    )

    const email: string | undefined = path(
      ['namespaces', 'profile', 'email', 'value'],
      sessionData
    )

    const availableSalesChannels = await catalog
      .salesChannelAvailable(email)
      .catch(() => [])

    // Checking with `==` since `sc.Id` is an Integer and salesChannel a string
    // eslint-disable-next-line eqeqeq
    const available = availableSalesChannels.find((sc) => sc.Id == salesChannel)

    return {
      allowed: Boolean(available),
      condition: available
        ? 'authorized'
        : email
        ? 'forbidden' // The user is logged in and not allowed
        : 'unauthorized', // We don't know the user identity
    }
  },
}

export const fieldResolvers = fieldR
