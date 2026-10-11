import { useState, useEffect } from "react";
import {
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  TextField,
  Select,
  Button,
  Badge,
  Banner,
} from "@shopify/polaris";
import {
  AI_PROVIDER_OPTIONS,
  AI_PROVIDER_METADATA,
} from "./SettingsHelpers";

async function fetchModelsDirectFromProvider(provider, apiKey) {
  const cleanKey = apiKey.trim();

  switch (provider) {
    case "google": {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error?.message || `Google API error (HTTP ${res.status})`);
      }
      const rawList = data.models || [];
      const geminiModels = rawList
        .filter((m) => m.supportedGenerationMethods?.includes("generateContent"))
        .map((m) => {
          const id = m.name.replace(/^models\//, "");
          return {
            label: m.displayName ? `${m.displayName} (${id})` : id,
            value: id,
          };
        });
      if (geminiModels.length === 0) {
        throw new Error("This Google account has no models supporting generateContent.");
      }
      return geminiModels;
    }

    case "openai": {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${cleanKey}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error?.message || `OpenAI error (HTTP ${res.status})`);
      }
      const rawList = data.data || [];
      const chatModels = rawList
        .filter((m) => /^(gpt-|o1|o3|chatgpt)/.test(m.id))
        .map((m) => ({ label: m.id, value: m.id }));
      if (chatModels.length === 0) {
        throw new Error("No chat models available for this OpenAI key.");
      }
      chatModels.sort((a, b) => {
        const p = (name) => {
          if (name.startsWith("gpt-4o")) return 1;
          if (name.startsWith("o3")) return 2;
          if (name.startsWith("o1")) return 3;
          if (name.startsWith("gpt-4")) return 4;
          return 5;
        };
        return p(a.value) - p(b.value);
      });
      return chatModels;
    }

    case "anthropic": {
      const res = await fetch("https://api.anthropic.com/v1/models", {
        headers: {
          "x-api-key": cleanKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error?.message || `Anthropic error (HTTP ${res.status})`);
      }
      const rawList = data.data || [];
      const models = rawList.map((m) => ({
        label: m.display_name ? `${m.display_name} (${m.id})` : m.id,
        value: m.id,
      }));
      if (models.length === 0) {
        throw new Error("No models returned by Anthropic for this key.");
      }
      return models;
    }

    case "deepseek": {
      const res = await fetch("https://api.deepseek.com/models", {
        headers: { Authorization: `Bearer ${cleanKey}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error?.message || `DeepSeek error (HTTP ${res.status})`);
      }
      const rawList = data.data || [];
      const models = rawList.map((m) => ({
        label: m.id,
        value: m.id,
      }));
      if (models.length === 0) {
        throw new Error("No models returned by DeepSeek for this key.");
      }
      return models;
    }

    case "qwen": {
      const res = await fetch(
        "https://dashscope.aliyuncs.com/compatible-mode/v1/models",
        {
          headers: { Authorization: `Bearer ${cleanKey}` },
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error?.message || `Qwen DashScope error (HTTP ${res.status})`);
      }
      const rawList = data.data || [];
      const models = rawList
        .filter((m) => m.id.toLowerCase().includes("qwen"))
        .map((m) => ({
          label: m.id,
          value: m.id,
        }));
      if (models.length === 0) {
        throw new Error("No Qwen models returned by DashScope for this key.");
      }
      return models;
    }

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export default function ClaudeApiKeySection({
  aiProvider = "anthropic",
  setAiProvider,
  aiKeys = {},
  setAiKeys,
  aiModel,
  setAiModel,
}) {
  const currentKey = aiKeys[aiProvider] || "";
  const currentMeta = AI_PROVIDER_METADATA[aiProvider] || AI_PROVIDER_METADATA.anthropic;

  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState("idle"); 
  const [validationError, setValidationError] = useState("");
  const [unlockedModels, setUnlockedModels] = useState([]);

  useEffect(() => {
    setUnlockedModels([]);
    setValidationStatus("idle");
    setValidationError("");
    if (setAiModel) {
      setAiModel("");
    }
  }, [aiProvider]);

  const handleProviderChange = (newProvider) => {
    if (setAiProvider) {
      setAiProvider(newProvider);
    }
  };

  const handleKeyChange = (val) => {
    if (setAiKeys) {
      setAiKeys((prev) => ({
        ...prev,
        [aiProvider]: val,
      }));
    }
    setValidationStatus("idle");
    setValidationError("");
    setUnlockedModels([]);
    if (setAiModel) {
      setAiModel("");
    }
  };

  const handleValidateKey = async () => {
    if (!currentKey.trim()) {
      setValidationError("Please enter an API key before validating");
      setValidationStatus("invalid");
      setUnlockedModels([]);
      return;
    }

    setIsValidating(true);
    setValidationError("");
    setUnlockedModels([]);

    try {
      let fetchedModels = null;
      try {
        const res = await fetch("/api/ai/validate-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: aiProvider,
            apiKey: currentKey.trim(),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.valid && Array.isArray(data.models) && data.models.length > 0) {
            fetchedModels = data.models;
          } else if (data.valid === false) {
            throw new Error(data.error || "Invalid API key or unauthorized");
          }
        }
      } catch (backendErr) {
        if (backendErr.message && !backendErr.message.includes("Failed to fetch")) {
          throw backendErr;
        }
      }

      if (!fetchedModels) {
        fetchedModels = await fetchModelsDirectFromProvider(aiProvider, currentKey);
      }

      if (fetchedModels && fetchedModels.length > 0) {
        setValidationStatus("valid");
        setUnlockedModels(fetchedModels);

        if (setAiModel) {
          setAiModel(fetchedModels[0].value);
        }

        if (window.shopify?.toast) {
          window.shopify.toast.show(
            `Connected to ${currentMeta.name}! Successfully loaded ${fetchedModels.length} models.`
          );
        }
      } else {
        throw new Error(`No models returned by ${currentMeta.name} for this key.`);
      }
    } catch (err) {
      setValidationStatus("invalid");
      setUnlockedModels([]);
      if (setAiModel) {
        setAiModel("");
      }
      setValidationError(err.message || "API key verification failed");
      if (window.shopify?.toast) {
        window.shopify.toast.show(err.message || "API key verification failed", {
          isError: true,
        });
      }
    } finally {
      setIsValidating(false);
    }
  };

  const modelOptions =
    unlockedModels.length > 0
      ? unlockedModels
      : [
          {
            label: "-- No models available --",
            value: "",
          },
        ];

  return (
    <Layout.AnnotatedSection
      id="ai-model-provider"
      title="AI Provider & API key"
      description="Select your preferred AI provider (OpenAI, Anthropic, Google, DeepSeek, Qwen) and enter your API key. The system will query the provider's official service directly to verify the key and retrieve models available for your account."
    >
      <Card>
        <BlockStack gap="400">
          <Select
            label="Select AI Provider"
            options={AI_PROVIDER_OPTIONS}
            value={aiProvider}
            onChange={handleProviderChange}
          />

          <BlockStack gap="200">
            <BlockStack gap="100">
              <Text variant="bodyMd" as="span">
                {currentMeta.keyLabel}
              </Text>
              <InlineStack gap="200" blockAlign="center">
                <div style={{ flex: 1 }}>
                  <TextField
                    label={currentMeta.keyLabel}
                    labelHidden
                    type="password"
                    value={currentKey}
                    onChange={handleKeyChange}
                    autoComplete="off"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleValidateKey}
                  loading={isValidating}
                  disabled={!currentKey.trim()}
                >
                  Validate Key
                </Button>
              </InlineStack>
            </BlockStack>

            <InlineStack align="space-between" blockAlign="center" wrap gap="200">
              {validationStatus === "valid" && (
                <Badge tone="success">
                  {`✓ API Key Valid (${unlockedModels.length} models found)`}
                </Badge>
              )}
              {validationStatus === "invalid" && (
                <Badge tone="critical">✕ Invalid API Key</Badge>
              )}
              {validationStatus === "idle" && (
                <Badge tone="attention">Not verified</Badge>
              )}
            </InlineStack>

            {validationStatus === "invalid" && validationError && (
              <Banner tone="critical">
                <Text variant="bodySm" as="p">
                  {validationError}
                </Text>
              </Banner>
            )}

            {validationStatus === "valid" && (
              <Banner tone="success">
                <Text variant="bodySm" as="p">
                  API key is valid! Successfully connected to {currentMeta.name} and loaded {unlockedModels.length} available models for your account.
                </Text>
              </Banner>
            )}
          </BlockStack>

          <BlockStack gap="200">
            <Select
              label={`${currentMeta.name} Model`}
              options={modelOptions}
              value={aiModel}
              onChange={setAiModel}
              disabled={unlockedModels.length === 0}
            />

            {aiModel && unlockedModels.length > 0 && (
              <InlineStack gap="200" blockAlign="center">
                <Text variant="bodyXs" tone="subdued">
                  Active model for blog generation:
                </Text>
                <Badge tone="info">{aiModel}</Badge>
              </InlineStack>
            )}
          </BlockStack>
        </BlockStack>
      </Card>
    </Layout.AnnotatedSection>
  );
}
