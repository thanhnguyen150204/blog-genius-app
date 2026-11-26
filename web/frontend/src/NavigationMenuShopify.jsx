import { NavMenu } from "@shopify/app-bridge-react";
import { Link } from "react-router-dom";

/**
 * NavigationMenuShopify
 *
 * App Bridge v4: <NavMenu> registers navigation links with Shopify Admin.
 * Shopify Admin reads the anchor elements from DOM and displays them
 * in its left sidebar under the app name ("BlogGenius").
 * Shopify automatically hides the in-page elements via its own CSS injection.
 * Do NOT wrap in display:none or clip — Shopify needs normal DOM access.
 */
export function NavigationMenuShopify() {
  return (
    <NavMenu>
      <Link to="/" rel="home">BlogGenius</Link>
      <Link to="/studio">Content Studio</Link>
      <Link to="/content-ideas">Content idea</Link>
      <Link to="/keywords">Keywords</Link>
      <Link to="/pricing">Pricing</Link>
      <Link to="/settings">Settings</Link>
    </NavMenu>
  );
}

export default NavigationMenuShopify;
