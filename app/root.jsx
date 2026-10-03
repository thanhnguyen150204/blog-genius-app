import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "@shopify/polaris/build/esm/styles.css";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        {/* Critical inline CSS to prevent Polaris SVG icon explosion (FOUC) during load */}
        <style dangerouslySetInnerHTML={{ __html: `
          .Polaris-Icon,
          .Polaris-Icon svg,
          .Polaris-Banner__Ribbon,
          .Polaris-Banner__Ribbon svg {
            width: 20px !important;
            height: 20px !important;
            max-width: 20px !important;
            max-height: 20px !important;
          }
          .Polaris-Icon {
            margin: 0 !important;
          }
        `}} />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
