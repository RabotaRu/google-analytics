import { GoogleLayer } from "@rabota/analytics-layer";

export default async (context, inject) => {
  const pluginOptions = <%= serialize(options) %>;

  const { app: { router } } = context;
  let {
    counter,
    includeCounters = [],
    options = {}, // google analytics options
    logging = false,
    spa = true
  } = pluginOptions;

  const layer = new GoogleLayer({
    logging, options
  });

  // inject google analytics layer into context
  inject( 'ga', layer );

  const isAvailable = typeof window !== 'undefined' && !!window[ layer.layerName ];

  if (!isAvailable) {
    return;
  }

  const isDynamicCounter = typeof counter === 'function';
  const isDynamicIncludedCounters = typeof includeCounters === 'function';

  // resolve all counters
  counter = await resolveCounters( counter, context ).then(counters => {
    return counters && counters.length && counters[ 0 ];
  });

  includeCounters = await resolveCounters( includeCounters, context );

  // set resolved counters
  layer.setCounter( counter );
  layer.setIncludedCounters( includeCounters );

  // assemble counters still not initialized
  const countersToInit = [];

  if (isDynamicCounter) {
    countersToInit.push( counter );
  }

  if (isDynamicIncludedCounters) {
    countersToInit.push( ...includeCounters );
  }

  layer.init( countersToInit );

  if (spa && router) {

    let ready = false;

    router.onReady(() => {
      ready = true
    });

    // subscribe to router events
    router.afterEach((to, from) => {
      if (!ready) {
        return;
      }

      layer.init( layer.counters, { 'page_path': to.fullPath } );
    });
  }
}

/**
 * @param {number|string|Array<number|string>|Function} countersOrFn
 * @param {*} context
 * @return {Promise<Array<string|number>>}
 */
async function resolveCounters (countersOrFn, context) {
  const useFn = typeof countersOrFn === 'function';
  const wrappedFn = Promise.resolve(
    useFn
      ? countersOrFn( context )
      : countersOrFn
  );

  return wrappedFn.then(counters => {
    return [].concat( counters || [] );
  });
}
