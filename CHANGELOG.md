# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Pagination info along with product search

## [2.142.6] - 2021-07-05
### Fixed
- Security vulnerability concerning the `masterdata` client.

## [2.142.5] - 2021-06-30

### Added
- `geoCoordinates` to the **shipping** query

## [2.142.4] - 2021-06-01

### Fixed

- `parsedPaymentData` nullability check.

## [2.142.3] - 2021-05-20

### Fixed

- `getPayments` resolver result when `availableAccounts` is not defined.

## [2.142.2] - 2021-05-06

### Fixed
- checkout returns 400 when there is no UTM info.

## [2.142.1] - 2021-05-06

## [2.142.0] - 2021-05-03

### Added
- UTM info to the `itemsWithSimulation` query.

### Added
- `teasers` and `discountHighlights` and payment name to the `itemsWithSimulation`.

## [2.141.0] - 2021-04-26

### Added
- `logOutFromSession` mutation

## [2.140.0] - 2021-04-14

### Added
- `loginSessionsInfo` query

## [2.139.1] - 2021-03-29

### Fixed
- Brand slugify on `resolvers/catalog/brand` same as catalog

## [2.139.0] - 2021-03-11
### Added
- `AvailableQuantity` to the `itemsWithSimulation` query.

## [2.138.2] - 2021-03-09
### Fixed
- Bring back `pickupStoreInfo` type to avoid breaking app builds.

## [2.138.1] - 2021-03-01
### Added
- `deliveryChannel` and `isPickupStore` fields to ShippingSLA type.
- `isPickupStore` field to PickupStoreInfoSLA type.

### Fixed
- `pickupStoreInfo` field type reference from `PickupStoreInfo` to `PickupStoreInfoSLA`

## [2.138.0] - 2021-01-27
### Added
- `attachments` and `productRefId` field to OrderItem type.

## [2.137.0] - 2021-01-14
### Added
- Support for custom fields to be sent to `subscribeNewsletter` mutation.

## [2.136.9] - 2020-12-10
### Added
- `scope: public` to `document` and `documents`'s Master Data queries.

## [2.136.8] - 2020-12-08
### Added
- `scope: public` to `getPublicSchema` query.

## [2.136.7] - 2020-12-08
### Fixed
- Remove special characters from search.

## [2.136.6] - 2020-12-03

### Changed
- Updated VTEX tooling
- Auto-fixed linting in all files

## [2.136.5] - 2020-12-02

## [2.136.4] - 2020-12-01
### Fixed
- Sanitize profile and address related fields.

## [2.136.3] - 2020-11-25
### Changed
- Use `dataentities` as a prefix on Master Data client.

## [2.136.2] - 2020-11-20
### Changed
- Remove `orderForm` query cache.

## [2.136.1] - 2020-11-16
### Fixed
- Fills the `PriceWithoutDiscount` field in the `itemsWithSimulation` query.
- Use `sellingPrice` instead of `price` in the `itemsWithSimulation` query.

## [2.136.0] - 2020-10-29
### Added
- `fields` argument to `subscribeNewsletter` mutation.

## [2.135.1] - 2020-10-26

### Fixed

- Uses correct fallback for category href

## [2.135.0] - 2020-10-09

### Added
- New `account` param on createDocument mutations

## [2.134.0] - 2020-09-30
### Added
- Translated `slug` and `href` fields from the Category type

## [2.133.0] - 2020-09-21
### Added
- `itemsWithSimulation` query.

## [2.132.0] - 2020-09-21
### Added
- New `account` field on `document` query.

## [2.131.2] - 2020-09-15
### Added
- Translate correctly categories result

## [2.131.1] - 2020-09-14
### Fixed
- Problem when addToCart mutation was not updating the marketing data on order form if only the `utm_source` param was being updated.

## [2.131.0] - 2020-09-08

### Added
- `instructions` to the `PickupPoint` type

## [2.130.0] - 2020-09-02
### Added
- New query `searchOrderForm`.

## [2.129.1] - 2020-08-27
### Added
- `pickupStoreInfo` to the `ShippingSLA` type

## [2.129.0] - 2020-08-27
### Added
- New `account` field on `updateDocuments` query.

## [2.128.0] - 2020-08-27
### Added
- New mutation `newOrderForm`.

## [2.127.0] - 2020-07-17

### Added
- `LogisticItem` type on `shipping` query

## [2.126.1] - 2020-07-14
### Changed
- Use value in cookie instead of parameter `orderFormId` in Checkout mutations.

### Deprecated
- Parameter `orderFormId` from Checkout-related mutations.

## [2.126.0] - 2020-07-09
### Added
- New `account` field on `documents` query.

## [2.125.0] - 2020-07-09
### Added
- Add field `CustomData` in Order Graphql.

## [2.124.0] - 2020-07-09
### Added
- Field `spotPrice` to Product type.

## [2.123.4] - 2020-06-22
### Fixed
- Get session request, add validation before making the request to retrieve the user's session.

## [2.123.3] - 2020-05-19
### Changed
- Continue add item if updateOrderFormMarketingData fails and just log its error.

## [2.123.2] - 2020-05-18
### Fixed
- Assembly options with inputValues were being split when an item is added to the `orderForm`.

## [2.123.1] - 2020-05-12
### Changed
- Call the new catalog-api-proxy endpoint for authenticaded searches (B2B).

## [2.123.0] - 2020-05-11
### Added
- **saveAddress** mutation, this new mutation saves address to the user's profile and then returns the newly saved address.

### Deprecated

- **createAddress** mutation, prefer using the new **saveAddress** mutation.

## [2.122.1] - 2020-05-07
### Fixed
- Update regex to remove vtexcommercestable in Category resolvers to remove if http as well.

## [2.122.0] - 2020-04-28
### Added
- `sellers` to `orderForm` schema.

## [2.121.0] - 2020-04-27
### Added
- Add `sort` field to `documents` query

## [2.120.2] - 2020-04-15
### Changed
- Deprecate mutation `logout`.

## [2.120.1] - 2020-04-09
### Fixed
- Adds scope private to mutations

## [2.120.0] - 2020-04-06
### Added
- Add `status` and `statusDescription` field.

## [2.119.0] - 2020-03-18

### Added
- Clear cart when Telemarketing user ends customer's session

## [2.118.0] - 2020-02-27

### Changed
- `documentSchemaV2` to `documentPublicSchema`, as the query only works with public schemas without authentication.

## [2.117.0] - 2020-02-19

### Added
- `documentSchemaV2` query, get generic masterdata schema, returned as a `scalar` type as is from the request
- `createDocumentV2` mutation, upload a `scalar` document to Master Data

## [2.116.1] - 2020-02-18
### Fixed
- Make order form item image url use https.

## [2.116.0] - 2020-02-18
### Added
- A optional `isNewsletterOptIn` parameter to `subscribeNewsletter` mutation.

## [2.115.1] - 2020-02-14
### Fixed
- Fix unexpected deletion of cookies from session

### Added
- Temporary custom session client with update session fix.

## [2.115.0] - 2020-02-13
### Added
- Create `toVtexAssets` directive.
- Add @toVtexAssets directive in imageUrl resolvers.

## [2.114.0] - 2020-02-12
### Added
- `canHaveAttachment` resolver in OrderFormItem.

## [2.113.8] - 2020-02-04
### Fixed
- Fix nearPickupPoint route.

## [2.113.7] - 2020-02-03
### Changed
- Make `pickupSLAs` query return all pickup points close to location sent, even unavailable ones.

## [2.113.6] - 2020-01-28
### Removed
- Upload profile picture action from `uploadProfilePicture` and `updateProfilePicture` mutations.

## [2.113.5] - 2020-01-10
### Added
- Add log when orderFormId passed in addItem and updateItem mutations is different than the one in cookie.

## [2.113.4] - 2020-01-09
### Fixed
- Fix problem of updating order form marketing data with invalid fields and breaking addItem mutation in some ocasions.

## [2.113.3] - 2020-01-07
### Fixed
- Make `checkProfileAllowed` return `authorized` if the user is not logged in but is in an open trade policy.

## [2.113.2] - 2020-01-06
### Changed
- Use native promises and not bluebird anymore.
- Other code improvements related to types and ramda update.

## [2.113.1] - 2019-12-30
### Fixed
- Performance improvements on product category tree resolver.

## [2.113.0] - 2019-12-20
### Added
- New field `condition` to `checkProfileAllowed`.

### Changed
- Deprecate field `allowed` from `checkProfileAllowed`.

## [2.112.0] - 2019-12-20

## [2.111.2] - 2019-12-18
### Changed
- Decode segment from segment token locally.

## [2.111.1] - 2019-12-06
### Changed
- Adapt to TS 3.7.3.

## [2.111.0] - 2019-12-05
### Added
- Docs folder and builder.

## [2.110.0] - 2019-11-05
### Added
- New query `checkProfileAllowed`.

## [2.109.2] - 2019-10-30

## [2.109.1] - 2019-10-25

## [2.109.0] - 2019-10-24

## [2.108.5] - 2019-10-24
### Deprecated
- Deprecate the queries: `products`, `productSearch`, `product`, `searchMetadata`, `facets` and `autocomplete`. They were moved to the `search-graphql` app.

## [2.108.4] - 2019-10-17

## [2.108.3] - 2019-10-16
### Fixed
- Sync OrderForm locale with the locale currently being used by the store.

## [2.108.2] - 2019-10-16
### Changed
- Make Checkout fields have the @translatableV2 directive.

## [2.108.1] - 2019-10-09

### Added

- Argument **schema** on mutations `createDocument` and `updateDocument`.
## [2.108.0] - 2019-09-30

## [2.107.1] - 2019-09-26
### Fixed
- Use `geoCoordinates` and `geoCoordnate` on Address type.

## [2.107.0] - 2019-09-24

## [2.106.1] - 2019-09-24

## [2.106.0] - 2019-09-19
### Added
- Handle Assembly Options' InputValues

## [2.105.10] - 2019-09-19
### Fixed
- Revert scalar Upload.

## [2.105.9] - 2019-09-19
### Fixed
- Protect against bad marketing tag argument when updating order form marketing data.
- Remove unnecessary scalar.

## [2.105.8] - 2019-09-19 [YANKED]
### Fixed
- Add missing scalar.

## [2.105.7] - 2019-09-19

## [2.105.6] - 2019-09-18
### Fixed
- Throw errors on `products` and `productSearch` queries when the `to` arg is greater than 2500.

## [2.105.5] - 2019-09-18
### Fixed
- Check if undefined is passed to facets param in `facets` query.

## [2.105.4] - 2019-09-18

### Fixed

- Transform `geoCoordinates` prop passed to `updateAddress` into `geoCoordinate`.

## [2.105.3] - 2019-09-17

### Fixed

- Transform `geoCoordinates` prop passed to `createAddress` into `geoCoordinate`.

## [2.105.2] - 2019-09-16
### Changed
- Decrease min replicas.

## [2.105.1] - 2019-09-05
### Added
- Create friendly name resolver to ShippingSLA type.

## [2.105.0] - 2019-09-02
### Added
- Create query for search metadata.

## [2.104.2] - 2019-08-29

## [2.104.1] - 2019-08-29

## [2.102.1] - 2019-08-29
### Changed
- Translate terms with `messagesGraphQL` client(instead of `messages` client) before sending them to search api for `productSearch` and `facets` resolvers.

## [2.104.0] - 2019-08-28

## [2.103.1] - 2019-08-27

## [2.102.2] - 2019-08-20
### Fixed
- impersonate and depersonify mutations to affect orderForm
- Use session client instead of making requests directly

## [2.102.1] - 2019-08-12
### Fixed
- Fix `titleTag` prop of the `Brand` type that was removed in the last release.

## [2.102.0] - 2019-08-09
### Added
- Add more translatable fields for catalog members.

## [2.101.0] - 2019-08-09

### Added
- Field `videos` to `Items`

## [2.100.1] - 2019-08-08
### Fixed
- Returning an array of installments with `[null]`.

## [2.100.0] - 2019-08-06
### Added
- Field `unitMultiplier` to `OrderFormItem`.
- Field `addressId` to `OrderFormItemInput`.

## [2.99.0] - 2019-08-06
### Added
- Add `priceTables` to `SessionProfile`.

## [2.98.2] - 2019-08-05
### Fixed
- Fix issue where Offer resolver was not being applied.

## [2.98.1] - 2019-08-01

## [2.98.0] - 2019-07-29
### Added
- `additionalData` in `connectorResponses` in `order`.

## [2.97.1] - 2019-07-29
### Fixed
- Bug on fetching price of assembly options, on some corner cases of assembly tree building.

## [2.97.0] - 2019-07-26
### Added
- Capability of adding recursive assembly options on addItems mutation.

### Fixed
- Check only on recently added items to add assembly options, preventing to add options to wrong father.

## [2.96.0] - 2019-07-19
### Added
- Field `producRefId` to `OrderFormItem`.
- Field `productCategories` to `OrderFormItem`.
- Field `additionalInfo` to `OrderFormItem`.

## [2.95.0] - 2019-07-18
### Fixed
- `listsByOwner` query not returning the list information updated.

## [2.94.0] - 2019-07-18
### Fixed
- Add `giftSkuIds` field to the `Offer` schema

## [2.93.2] - 2019-07-12
### Added
- Code improvement. More types in Checkout files.

### Fixed
- Remove assembly option client method: send delete body correctly.

## [2.93.1] - 2019-07-10
### Fixed
- Avoid breaking call to `updateOrderFormMarketingData` if `marketingTags` is `null`.

## [2.93.0] - 2019-07-10

### Changed
- Return the sales channel country as a default country on the `shipsTo` array of countries in **logistics** query.
- Port LogisticsDataSource to a Janus Client.

## [2.92.0] - 2019-07-09

## [2.91.0] - 2019-07-09

### Added

- **storeConfigs** query.

## [2.90.8] - 2019-07-09

### Changed
- Port OMSDataSource to a Janus Client.

## [2.90.7] - 2019-07-09

## [2.90.6] - 2019-07-08

### Fixed
- Use a better resolver architecture to fetch assembly options prices and use checkout client instead of axios.

## [2.90.5] - 2019-07-04

### Added
- added `teasers` and `discountHighlights` fields in `Product` type.

## [2.90.4] - 2019-07-04

### Fix

- Transform some **Profile** properties(`isCorporate`, `corporateName` and `tradeName`) to fit the needs of store-graphql contract and communication with `profile-system`.

## [2.90.3] - 2019-07-04
### Fixed
- Protect against null arguments in productSearch.

## [2.90.2] - 2019-07-04
### Fixed
- Find seller name for breadcrumb for map "sellerIds".
- Fix for incorrect breadcrumb name on categories after non-category maps.

## [2.90.1] - 2019-07-03
### Changed
- Uses slug in GoCommerce

## [2.90.0] - 2019-07-02
### Added
- `productId` field to `Items` type

## [2.89.2] - 2019-07-02

### Added

Added documentSchema query to make it possible for retrieving masterdata schema data

## [2.89.1] - 2019-07-02
### Fixed
- Slugify brand and category names before calling pagetype query on `searchContextFromParams` resolver.
- Reimplement custom slugify method to be closer to the catalog version.

## [2.89.0] - 2019-07-02
### Changed
- Prefers `ProductUniqueIdentifier` over `slug` in product query

## [2.88.4] - 2019-07-02

### Changed

- Improve performace at searchContextFromParams resolver.

## [2.88.3] - 2019-07-02
### Fixed
- Fix Go Commerce corner case of products without valid categories in tree.

## [2.88.2] - 2019-07-01

### Changed

- Performance improvements for productSearch and product category tree resolver.

## [2.88.1] - 2019-06-28

## [2.88.0] - 2019-06-28

### Added

- New pagetype query to identify by path and query the search page (brand, department..).

## [2.87.1] - 2019-06-27

### Fixed

- Fixes geoCoordinates on `createAddress` and `updateAddress` mutations

## [2.87.0] - 2019-06-26

### Removed

- Remove artificial synchronization of orderForm and session in preparation for transparent API support.

## [2.86.1] - 2019-06-26

### Fixed

- Scalar type of `rawValue` of `PriceTags` type.

## [2.86.0] - 2019-06-26

### Added

- `invoicedDate` into Order type.
- `selectedSla` to `LogisticInfo` type.

## [2.85.0] - 2019-06-26

### Added

- `productCategoryIds` into `OrderItem` type.

## [2.84.1] - 2019-06-25

### Fixed

- Improvevements on search breadcrumb resolver regarding categories.
- Decode name of search breadcrumb unit.

## [2.84.0] - 2019-06-21

### Added

- `brandId` to `Product` type.
- `imageUrl` to `Brand` type.

## [2.83.4] - 2019-06-21

### Fixed

- Fix for products with categories in different trees.

## [2.83.3] - 2019-06-21

### Fixed

- Problems in product/categoryTree resolver if there were / on the name of the cateogry.

## [2.83.2] - 2019-06-18

### Fixed

- Proper fix for bug when trying to get category tree of undefined.

## [2.83.1] - 2019-06-17

### Fixed

- Hotfix for "cannot get length of undefined" bug.

## [2.83.0] - 2019-06-14

### Added

- `customData` attachment to type `orderForm`.
- Fields `productCategoryIds`, `priceTags` and `measurementUnit` to type `OrderFormItem`.

## [2.82.0] - 2019-06-14

### Added

- Field `deliveryIds` to ShippingSLA in the shipping Query.

## [2.81.0] - 2019-06-12

### Added

- productsByIdentifier query and associated resolver to retrieve multiple products from an array of identifiers (EAN, reference code, etc)

## [2.80.3] - 2019-06-12

## [2.80.2] - 2019-06-11

### Fixed

- subscribeNewsletter mutation resolver not passing correct params to client.

## [2.80.1] - 2019-06-10

### Fixed

- Corrected query string formats for `productByEan` and `productByReference` catalog client methods

## [2.80.0] - 2019-06-07

### Changed

- Increase timeouts for external services like checkout and catalog

## [2.79.2] - 2019-06-06

### Changed

- Use `session` client from `node-vtex-api`

## [2.79.1] - 2019-06-05

## [2.79.0] - 2019-06-04

### Changed

- Port `profile` datasource to an **JanusClient** and incresead it's timeout to 3 seconds.

## [2.78.0] - 2019-06-04

### Changed

- Ports catalog datasource to client

## [2.77.1] - 2019-05-29

### Fixed

- **profile** query creation when the profile doesn't exist already. Treating for emails with non uri char's like '+'.

## [2.77.0] - 2019-05-24

### Addded

- `productRecommendations` query.

### Fixed

- Minor type fixes (removing `any`s).

## [2.76.2] - 2019-05-23

### Fixed

- `createList` mutation not creating the documents in list's resolver.
- `updateList` mutation not updating the documents in list's resolver.

## [2.76.1] - 2019-05-23

### Fixed

- Eliminate two queries to catalog at the productSearch for products and recordFiltered.

## [2.76.0] - 2019-05-22

### Fixed

- UTM and UTMI params in orderform.

### Added

- New field `utmParams` to query `getSession`.
- New field `utmiParams` to query `getSession`.

## [2.75.3] - 2019-05-22

### Fixed

- Throw error in `updateDocument` resolver if `id` field is null

## [2.75.2] - 2019-05-21

### Fixed

- Use both slugify methods to find brand data on catalog queries.

## [2.75.1] - 2019-05-21

### Changed

- Ported CallCenterOpDataSource to CallCenterOp IOClient.

## [2.75.0] - 2019-05-20

### Changed

- Use better resolver architecture at productSearch query.

### Added

- breadcrum resolver at productSearch.

## [2.74.4] - 2019-05-20

### Fixed

- **_updateProfilePicture_** mutation.

## [2.74.3] - 2019-05-17

## [2.74.2] - 2019-05-16

### Fixed

- Fix `orders` and `shipping` routes in Checkout Client.

## [2.74.1] - 2019-05-16

## Added

- Check when user is impersonated in `getPasswordLastUpdate`

## [2.74.0] - 2019-05-16

### Fixed

- `document` resolvers working according to the graphql schema.

### Changed

- Ported DocumentDataSource to MasterData IOClient
- Ported CheckoutDataSource to Checkout IOClient

## [2.73.3] - 2019-05-14

### Fixed

- Use filter for availability on facets query as well.

## [2.73.2] - 2019-05-14

### Fixed

- Search metadata for Brands.

## [2.73.1] - 2019-05-13

### Fixed

- Adds missing facets fields back after schema breaking change

## [2.73.0] - 2019-05-13

### Changed

- Translate terms (with `Messages`) before sending them to search api for `productSearch` and `facets` resolvers

## [2.72.2] - 2019-05-10

### Fixed

- Remove comma from invalid characters of product search.

## [2.72.1] - 2019-05-09

### Fixed

- Remove slugify on facets when computing selected property.

## [2.72.0] - 2019-05-09

### Added

- Autocomplete field resolvers for internationalization

### Changed

- scope from SEGMENT to PUBLIC for Brand related queries
- Splits Deparment, Brand etc types from Facets
- Product id as translation provider id

## [2.71.3] - 2019-05-09

### Changed

- Add Category/Brand name in `titleTag` when meta tag title are null.

## [2.71.2] - 2019-05-07

### Fixed

- Slugify facets when checking if is selected.
  ]

## [2.71.1] - 2019-05-07

## [2.71.0] - 2019-05-07

### Added

- Added `href` field to facets category. This field should be used to populate links in the store

### Changed

- SEGMENT scope to root field resolvers containing translatable fields

### Fixed

- Uses default sales channel as API language

## [2.70.4] - 2019-05-06

### Added

- Parameter `hideUnavailableItems` to catalog search queries.

## [2.70.3] - 2019-05-06

### Fixed

- Selected property in facets accounting for corresponding `map`.

## [2.70.2] - 2019-05-03

### Changed

- Add `/d` to `href` when it's a department.

### Fixed

- Fields `href` and `slug` from a subcategory.

## [2.70.1] - 2019-05-01

### Fixed

- Add `titleTag` and `metaTagDescription` in `productSearch` query.

## [2.70.0] - 2019-04-29

### Added

- `productSearch` query.

## [2.69.1] - 2019-04-29

## [2.69.0] - 2019-04-29

### Added

- `isEditable` field to `list` graphql type .

## [2.68.2] - 2019-04-26

### Fixed

- `map` field not required in `Facet` type.

## [2.68.1] - 2019-04-25

### Changed

- `Slug` field not required in `Facet` type.

## [2.68.0] - 2019-04-25

### Added

- Add fields `selected` and `map` to `Facet` type, alongside the camel case version of previous fields.

### Deprecated

- `search` query.

## [2.67.1] - 2019-04-24

### Fixed

- Check if composition is null before mapping over its items on itemMetadata priceTable resolver.

## [2.67.0] - 2019-04-23

### Changed

- Ported to native errors from `@vtex/api`

## [2.66.7] - 2019-04-18

## [2.66.6] - 2019-04-16

### Fixed

- `updateAddress` inner object in body was not stringfied.

## [2.66.5] - 2019-04-15

## [2.66.4] - 2019-04-15

### Fixed

- Return relative href within categories.
- Fix how category children field was resolved.

## [2.66.3] - 2019-04-15

### Fixed

- Typescript error introduced in Typescript 3.4.

## [2.66.2] - 2019-04-11

### Added

- Property `lastPasswordUpdate` to profile

## [2.66.1] - 2019-04-09

## [2.66.0] - 2019-04-09

## [2.65.0] - 2019-04-09

## [2.64.4] - 2019-04-05

### Fixed

- `ItemMetadata` will not return null when there is no priceTable for some item.

## [2.64.3] - 2019-04-04

### Changed

- Increase min replicas.

## [2.64.2] - 2019-04-03

### Added

- Add `ProductUniqueIdentifier` parameter in `product` query.

## [2.64.1] - 2019-04-02

### Fixed

- `withCurrentProfile` directive, create a profile for the user if he is logged but hasn't one yet.

## [2.64.0] - 2019-03-31

### Added

- Add `discountHighlights` field in `product` query.

## [2.63.5] - 2019-03-29

### Added

- `noImplicitAny` flag to `tsconfig.json`.

## [2.63.4] - 2019-03-28

## [2.63.3] - 2019-03-28

## [2.63.2] - 2019-03-28

## [2.63.1] - 2019-03-28

## [2.62.1] - 2019-03-28

### Added

- Created `cartIndex` resolver on `OrderFormItem`.

## [2.63.0] - 2019-03-28

## [2.62.0] - 2019-03-27

### Added

- Add `specificationGroups` in `product`'s resolvers.
- New mutation `subscribeNewsletter`.

## [2.61.1] - 2019-03-27

### Fixed

- `Invalid CEP` messages in checkout API. This was due to updating the order form shipping address with a masked session address. The fix was to check if the address was not masked before sending it to checkout api

## [2.61.0] - 2019-03-26

### Removed

- Subscription related queries, moved to the `my-subscriptions-graphql`.

## [2.60.7] - 2019-03-25

### Fixed

- Profile `birthDate` format.

## [2.60.6] - 2019-03-25

### Fixed

- Fix cookies not being properly sent to search API.

## [2.60.5] - 2019-03-22

### Fixed

- Filter assemblyOptions with composition not null for assemblyOptions resolver.

## [2.60.4] - 2019-03-21

## [2.60.3] - 2019-03-21

### Added

- Add `seller` field to `OrderFormItem`.

## [2.60.2] - 2019-03-20

## [2.60.1] - 2019-03-20

## [2.60.0] - 2019-03-20

## [2.59.2] - 2019-03-20

### Changed

- Return new order form if added assembly options at end of addItem mutation.

## [2.59.1] - 2019-03-19

## [2.59.0] - 2019-03-19

### Fixed

- Using `application/x-www-form-urlencoded` for logging-in instead of raw querystring with plain text credentials

## [2.59.0] - 2019-03-19 [YANKED]

### Removed

- `Subscriptions`, moving the queries to the other `my-subscriptions-graphql`.

## [2.58.0] - 2019-03-15

### Changed

- Removes datasources cache since it was mostly unnused

## [2.57.4] - 2019-03-13

## [2.57.3] - 2019-03-13

## [2.57.2] - 2019-03-13

### Fixed

- Error `argument str must be a string` in orderForm resolver

## [2.57.2] - 2019-03-13

### Fixed

- MakeRequest call in `redefinePassword` resolver

## [2.57.1] - 2019-03-13

## [2.57.0] - 2019-03-13

### Added

- A/B test between using proxy catalog or not
- Use new datasource exposing metrics

## [2.56.3] - 2019-03-13

### Fixed

- GoCommerce catalog does not accept HEAD. So every request should be switched back to a GET request

## [2.56.2] - 2019-03-13

- Use the parseFieldsToJson function in the updateDocument resolver.

## [2.56.1] - 2019-03-13

- Fix the Document.updateDocument call the in updateDocument resolver.

## [2.56.0] - 2019-03-12

### Changed

- Using `profileSystem` on `profile` related queries and mutations.

### Fixed

- Fix `payments` to `transactions` in Order graphql.

## [2.55.0] - 2019-03-12

### Fixed

- Using correct catalog method for proxy

## [2.54.2] - 2019-03-12

## [2.54.1] - 2019-03-07

# Fixed

- Bluebird-global related issues
- Typings on catalog proxy

## [2.54.0] - 2019-03-07

## [2.53.0] - 2019-03-07

### Added

- Adds `?sc` parameter to checkout and catalog dataSources when sales channel is available. Note that sales channel availability depends if the root field resolver has a `@cacheControl(scope: SEGMENT)` AND `@withSegment` directives
- get order by id query

## [2.52.1] - 2019-03-01

## [2.52.0] - 2019-02-28

### Added

- added pickupPoints query
- added updateOrderFormCheckin mutation

## [2.51.0] - 2019-02-27

### Added

- Create assembly options resolvers to `OrderFormItem`

## [2.50.3] - 2019-02-26

## [2.50.2] - 2019-02-26

### Changed

- Implement call to removeAssemblyOption on checkout data source
- Call it if passed assembly option with quantity 0

## [2.50.1] - 2019-02-25

### Fixed

- Headers' error in the `Document` dataSource.

## [2.50.0] - 2019-02-25

### Added

- Add logic to call addAssemblyOption to append assembly options to cart items

## [2.49.1] - 2019-02-22

### Fixed

- Fixes `Unexpected end of JSON input` errors in payments data source

## [2.49.0] - 2019-02-19

## [2.48.3] - 2019-02-14

### Added

- `address` on `Session` type

## [2.48.2] - 2019-02-14

### Fixed

- Fix `withCurrentProfile` directive, handling the case when the user is not signed in.

## [2.48.1] - 2019-02-12

### Fixed

- Fix cookie name in `isUserLoggedIn` function

## [2.48.0] - 2019-02-12

### Added

- Add `userLastOrder` query, fetching last logged in user order from OMS

## [2.47.1] - 2019-02-11

### Added

- Add assembly options fields to Order, OrderForm and Product types
- Create ItemMetadata type

## [2.47.0] - 2019-02-08

## [2.46.1] - 2019-02-04

### Added

- Add logic to sync orderFormId in cookies with session (soon to be implemented by checkout)
- Add logic to sync order form address with session (soon to be implemented by checkout)

## [2.46.0] - 2019-01-31

### Added

- `withCurrentProfile` to get the session that will be used on the profile related queries.

## [2.45.1] - 2019-01-30

## [2.44.3] - 2019-01-30

### Fixed

- Do not modify apollo request headers by overwritting the object

## [2.45.0] - 2019-01-16

### Changed

- Using new SEGMENT scoped directive

## [2.44.2] - 2019-01-14

### Added

- Add `currencyFormatInfo` on `storePreferencesData`, and its respective type.

## [2.44.1] - 2019-01-10

### Added

- @gocommerce/utils module to resolve if the current account is GoCommerce

## [2.44.0] - 2019-01-09

### Changed

- Upgrading node-vtex-api from 0.x to 1.x
- Removing unnecessary try..catch block in catalogProxy

## [2.43.2] - 2019-01-08

## [2.43.1] - 2019-01-08

### Changed

- Using IO/CI for releasing this repo

## [2.43.0] - 2019-01-07

### Added

- Add product list resolver.

## [2.42.0] - 2018-12-26

### Fixed

- Fix `seller` field type on OrderFormInput to accept strings as valid values
- Fix cart add on marketplace stores

## [2.41.3] - 2018-12-10

### Fixed

- `profileResolver`, now it is working for a impersonated customer.

## [2.41.2] - 2018-12-05

### Changed

- Changed min replicas to 6

## [2.41.1] - 2018-12-03

### Changed

- Removes custom axios config to avoid custom error handling.

## [2.41.0] - 2018-11-27

### Changed

- Update updateOrderFormShipping resolver and fix geoCoordinates field in address types

## [2.40.1] - 2018-11-23

### Fixed

- Use catalog proxy for total products API request.

### Changed

- Proxy all headers from catalog proxy.

## [2.40.0] - 2018-11-16

### Changed

- Isolate the query to `facets` and `products` from the search resolver.

## [2.39.1] - 2018-11-16

## [2.39.0] - 2018-11-14

### Added

- `SubscriptionOrders` resolvers

## [2.38.0] - 2018-11-09

## [2.37.0] - 2018-11-08

### Added

- Subscription resolvers

## [2.36.0] - 2018-11-08

## [2.35.1] - 2018-11-08

## [2.35.0] - 2018-11-7

## [2.34.4] - 2018-11-06

## [2.34.3] - 2018-11-6

## [2.34.2] - 2018-10-30

### Fixed

- canImpersonate of undefined
- reduce of undefined

## [2.34.1] - 2018-10-27

### Fixed

- Call catalog endpoint with HTTPS

## [2.34.0] - 2018-10-24

### Added

- Add `calculatedAttachments` resolver for the SKU.

## [2.33.0] - 2018-10-22

### Added

- Filtering of documents search with `where` param

### Fixed

- Creation of `VtexIdclientAutCookie` header

### Changed

- Using new @resolvers directive to set Vary http headers

## [2.32.3] - 2018-10-9

### Fixed

- Fix product search by slug returning no products because Catalog API is case-sensitive.

## [2.32.2] - 2018-10-09

### Changed

- Needs to have lint passing to publish store-graphql. If you are having problems publishing it, please remove the node_modules folder and run `yarn`

## [2.32.1] - 2018-10-5

### Fixed

- Add vary x-vtex-segment to prevent wrong cached responses.

## [2.32.0] - 2018-10-05

### Added

- Add `titleTag` and `metaTagDescription` in searchs for brand.

## [2.31.8] - 2018-10-03

### Fixed

- Add a regex in brand slug to remove special characters.

## [2.31.7] - 2018-10-02

### Fixed

- `updateOrderformShipping` passing of props in resolver and dataSource

## [2.31.6] - 2018-10-02

### Added

- `googleMapsKey` field on `LogisticsData` type

## [2.31.5] - 2018-10-01

### Changed

- Increased max replicas

## [2.31.4] - 2018-9-30

## [2.31.3] - 2018-09-28

## [2.31.2] - 2018-09-28

### Added

- Add OrderFormShippingData schema type

### Fixed

- Bug in updateOrderFormShipping resolver

## [2.31.1] - 2018-09-26

### Fixed

- Fix proxy catalog's querystring format

## [2.31.0] - 2018-09-26

### Changed

- Filter installments by criteria

## [2.30.2] - 2018-9-26

## Fixed

- Search term encoding

## [2.30.1] - 2018-09-26

## Fixed

- Search term cannot be nullable in search query

## [2.30.0] - 2018-9-24

## Changed

- Create an internal catalog proxy to cache responses on kube-router

## [2.29.3] - 2018-09-21

### Fixed

- Return email in `getSession` when a new user is logged.

## [2.29.2] - 2018-09-19

### Changed

- Change `email` to be a required field in `ProfileInput`.

## [2.29.1] - 2018-09-19

### Fixed

- Fix `updateProfile` mutation to update information of new users.

## [2.29.0] - 2018-9-17

### Changed

- Refact checkout resolvers to use dataSources
- Change catalog and checkout resolvers to account vtex_segment

## [2.28.1] - 2018-09-14

### Changed

- Using native support for dataSources

## [2.28.0] - 2018-09-13

### Changed

- Add dataSources to the catalogue API

## [2.27.1] - 2018-09-13

- Autocomplete working for GoCommerce

## [2.27.0] - 2018-09-12

### Fixed

- Argument type mismatch in url generation

### Changed

- Refactoring to use fields resolvers instead of manually parsing the fields

## [2.26.0] - 2018-09-05

### Added

- Add session query and remove initializeSession mutation.

## [2.25.4] - 2018-09-04

### Fixed

- Fix `/start` path of VTEX ID API.

### Changed

- Refact the auth mutations to make `POST` instead `GET` requests in API.

## [2.25.3] - 2018-08-31

### Added

- `isCorporate` field to ProfileInput

## [2.25.2] - 2018-08-30

### Added

- `isCorporate` field to Profile

## [2.25.1] - 2018-08-30

### Added

- List of SKU Item IDs in the Benefit Resolver to indicate what SKU Items are taking part in the benefit.

## [2.25.0] - 2018-08-29

### Added

- `profilePicture` query

### Changed

- Arguments and return type of `uploadProfilePicture` mutation and its `update` sibling

## [2.24.0] - 2018-08-29

### Added

- `setPassword` mutation.

## [2.23.3] - 2018-08-28

### Removed

- Unused additional query to facets api inside the search resolver.

## [2.23.2] - 2018-08-24

### Fixed

- _Hotfix_ Fix impersonable property name.

## [2.23.1] - 2018-08-24

### Changed

- Add `ImpersonatedUser` type in Session object.

## [2.23.0] - 2018-08-24

### Added

- New `payments` field to profile.

## [2.22.2] - 2018-08-23

### Changed

- Add optional fields `Id` and `Slug` to the `Facets` type.

## [2.22.1] - 2018-08-23

### Fixed

- Add similars data in `Recommendations` resolver.

## [2.22.0] - 2018-08-23

### Added

- New `Logistics` type and resolvers.

## [2.21.3] - 2018-08-23

### Changed

- Minor refact in session resolvers and add docs.

## [2.21.2] - 2018-08-23

### Fixed

- Syntax error in `Catalog` resolver.

## [2.21.1] - 2018-08-23

### Fixed

- Benefits resolver is now using only public endpoints.

## [2.21.0] - 2018-08-23

### Added

- Add `initializeSession`, `impersonate`, `depersonify` mutations to telemarketing app.

## [2.20.2] - 2018-08-22

### Fixed

- Throw specific error when the product is not found on product resolver in catalog.

## [2.20.1] - 2018-08-22

### Changed

- Return filtered facets based on the query and rest on the search resolver.

## [2.20.0] - 2018-08-15

### Added

- Add `ClientProfile` in `OrderForm` type.

### Changed

- Add `enableCookies: true` on checkout mutations.

## [2.19.1] - 2018-08-13

### Fixed

- Return profile on address delete

## [2.19.0] - 2018-08-13

### Added

- UploadAttachment resolver
- UpdateProfilePicture to allow replacing existing profile picture

### Changed

- UploadProfilePicture uses upload attachment resolver

## [2.18.1] - 2018-08-09

### Fixed

- Fix replace `http` to `https` to match only `http://`.

## [2.18.0] - 2018-08-08

### Changed

- Replace `http` to `https` in item `imageUrl` property.

## [2.17.0] - 2018-08-08

### Added

- Search in Gocommerce catalog when account is Gocommerce

## [2.16.0] - 2018-08-06

### Added

- Add title and meta tags in `category`, `search`, `brand` and `product` queries.

## [2.15.5] - 2018-08-03

### Fixed

- Removes undefined error in `Kititems` when products is undefined

## [2.15.4] - 2018-08-02

### Fixed

- `ProfileUpdate` mutation works when customFields only are provided

## [2.15.3] - 2018-07-30

### Fixed

- `Profile Resolver` error when profile data returned null.

## [2.15.2] - 2018-07-30

### Added

- `geoCoordinate` field to `address` query

## [2.15.1] - 2018-07-27

### Fixed

- `Update profile` mutation without custom fields.

## [2.15.0] - 2018-07-26

### Added

- `Login options` resolver.

## [2.14.0] - 2018-07-24

### Added

- Search resolver

## [2.12.6] - 2018-07-19

### Changed

- Changes custFields names to reflect Profile in CacheID

### Added

- Adds cacheId to Profile Custom Fields

## [2.12.5] - 2018-07-18

### Changed

- Bringing `benefitsProduct` back, after upgrade `app-store` to use `vtex.store@1.x`.

## [2.12.3] - 2018-07-17

### Fixed

- Change property name banefitProduct to product

## [2.12.2] - 2018-07-17

## [2.12.1] - 2018-07-16

### Added

- `country` field to `address` query

### Fixed

- Circular benefit query.

## [2.12.0] - 2018-07-13

### Added

- Possibility to extend profile info according to masterdata CL entity
- Adding file upload to Masterdata CL entity

## [2.11.1] - 2018-7-6

### Fixed

- Resolve null fields of product data in benefits resolver.

## [2.11.0] - 2018-7-4

### Added

- `OAuth` Resolver.
- Support for product retrievement into benefits resolver.

### Fixed

- Recommendations of product query to retrieve different products.

## [2.10.0] - 2018-7-4

### Added

- PriceRanges to facets graphql type

## [2.9.3] - 2018-7-2

### Fixed

- Benefits resolver was breaking with the returned data being null.

## [2.9.2] - 2018-7-2

### Added

- Added cacheId field to root types.

## [2.9.1] - 2018-6-27

### Fixed

- Fixed bug in `logout` mutation that didn't log out correctly.

## [2.9.0] - 2018-6-26

### Added

- Add `recoveryPassword` mutation in auth resolver.

## [2.8.0] - 2018-6-25

### Added

- Add classic login mutation.

### Changed

- Refact auth resolver.

## [2.7.2] - 2018-6-20

### Fixed

- Fix products search query only adding a category if there is not a search term.

## [2.7.1] - 2018-6-20

### Fixed

- Fix `vtexId` use on `paths.ts`.

## [2.7.0] - 2018-6-19

### Added

- Add documentation in `graphql` files.

### Changed

- Refact paths and organize API docs.
- Profile Query will return the user email in case of data not found.

### Fixed

- Fix `profile resolver` to use ioContext authToken.

## [2.6.1] - 2018-6-15

### Fixed

- Set the `maxAge` received from VTEXID to `VtexIdclientAutCookie_${account}` in `accessKeySigIn` mutation.

## [2.6.0] - 2018-6-15

### Added

- Create the logout mutation.

## [2.5.2] - 2018-6-14

### Fixed

- Fix `recommendations` field resolver.

## [2.5.1] - 2018-6-8

### Fixed

- Remove `VtexTemporarySession` to AuthInput.

## [2.5.0] - 2018-6-8

### Added

- Sets cache hints to schema root fields

### Fixed

- Fix profile query to reflect changes that were made in auth resolver.
- Fix authentication resolver to sign in only account users.

## [2.4.2]

### Changed

- Changed `shipping` query to perform freight simulation correctly.

### Fixed

- Fixed `profile` query permissions to read masterdata private fields

## [2.3.3] - 2018-04-10

### Added

- **Resolver** Add to the `autocomplete` query the `slug` property

### Changed

- **Resolver** Change the `OrderForm` query to parse the integer prices to float.

## [2.3.2] - 2018-04-05

### Fixed

- **Path** Product path was missing specification field.

## [2.3.1] - 2018-05-03

### Added

- Add `map` param to the `products` query

### Fixed

- Fix the `products` query to reject invalid characters

## [2.1.0] - 2018-09-04

### Added

- Add `map` param to the `products` query

### Fixed

- Fix the `products` query to reject invalid characters

## [2.3.0] - 2018-04-27

### Added

- **Product Query** Add `productClusters` to the `product` query

## [2.2.0] - 2018-04-16

### Added

- **Resolver** Create `documentResolver` to provide `create`, `retrieve` and `update` Documents.
- **Resolver** Create `brands` resolver to provide all brands from store.

### Changed

- **Resolver** Fix `authResolver` to set `HTTPOnly` on cookies.

## [2.1.0] - 2018-04-09

### Added

- **Resolver** Login resolver to provide GraphQL queries and mutations.
