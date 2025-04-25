import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'data', 'kjs-buddy.sqlite'),
      entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
      synchronize: true, // Set to false in production
      logging: process.env.NODE_ENV !== 'production',
    }),
  ],
})
export class DatabaseModule {}