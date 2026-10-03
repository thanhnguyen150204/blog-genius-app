import { AppProvider } from "@shopify/shopify-app-react-router/react";
import {
  AppProvider as PolarisAppProvider,
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  Text,
  BlockStack,
} from "@shopify/polaris";
import polarisTranslations from "@shopify/polaris/locales/en.json";
import { useState } from "react";
import { Form, useActionData, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const loader = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export const action = async ({ request }) => {
  const errors = loginErrorMessage(await login(request));
  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [shop, setShop] = useState("");
  const { errors } = actionData || loaderData;

  return (
    <AppProvider embedded={false}>
      <PolarisAppProvider i18n={polarisTranslations}>
        <Page>
          <div style={{ maxWidth: "480px", margin: "40px auto" }}>
            <Card>
              <Form method="post">
                <BlockStack gap="400">
                  <Text variant="headingLg" as="h1">
                    Log in
                  </Text>
                  <FormLayout>
                    <TextField
                      name="shop"
                      label="Shop domain"
                      helpText="example.myshopify.com"
                      value={shop}
                      onChange={(val) => setShop(val)}
                      autoComplete="on"
                      error={errors.shop}
                    />
                    <Button submit variant="primary">
                      Log in
                    </Button>
                  </FormLayout>
                </BlockStack>
              </Form>
            </Card>
          </div>
        </Page>
      </PolarisAppProvider>
    </AppProvider>
  );
}
