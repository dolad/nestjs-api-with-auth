import { Module } from "@nestjs/common";
import { PostgresModule } from "./postgres/postgres.module";

console.log(process.env.NODE_ENV)

@Module({
    imports: [
         PostgresModule,
    ],
   
})

export class StorageModule {}
