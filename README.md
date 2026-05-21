# Email Renderer API

A small project I made using Puppeteer and Express to automate rendering emails directly from Gmail.

The API opens a browser session, grabs the rendered email content, takes a screenshot, and saves it into a public directory so it can be accessed through an endpoint.

Built mostly as a learning project to better understand:
- browser automation
- web scraping
- backend APIs
- rendering workflows
- networking and tunneling

## Features

- Automates Gmail using Puppeteer
- Extracts rendered email HTML
- Generates screenshots
- Serves screenshots through an API
- Works with Cloudflare Tunnel for external access

## Tech Stack

- Node.js
- Express
- Puppeteer
- Cloudflare Tunnel

## Notes

This project is mainly for educational and personal automation purposes.

Do not use it on accounts you do not own or have permission to access.

Also make sure not to expose:
- session cookies
- authentication data
- sensitive email contents

## Setup

```bash
npm install
node index.js

To install dependencies:

```bash
bun install
```

To run:

```bash
bun email-renderer 
```
