import React from 'react'
import Head from 'next/head'
import Script from './Script'

export default () => (
  <Head>
    <title>SwapWatch</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" />
    <link href="/static/reflex.min.css" rel="stylesheet" />
    <link href="/static/main.css" rel="stylesheet" />

    <Script>{`
      var _gauges = _gauges || [];
      (function() {
        var t   = document.createElement('script');
        t.type  = 'text/javascript';
        t.async = true;
        t.id    = 'gauges-tracker';
        t.setAttribute('data-site-id', '5a46b30bba4ae37b4a0247bc');
        t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
        t.src = 'https://d2fuc4clr7gvcn.cloudfront.net/track.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(t, s);
      })();
    `}</Script>
  </Head>
)
