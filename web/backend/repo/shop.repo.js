import Shop from "../model/shop.model.js";

export const findByDomain = async (shopDomain) => {
  return Shop.findOne({ shopDomain: shopDomain.toLowerCase() });
};

export const findActiveByDomain = async (shopDomain) => {
  return Shop.findOne({
    shopDomain: shopDomain.toLowerCase(),
    isActive: true,
  });
};

export const upsertShop = async ({
  shopDomain,
  accessToken,
  scope = "",
  email,
  shopName,
  currency,
}) => {
  const normalizedDomain = shopDomain.toLowerCase();

  return Shop.findOneAndUpdate(
    { shopDomain: normalizedDomain },
    {
      $set: {
        accessToken,
        scope,
        isActive: true,
        uninstalledAt: null,
        ...(email && { email }),
        ...(shopName && { shopName }),
        ...(currency && { currency }),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

export const deactivateShop = async (shopDomain) => {
  return Shop.findOneAndUpdate(
    { shopDomain: shopDomain.toLowerCase() },
    {
      $set: {
        isActive: false,
        uninstalledAt: new Date(),
      },
    },
    { new: true }
  );
};

export const updatePlan = async (shopDomain, plan) => {
  return Shop.findOneAndUpdate(
    { shopDomain: shopDomain.toLowerCase() },
    { $set: { plan } },
    { new: true }
  );
};
