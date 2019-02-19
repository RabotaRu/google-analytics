import path from 'path';
import { buildQueryString, templateInitCounters } from "./utils";

export default function yandexMetrika (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  const {
    counter,
    includeCounters,
    options
  } = moduleOptions;

  const isDynamicCounter = typeof counter === 'function';
  const isDynamicIncludedCounters = typeof includeCounters === 'function';

  const includeCounterBoot = counter && !isDynamicCounter;
  const includeAdditionalCountersBoot = includeCounters && !isDynamicIncludedCounters;

  const bootCounters = [];

  if (includeCounterBoot) {
    bootCounters.push( counter );
  }

  if (includeAdditionalCountersBoot) {
    bootCounters.push( ...includeCounters );
  }

  const libQuery = {};

  if (includeCounterBoot) {
    Object.assign(libQuery, { id: counter });
  }

  const libQueryString = buildQueryString( libQuery );
  const libURL = `https://www.googletagmanager.com/gtag/js${libQueryString ? '?' + libQueryString : ''}`;
  const libFnName = 'gtag';

  // google analytics init script
  let injection = `
    window.dataLayer = window.dataLayer || [];
    function gtag () {
      dataLayer.push( arguments );
    }
    gtag('js', new Date());
  `;

  // include counters config setup
  injection += templateInitCounters( bootCounters, libFnName );

  const scripts = [{
    src: libURL,
    async: ''
  }, {
    innerHTML: injection.trim()
  }];

  this.options.head.__dangerouslyDisableSanitizers = [ 'script', 'noscript' ];
  this.options.head.script.push( ...scripts );

  // register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: true,
    options: moduleOptions
  });
};

module.exports.meta = require( './package.json' );
