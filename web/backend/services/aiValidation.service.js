export async function validateProviderApiKey(provider, apiKey) {
  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    return {
      valid: false,
      error: "API key is required",
    };
  }

  const cleanKey = apiKey.trim();

  try {
    switch (provider) {
      case "openai": {
        const response = await fetch("https://api.openai.com/v1/models", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cleanKey}`,
          },
          signal: AbortSignal.timeout(10000),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            valid: false,
            error: data.error?.message || `OpenAI error: HTTP ${response.status}`,
          };
        }

        const rawList = data.data || [];
        const chatModels = rawList
          .filter((m) => /^(gpt-|o1|o3|chatgpt)/.test(m.id))
          .map((m) => ({
            label: m.id,
            value: m.id,
          }));

        if (chatModels.length === 0) {
          return {
            valid: false,
            error: "No chat-compatible models found for this OpenAI key.",
          };
        }

        chatModels.sort((a, b) => {
          const priority = (name) => {
            if (name.startsWith("gpt-4o")) return 1;
            if (name.startsWith("o3")) return 2;
            if (name.startsWith("o1")) return 3;
            if (name.startsWith("gpt-4")) return 4;
            return 5;
          };
          return priority(a.value) - priority(b.value);
        });

        return {
          valid: true,
          provider: "openai",
          models: chatModels,
        };
      }

      case "anthropic": {
        const response = await fetch("https://api.anthropic.com/v1/models", {
          method: "GET",
          headers: {
            "x-api-key": cleanKey,
            "anthropic-version": "2023-06-01",
          },
          signal: AbortSignal.timeout(10000),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            valid: false,
            error: data.error?.message || `Anthropic error: HTTP ${response.status}`,
          };
        }

        const rawList = data.data || [];
        const models = rawList.map((m) => ({
          label: m.display_name ? `${m.display_name} (${m.id})` : m.id,
          value: m.id,
        }));

        if (models.length === 0) {
          return {
            valid: false,
            error: "No models returned by Anthropic for this key.",
          };
        }

        return {
          valid: true,
          provider: "anthropic",
          models,
        };
      }

      case "google": {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`,
          {
            method: "GET",
            signal: AbortSignal.timeout(10000),
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            valid: false,
            error: data.error?.message || `Google API error: HTTP ${response.status}`,
          };
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
          return {
            valid: false,
            error: "No generateContent-compatible Gemini models found for this key.",
          };
        }

        return {
          valid: true,
          provider: "google",
          models: geminiModels,
        };
      }

      case "deepseek": {
        const response = await fetch("https://api.deepseek.com/models", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cleanKey}`,
          },
          signal: AbortSignal.timeout(10000),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            valid: false,
            error: data.error?.message || `DeepSeek error: HTTP ${response.status}`,
          };
        }

        const rawList = data.data || [];
        const models = rawList.map((m) => ({
          label: m.id,
          value: m.id,
        }));

        if (models.length === 0) {
          return {
            valid: false,
            error: "No models returned by DeepSeek for this key.",
          };
        }

        return {
          valid: true,
          provider: "deepseek",
          models,
        };
      }

      case "qwen": {
        const response = await fetch(
          "https://dashscope.aliyuncs.com/compatible-mode/v1/models",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cleanKey}`,
            },
            signal: AbortSignal.timeout(10000),
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          return {
            valid: false,
            error: data.message || data.error?.message || `Qwen DashScope error: HTTP ${response.status}`,
          };
        }

        const rawList = data.data || [];
        const models = rawList
          .filter((m) => m.id.toLowerCase().includes("qwen"))
          .map((m) => ({
            label: m.id,
            value: m.id,
          }));

        if (models.length === 0) {
          return {
            valid: false,
            error: "No Qwen models returned by DashScope for this key.",
          };
        }

        return {
          valid: true,
          provider: "qwen",
          models,
        };
      }

      default:
        return {
          valid: false,
          error: `Unsupported provider: ${provider}`,
        };
    }
  } catch (error) {
    return {
      valid: false,
      error: error.message || "Failed to connect to provider verification service",
    };
  }
}
