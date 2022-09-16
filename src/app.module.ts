import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { DatasetsModule } from './datasets/datasets.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/deep-learning-demo'),
    DatasetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
