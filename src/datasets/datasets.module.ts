import { Module } from '@nestjs/common';
import { DatasetsService } from './datasets.service';
import { DatasetsController } from './datasets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DatasetSchema } from './schema';
import { AuthSchema } from 'src/auth/schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dataset', schema: DatasetSchema },
      { name: 'Auth', schema: AuthSchema },
    ]),
  ],
  controllers: [DatasetsController],
  providers: [DatasetsService],
})
export class DatasetsModule {}
