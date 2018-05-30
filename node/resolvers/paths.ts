const paths = {
  search: (account) => `http://${account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search`,

  product: (account, {slug}) => `${paths.search(account)}/${slug}/p`,
  productByEan: (account, {id}) => `${paths.search(account)}?fq=alternateIds_Ean=${id}`,
  productById: (account, {id}) => `${paths.search(account)}?fq=productId:${id}`,
  productByReference: (account, {id}) => `${paths.search(account)}?fq=alternateIds_RefId=${id}`,
  productBySku: (account, {id}) => `${paths.search(account)}?fq=skuId:${id}`,

  brand: (account) => `http://${account}.vtexcommercestable.com.br/api/catalog_system/pvt/brand/list`,
  category: (account, {id}) => `http://${account}.vtexcommercestable.com.br/api/catalog_system/pvt/category/${id}`,
  categories: (account, {treeLevel}) => `http://${account}.vtexcommercestable.com.br/api/catalog_system/pub/category/tree/${treeLevel}/`,

  products: (account, {query = '', fulltext = '', category ='', specificationFilters, priceRange ='', collection = '', salesChannel = '', orderBy = '', from = 0, to = 9, map = ''}) => `http://${account}.vtexcommercestable.com.br/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?${category && `&fq=C:/${category}/`}${(specificationFilters && specificationFilters.length > 0 && specificationFilters.map(filter => `&fq=${filter}`)) || ''}${priceRange && `&fq=P:[${priceRange}]`}${collection && `&fq=productClusterIds:${collection}`}${salesChannel && `&fq=isAvailablePerSalesChannel_${salesChannel}:1`}${orderBy && `&O=${orderBy}`}${map && `&map=${map}`}${from > -1 && `&_from=${from}`}${to > -1 && `&_to=${to}`}`,

  facets: (account, {facets=''}) => `http://${account}.vtexcommercestable.com.br/api/catalog_system/pub/facets/search/${encodeURI(facets)}`,

  crossSelling: (account, id, type) => `http://${account}.vtexcommercestable.com.br/api/catalog_system/pub/products/crossselling/${type}/${id}`,

  shipping: (account) => `http://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForms/simulation`,

  orderForm: (account) => `http://${account}.vtexcommercestable.com.br/api/checkout/pub/orderForm`,

  orderFormProfile: (account, {orderFormId}) => `${paths.orderForm(account)}/${orderFormId}/attachments/clientProfileData`,

  orderFormShipping: (account, {orderFormId}) => `${paths.orderForm(account)}/${orderFormId}/attachments/shippingData`,

  orderFormPayment: (account, {orderFormId}) => `${paths.orderForm(account)}/${orderFormId}/attachments/paymentData`,

  orderFormPaymentToken: (account, {orderFormId}) => `${paths.orderForm(account)}/${orderFormId}/paymentData/paymentToken`,

  orderFormPaymentTokenId: (account, {orderFormId, tokenId}) => `${paths.orderForm(account)}/${orderFormId}/paymentData/paymentToken/${tokenId}`,

  orderFormIgnoreProfile: (account, {orderFormId}) => `${paths.orderForm(account)}/${orderFormId}/profile`,

  orderFormCustomData: (account, {orderFormId, appId, field}) => `${paths.orderForm(account)}/${orderFormId}/customData/${appId}/${field}`,

  addItem: (account, {orderFormId}) => `${paths.orderForm(account)}/${orderFormId}/items`,

  updateItems: (account, data) => `${paths.addItem(account, data)}/update`,

  orders: account => `http://${account}.vtexcommercestable.com.br/api/checkout/pub/orders`,

  cancelOrder: (account, {orderFormId}) => `${paths.orders(account)}/${orderFormId}/user-cancel-request`,

  identity: (account, {token}) => `http://vtexid.vtex.com.br/api/vtexid/pub/authenticated/user?authToken=${encodeURIComponent(token)}`,

  profile: account => ({
    address: (id) => `http://api.vtex.com/${account}/dataentities/AD/documents/${id}`,
    filterAddress: (id) => `http://api.vtex.com/${account}/dataentities/AD/search?userId=${id}&_fields=userId,id,receiverName,complement,neighborhood,state,number,street,postalCode,city,reference,addressName,addressType`,
    filterUser: (email) => `http://api.vtex.com/${account}/dataentities/CL/search?email=${email}&_fields=userId,id,firstName,lastName,birthDate,gender,homePhone,businessPhone,document,email`,
    profile: (id) => `http://api.vtex.com/${account}/dataentities/CL/documents/${id}`,
  }),

  gateway: account => `http://${account}.vtexpayments.com.br/api`,

  gatewayPaymentSession: account => `${paths.gateway(account)}/pvt/sessions`,

  gatewayTokenizePayment: (account, {sessionId}) => `${paths.gateway(account)}/pub/sessions/${sessionId}/tokens`,

  autocomplete: (account, {maxRows, searchTerm}) => `http://portal.vtexcommercestable.com.br/buscaautocomplete/?an=${account}&maxRows=${maxRows}&productNameContains=${encodeURIComponent(searchTerm)}`,

  getTemporaryToken: () => `http://vtexid.vtex.com.br/api/vtexid/pub/authentication/start`,
  sendEmailVerification: (email, token) => `http://vtexid.vtex.com.br/api/vtexid/pub/authentication/accesskey/send?authenticationToken=${token}&email=${email}`,
  signIn: (email, token, code) => `http://vtexid.vtex.com.br/api/vtexid/pub/authentication/accesskey/validate?authenticationToken=${token}&login=${email}&accesskey=${code}`,

  searchDocument: (account, acronym, fields) => `http://api.vtex.com/${account}/dataentities/${acronym}/search?_fields=${fields}`,
  documents: (account, acronym) => `http://api.vtex.com/${account}/dataentities/${acronym}/documents`,
  document: (account, acronym, id) => `${paths.documents(account, acronym)}/${id}`,
  documentFields: (account, acronym, fields="_all", id) => `${paths.document(account, acronym, id)}?_fields=${fields}`,
}

export default paths
