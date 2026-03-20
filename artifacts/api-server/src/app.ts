import express, { type Express } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { startScheduler } from "./lib/scheduler.js";
import path from "path";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static APK serving
app.use(
  "/downloads",
  express.static(path.join(process.cwd(), "downloads"))
);

// ✅ API routes
app.use("/api", router);

// ✅ App update API
app.get("/api/app/check-update", (_req, res) => {
  res.json({
    versionCode: 2,
    downloadUrl: `${process.env.APP_URL}/downloads/splashapp.apk`,
    isForceUpdate: true,
    whatsNew: "• New UI Design\n• Added Delhi Markets\n• Performance Improved",
  });
});

// ✅ Scheduler
startScheduler();

export default app;