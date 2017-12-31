import React from 'react'
import Head from 'next/head'
import Script from './Script'

export default ({activeTab, badge}) => {
  const title = [
    `SwapWatch - ${activeTab}`,
    badge && `(${badge})`
  ].filter(f => f).join(' ')

  return (
    <Head>
      <title>{title}</title>

      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" rel="stylesheet" />
      <link href="/static/reflex.min.css" rel="stylesheet" />
      <link href="/static/main.css" rel="stylesheet" />

      <script src="//d2wy8f7a9ursnm.cloudfront.net/v4/bugsnag.min.js"></script>
      <Script>{`
        window.bugsnagClient = bugsnag('135449dbe2c1c79a4a1009daeb951dca')
      `}</Script>

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
}
