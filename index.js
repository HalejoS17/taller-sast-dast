const express = require("express");
const client = require("prom-client");

const app = express();

// Métricas default (CPU, memoria, event loop, etc.)
client.collectDefaultMetrics();

// Métrica custom: contador de requests
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total de requests HTTP",
  labelNames: ["method", "route", "status"],
});

app.use((req, res, next) => {
  res.on("finish", () => {
    const route = req.path || "unknown";
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: String(res.statusCode),
    });
  });
  next();
});

app.get("/", (req, res) => {
  res.send("OK - Taller SAST/DAST + Kubernetes + Monitoring");
});

// Endpoint para Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
