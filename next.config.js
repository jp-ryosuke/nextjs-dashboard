/** @type {import('next').NextConfig} */

//const nextConfig = {};

const fs = require("fs");
const { join } = require("path");
const next = require("next");
const { createServer } = require("http");
const https = require("https");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("localhost.key"),
  cert: fs.readFileSync("localhost.crt"),
};

const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.node = {
        __dirname: true,
      };
      config.module.rules.push({
        test: /\.(crt|key)$/,
        use: {
          loader: "raw-loader",
        },
      });
    }
    return config;
  },
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    if (req.url.startsWith("/public/")) {
      const filePath = join(__dirname, "public", req.url);
      app.serveStatic(req, res, filePath);
    } else {
      handle(req, res);
    }
  })
    .listen(3001, (err) => {
      if (err) throw err;
      console.log("> Ready on https://localhost:3001");
    });
});

module.exports = nextConfig;