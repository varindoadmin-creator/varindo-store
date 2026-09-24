import Script from 'next/script';

// One gtag.js load serves both: Google Ads conversion measurement, and GA4
// visitor analytics (which VIA Suite reads back for its Website Traffic page).
// GA4's enhanced measurement counts client-side route changes as page views,
// so App Router navigations need no extra wiring.
const GOOGLE_ADS_ID = 'AW-11294962169';
const GA4_MEASUREMENT_ID = 'G-80HSB90K4T';

export function GoogleTag() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_MEASUREMENT_ID}');
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
