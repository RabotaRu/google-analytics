# Google Analytics
[![npm](https://img.shields.io/npm/dt/@rabota/google-analytics.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/google-analytics)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@rabota/google-analytics/latest.svg?style=flat-square)](https://www.npmjs.com/package/@rabota/google-analytics)

> Add Google Analytics to your nuxt.js application.

This plugins automatically sends first page and route change events to [Google Analytics](https://developers.google.com/analytics/devguides/collection/gtagjs/).

```
yarn add @rabota/google-analytics
```
or
```
npm install --save @rabota/google-analytics
```

## Table of contents

- [Features](#features)
- [Setup](#setup)
- [Options](#options)
- [Examples](#examples)
- [Methods](#methods)
- [Links](#links)
- [License](#license)
- [Author](#author)

## Features

- Supports multiple IDs
- You can pass an async function to provide IDs
- Easy-to-use API
- Automatically handling all SPA caveats (`spa: true` [option](#options))
- gtag API
- Logging

**Note:** Google Analytics is disabled in development mode by default.
You can set `development` option to `true` to run Google Analytics in development mode.

## Setup
- Add `@rabota/google-analytics` dependency using yarn or npm to your project
- Add `@rabota/google-analytics` to `modules` section of `nuxt.config.js`
```js
{
  modules: [
    ['@rabota/google-analytics', [
      counter: 'GA_TRACKING_ID', // main tracking ID
      includeCounters: [ 'GA_TRACKING_ID_2', ..., 'GA_TRACKING_ID_3' ], // additional tracking IDs
      options: {
       // google analytics options
      },
      spa: true, // sends new pages to GA in SPA
      logging: true, // logs all events to each counter
      development: true
    }]
  ]
}
````

## Options

### `counter` 
```{string|Function}``` Tracking ID

Could be an async function that returns an ID.

### `includeCounters` 
```{string|Array<string>|Function}``` Additional tracking IDs

Could be an async function that returns one or array of IDs.

### `options` 
```{Object}``` Google Analytics (todo)

### `spa` 
```{boolean}``` Sends new pages & pageviews to GA in SPA (default: `true`).

### `logging` 
```{boolean}``` Output all sending events for each counter (default: `false`).

### `development` 
```{boolean}``` set `true` if you want to run GA in dev mode. By default GA is disabled in dev mode.

## Methods

`this.$ga` - is a [Layer Instance](https://github.com/RabotaRu/analytics-layer).

### `#pushAll`

Same as `gtag` [function](https://developers.google.com/analytics/devguides/collection/gtagjs/) of GA.
Sends data to all trackers.

### `#pushTo`

The same as `gtag` [function](https://yandex.com/support/metrica/code/counter-initialize.html) of GA. 
Sends data to specific tracker.

More information about GA routing: [https://developers.google.com/gtagjs/devguide/routing](https://developers.google.com/gtagjs/devguide/routing)

More `methods` or `properties` you can find here: [@rabota/analytics-layer/src/layer.js](https://github.com/RabotaRu/analytics-layer/blob/master/src/layer.js).

## Examples

After [setup](#setup) you can access the GA through `this.$ga` instance in any component you need.

```js
export default {
  mounted () {
    this.$ga.pushAll('event', 'add_to_cart', {
      'items': [
        'id': 'U1234',
        'ecomm_prodid': 'U1234',
        'name': 'Argyle Funky Winklepickers',
        'list': 'Search Results',
        'category': 'Footwear',
        'quantity': 1,
        'ecomm_totalvalue': 123.45,
        'price': 123.45
      ]
    });
  }
}
```

Send to a specific tracker

```js
export default {
  mounted () {
    this.$ga.pushTo( 'GA_TRACKING_ID', 'event', 'event-name', params );
  }
}
```

## Links

- [Documentation for Google Analytics (gtag)](https://developers.google.com/analytics/devguides/collection/gtagjs/sending-data)

## License

MIT

## Author

Alexander Belov (c) 2019
