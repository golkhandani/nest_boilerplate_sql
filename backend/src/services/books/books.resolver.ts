import { BooksProvider } from './books.provider';
import { UsersProfileProvider } from '@services/profiles/profiles.provider';
import { Resolver, Query, Args, Mutation, ResolveProperty, Parent } from '@nestjs/graphql';
import { Book } from './models/book.model';
import { NewBookData } from './dtos/book-input';
import { User, UserRoles } from '@shared/models';
import { Roles, Scopes, RoleGuard } from '@shared/guards';
import { UserScopes } from '@services/authorization/models';
import { UseGuards } from '@nestjs/common';
import { UserInHeader } from '@shared/decorators';

@Resolver(of => Book)
export class BooksResolver {
    constructor(
        private readonly booksProvider: BooksProvider,
        private readonly userProvider: UsersProfileProvider,
    ) { }

    @Query(returns => [Book])
    async getBooks() {
        console.log('GET BOOKS');
        return await this.booksProvider.findAllBooks();
    }
    @ResolveProperty('author', () => User)
    async getAuthor(@Parent() book: Book) {
        console.log('GET PROPERTY AUTHOR');
        const { author } = book;
        const user = await this.userProvider.getProfile({ _id: author } as UserInHeader);
        return user;
    }
    // @Mutation(returns => Book)
    // async addBook(
    //     @Args('NewBookData') newBookData: NewBookData,
    // ): Promise<Book> {
    //     return await this.booksProvider.addNewBook(newBookData);
    // }
}
