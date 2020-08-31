#!/usr/bin/env node
import debug from "debug";
import http from "http";
import app from "./app";
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (Number.isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || "8084");
app.set("port", port);
const server = http.createServer(app);
const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
        case "EACCES":
            console.log(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.log(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};
const onListening = () => {
    const addr = server.address();
    if (addr === null)
        return;
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
};
server.listen(port, () => {
    console.log("Server listening on port test", port);
});
server.on("error", onError);
server.on("listening", onListening);
//# sourceMappingURL=index.js.map