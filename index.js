import path from 'path';
import { buildQueryString, templateInitCounters } from "./utils";

export default function googleAnalytics (moduleOptions) {
  // don't include on dev mode
  if (!moduleOptions.development && process.env.NODE_ENV !== 'production') {
    return;
  }

  const {
    staticCounters,
    options
  } = moduleOptions;

  const bootCounters = [].concat( staticCounters || [] );
  const libQuery = {};

  if (bootCounters.length) {
    Object.assign(libQuery, { id: bootCounters[ 0 ].id });
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
