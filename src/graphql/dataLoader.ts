// import { BatchLoader } from 'batchloader';
// import Author, { IAuthor } from '../models/Author';
// import Book, { IBook } from '../models/Book';

// export const authorLoader = new BatchLoader<string, IAuthor>(
//   async (ids: string[]) => {
//     try {
//       const authors = await Author.find({ _id: { $in: ids } });
//       return authors;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   },
//   (id: string) => id.toString()
// );

// export const bookLoader = new BatchLoader<string, IBook>(
//   async (ids: string[]) => {
//     try {
//       const books = await Book.find({ _id: { $in: ids } });
//       return books;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   },
//   (id: string) => id.toString()
// );
