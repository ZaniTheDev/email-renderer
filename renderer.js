const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/render", async (req, res) => {
  const { emailId } = req.body;

  if (!emailId) {
    return res.status(400).json({
      error: "emailId is required"
    });
  }

  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      userDataDir: "./chrome-data",
      defaultViewport: null,

      args: [
        "--start-maximized",
        "--disable-blink-features=AutomationControlled"
      ]
    });

    const page = await browser.newPage();

    // Hide webdriver flag
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    // Open Gmail
    await page.goto("https://mail.google.com/", {
      waitUntil: "networkidle2"
    });

    // Open specific email
    await page.goto(
      `https://mail.google.com/mail/u/0/#inbox/${emailId}`,
      {
        waitUntil: "networkidle2"
      }
    );

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Scroll down a little
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });

    // Wait after scrolling
    await new Promise(resolve => setTimeout(resolve, 1000));
    const emailHtml = await page.$eval(
  "div.a3s",
  el => el.innerHTML
);

    // Save HTML for debugging
    fs.writeFileSync("email.html", emailHtml);


    const renderPage = await browser.newPage();

    await renderPage.setViewport({
      width: 1280,
      height: 720
    });

    // Put extracted HTML into clean page
    await renderPage.setContent(emailHtml, {
      waitUntil: "domcontentloaded"
    });


    await new Promise(resolve => setTimeout(resolve, 3000));
    await renderPage.screenshot({
      path: "public/email.png",
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 720
      }
    });

    await browser.close();

    res.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});