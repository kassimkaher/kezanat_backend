"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./src/routers/router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json()); // to parse application/json
app.use(express_1.default.urlencoded({ extended: true })); // to parse application/x-www-form-urlencoded
// app.get('/', (req, res) => {
//     return res.sendFile("/projects/kezanat_backend/frontend/public/index.html");
// });
const port = process.env.PORT || 3000;
app.use("/api", router_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
