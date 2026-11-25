import { BrowserRouter } from "react-router-dom";
import { AppProvider, Frame } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import NavigationMenuShopify from "./NavigationMenuShopify";
import Routes from "./Routes";
import "./App.css";

export default function App() {
  return (
    <AppProvider i18n={enTranslations}>
      <BrowserRouter>
        <Frame>
          <NavigationMenuShopify />
          <Routes />
        </Frame>
      </BrowserRouter>
    </AppProvider>
  );
}
