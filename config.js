// ============================================================
// price placeholders config
// Copyright (c) 2026 uh.izaak. All rights reserved.
// Unauthorised copying or distribution is prohibited.
// ============================================================
// add ur discord invte and pricing here
// ============================================================

const SITE_CONFIG = {
  discordLink: "https://discord.gg/inv",

  plans: [
    {
      name: "Free Trial",
      price: "£0",
      priceLabel: "forever",
      description: "Get started for free.",
      features: [
        "3 day trial",
        "1 use per day",
        "Basic accuracy",
        "Discord support",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Lifetime",
      price: "£6", // set or edit your price here
      priceLabel: "one-time",
      description: "Pay once, use forever.",
      features: [
        "Unlimited Sparx Maths, Reader & Science",
        "99% accuracy guarantee",
        "Custom simulated time",
        "Automated scheduling",
        "Priority Discord support",
        "All future updates included",
      ],
      cta: "Get Lifetime Access",
      highlighted: true,
    },
  ],
};
