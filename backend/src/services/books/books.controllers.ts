import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { BooksProvider } from './books.provider';
import { async } from 'rxjs/internal/scheduler/async';
import { NewBookData } from './dtos/book-input';
import { Api } from '@shared/interfaces';
import { Book } from './models/book.model';
import { Roles, Scopes, RoleGuard } from '@shared/guards';
import { UserRoles } from '@shared/models';
import { UserScopes } from '@services/authorization/models';

const controllerName = 'books';

@Controller(controllerName)
@ApiUseTags(controllerName)
export class BooksContoller {
    constructor(
        private readonly booksProvider: BooksProvider,
    ) { }

    @Roles(UserRoles.USER)
    @Scopes(UserScopes.ME)
    @UseGuards(RoleGuard)
    @Get()
    async getBooks(): Promise<Api<Book[]>> {
        return {
            data: await this.booksProvider.findAllBooks(),
        };
    }
    @Post()
    async addNewBook(
        @Body() newBookData: NewBookData,
    ): Promise<Api<Book>> {
        return {
            data: await this.booksProvider.addNewBook(newBookData),
        };
    }
}
