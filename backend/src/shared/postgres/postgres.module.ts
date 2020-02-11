import { Module } from '@nestjs/common';
import { postgresProviders } from './postgres.provider';

@Module({
    providers: [...postgresProviders],
    exports: [...postgresProviders],
})
export class PostgresModule { }