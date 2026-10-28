
require("dotenv").config();

async function main() {
  const {
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_WEBHOOK_SECRET,
    APP_URL,
  } = process.env;

  const baseUrl = APP_URL?.trim()?.replace(/\/+$/, "");

  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN missing hai .env mein");
  }

  if (!TELEGRAM_WEBHOOK_SECRET) {
    throw new Error("TELEGRAM_WEBHOOK_SECRET missing hai .env mein");
  }

  if (!baseUrl) {
    throw new Error("APP_URL missing hai .env mein");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: `${baseUrl}/telegram-webhook`,
        secret_token: TELEGRAM_WEBHOOK_SECRET,
        allowed_updates: ["chat_join_request"],
      }),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.description || `HTTP error: ${response.status}`
    );
  }

  console.log("Webhook registered successfully!");
  console.log("Webhook URL:", `${baseUrl}/telegram-webhook`);
  console.log("Telegram response:", result.result);
}

main().catch((error) => {
  console.error("Webhook setup failed:", error.message);
  process.exitCode = 1;
});
