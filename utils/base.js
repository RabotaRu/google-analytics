/**
 * @param {string} id
 * @param {string} libFnName
 * @return {string}
 */
export function templateInitCounter (id, libFnName) {
  return `
    ${libFnName}('config', '${id}');
  `;
}

/**
 * @param {Array<string>} counters
 * @param {string} libFnName
 * @return {*}
 */
export function templateInitCounters (counters, libFnName) {
  return counters.reduce((result, id) => {
    return result + templateInitCounter( id, libFnName );
  }, '');
}

/**
 * @param {Object} params
 * @returns {string}
 */
export function buildQueryString (params) {
  if (!params) {
    params = {};
  }
  const pairs = [];
  for (const paramKey in params) {
    if (!params.hasOwnProperty(paramKey)) {
      continue;
    }
    pairs.push( `${paramKey}=${encodeURIComponent( params[paramKey] )}` );
  }
  return pairs.join( '&' );
}
