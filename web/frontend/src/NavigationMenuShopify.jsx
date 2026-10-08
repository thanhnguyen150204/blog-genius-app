import { NavMenu } from "@shopify/app-bridge-react";
import { Link } from "react-router-dom";

export function NavigationMenuShopify() {
  return (
    <NavMenu>
      <Link to="/" rel="home">BlogGenius</Link>
      <Link to="/studio">Content Studio</Link>
      <Link to="/keywords">Keywords</Link>
      <Link to="/pricing">Pricing</Link>
      <Link to="/settings">Settings</Link>
    </NavMenu>
  );
}

export default NavigationMenuShopify;
