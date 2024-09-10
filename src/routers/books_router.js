"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BooksController_1 = __importDefault(require("../controllers/BooksController"));
const booksController = new BooksController_1.default();
const alkafeeRouter = (0, express_1.default)();
alkafeeRouter.route("/alkafee")
    .post(booksController.migrationAlkafee);
alkafeeRouter.route("/adwaa")
    .post(booksController.migrationAdwa);
alkafeeRouter.route("/balagh")
    .post(booksController.migrationBalagha);
alkafeeRouter.route("/one/:id")
    .get(booksController.getBookById)
    .delete(booksController.deleteBook);
alkafeeRouter.route("/all")
    .get(booksController.getAllBooks);
exports.default = alkafeeRouter;
