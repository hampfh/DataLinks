import logger from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import data from "./assets/data.json";
const app = express();
if (process.env.NODE_ENV === "production")
    app.use(logger("common"));
else
    app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(path.resolve(), "client/build")));
app.use(function (req, res, next) {
    if (req.headers.host !== undefined && req.headers.host.match(/^www/))
        res.redirect("http://" + req.headers.host.replace(/^www\./, "") + req.url, 301);
    next();
});
app.get("/data", (req, res) => {
    res.json({
        data
    });
});
app.get("*", (req, res) => {
    res.sendFile(path.join(path.resolve() + "/client/build/index.html"));
});
app.use(function (error, req, res, next) {
    if (res.headersSent)
        next(error);
    console.error(error);
});
export default app;
//# sourceMappingURL=app.js.map