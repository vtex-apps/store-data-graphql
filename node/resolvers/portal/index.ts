interface Site {
  id: string
  title: string
  siteName: string
}

export const resolvers = {
  storeConfigs: async (_: any, __: any, ctx: Context) => {
    const {
      clients: { portal },
      vtex: { account },
    } = ctx

    const sites = await portal.sites()

    const currentSite = sites.find((site: Site) => site.siteName === account)

    try {
      return portal.storeConfigs(currentSite ? currentSite.id : 'default')
    } catch (e) {
      ctx.clients.logger.info(
        JSON.stringify(currentSite),
        'portal-storegraphql-errors'
      )
      return null
    }
  },
}
