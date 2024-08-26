import express from 'express';
import AlkafeeController from '../controllers/BooksController';




const booksController = new AlkafeeController();

const alkafeeRouter = express();


alkafeeRouter.route("/alkafee")
.post(booksController.migrationAlkafee);

alkafeeRouter.route("/adwaa")

.post(booksController.migrationAdwa);

alkafeeRouter.route("/balagh")

.post(booksController.migrationBalagha);

alkafeeRouter.route("/:id")
.get(booksController.getBookById)
.delete(booksController.deleteBook)

alkafeeRouter.route("/books")
.get(booksController.getAllBooks)

export default alkafeeRouter;