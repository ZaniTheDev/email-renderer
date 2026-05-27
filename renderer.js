const path = require("path");
const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.post("/render", async (req, res) => {
  const { emailId } = req.body;

  if (!emailId) {
    return res.status(400).json({ error: "emailId is required" });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      userDataDir: "./chrome-data",
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      args: [
        "--window-size=1920,1080",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.goto("https://mail.google.com/", { waitUntil: "networkidle2" });
    await page.goto(`https://mail.google.com/mail/u/0/#all/${emailId}`, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("div.ii.gt", { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 2000));

    if (!fs.existsSync("public")) fs.mkdirSync("public");

    const fileName = `email-${emailId}.png`;

    await page.screenshot({
      path: `public/${fileName}`,
      fullPage: false,
      clip: {
        x: 230, // Horizontal coordinate (px)
        y: 100, // Vertical coordinate (px)
        width: 1000, // Width of the crop (px)
        height: 800, // Height of the crop (px)
      },
    });

    console.log("Screenshot saved:", fileName);

    res.json({
      success: true,
      url: `https://api.zanidev.site/${fileName}`,
    });
  } catch (err) {
    console.error("Render error:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
