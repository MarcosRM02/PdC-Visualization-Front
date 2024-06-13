export interface Book {
  _id: string;
  title: string;
  author: string;
  publishYear: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface BooksCardProps {
  books: Book[];
}