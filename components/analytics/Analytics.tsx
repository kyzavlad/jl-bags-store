'use client'

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ADS_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO

// The Google Ads account ID (AW-XXXXXXXXXX) is the part of the conversion
// send_to before the "/". gtag.js must be configured with it for the account
// to register conversions, even when GA4 isn't in use.
const ADS_ID = ADS_SEND_TO ? ADS_SEND_TO.split('/')[0] : undefined

// gtag.js is shared between GA4 and Google Ads — load it if either is set.
const GTAG_SRC_ID = GA_ID || ADS_ID

/**
 * Loads gtag.js (GA4 and/or Google Ads) and Meta Pixel when their env vars
 * are set. Renders nothing if vars are absent — safe in development.
 */
export function Analytics() {
  return (
    <>
      {GTAG_SRC_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_SRC_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {[
              `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`,
              GA_ID ? `gtag('config','${GA_ID}',{page_path:window.location.pathname});` : '',
              ADS_ID ? `gtag('config','${ADS_ID}');` : '',
            ].join('')}
          </Script>
        </>
      )}

      {PIXEL_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  )
}
