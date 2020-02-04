import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BookModelName, Book } from './models/book.model';
import { Model } from 'mongoose';

@Injectable()
export class BooksProvider {

    constructor(@InjectModel(BookModelName) private readonly BookModel: Model<Book>) { }

    async findAllBooks() {
        return await this.BookModel.find();
    }
    async addNewBook(data) {
        return await this.BookModel.create(data);
    }
}
