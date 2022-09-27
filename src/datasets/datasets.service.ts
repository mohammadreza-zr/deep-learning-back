import { DatasetInterface } from './interfaces/dataset.interface';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDatasetDto } from './dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'argon2';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel('Dataset')
    private readonly datasetModel: Model<DatasetInterface>,
  ) {}

  async create(id: string, imagePath: string, createDatasetDto: any) {
    //check for title is exist?
    if (!createDatasetDto?.title?.trim())
      throw new HttpException(
        'title should not be empty',
        HttpStatus.BAD_REQUEST,
      );

    const oldDataset = await this.datasetModel
      .findOne({
        title: createDatasetDto.title,
      })
      .exec();

    if (oldDataset) throw new ForbiddenException('title is exist!');

    const hashtags = createDatasetDto?.hashtag?.filter((item: any) => item);

    //save dataset i database
    const newDataset = new this.datasetModel({
      imageUrl: imagePath,
      title: createDatasetDto.title,
      body: createDatasetDto.body,
      hashtag: hashtags,
      author: id,
      views: 0,
    });
    await newDataset.save();

    return {
      statusCode: 200,
      message: 'success',
    };
  }

  async findTitle(title: string) {
    const result = await this.datasetModel
      .find({
        title: new RegExp('.*' + title + '.*'),
      })
      .limit(6);
    return result;
  }

  async findAll(skip: number, limit: number, hashtag: string | RegExp) {
    const count = await this.datasetModel
      .find({
        hashtag: hashtag,
      })
      .count();

    const datasets = await this.datasetModel
      .find({
        hashtag: hashtag,
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });

    const filteredDatasets = datasets.map((dataset: DatasetInterface) => {
      return {
        id: dataset.id,
        title: dataset.title,
        hashtag: dataset.hashtag,
      };
    });

    return {
      data: filteredDatasets,
      count: count,
    };
  }

  async search(
    skip: number,
    limit: number,
    search: string,
    hashtag: string | RegExp,
  ) {
    const count = await this.datasetModel
      .find({
        $or: [
          { title: new RegExp('.*' + search + '.*') },
          { hashtag: new RegExp('.*' + search + '.*') },
          { body: new RegExp('.*' + search + '.*') },
        ],
        $and: [
          {
            hashtag: hashtag,
          },
        ],
      })
      .count();

    const datasets = await this.datasetModel
      .find({
        $or: [
          { title: new RegExp('.*' + search + '.*') },
          { hashtag: new RegExp('.*' + search + '.*') },
          { body: new RegExp('.*' + search + '.*') },
        ],
        $and: [
          {
            hashtag: hashtag,
          },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });

    const filteredDatasets = datasets.map((dataset: DatasetInterface) => {
      return {
        id: dataset.id,
        title: dataset.title,
        hashtag: dataset.hashtag,
      };
    });

    return {
      data: filteredDatasets,
      count: count,
    };
  }

  async findOne(title: string) {
    const dataset = await this.datasetModel
      .findOne({
        title,
      })
      .exec();
    if (!dataset) throw new NotFoundException('dataset not found!');

    const datasets = await this.datasetModel
      .find({
        $or: [
          { title: new RegExp('.*' + dataset.title + '.*') },
          { hashtag: new RegExp('.*' + dataset.hashtag + '.*') },
          { body: new RegExp('.*' + dataset.body + '.*') },
        ],
      })
      .limit(10)
      .sort({ createdAt: 1 });

    const filteredDatasets = datasets.filter((dataset: DatasetInterface) => {
      if (title === dataset.title) {
        return false;
      }
      return {
        id: dataset.id,
        title: dataset.title,
        hashtag: dataset.hashtag,
        imageUrl: dataset.imageUrl,
      };
    });

    return {
      title: dataset.title,
      body: dataset.body,
      hashtag: dataset.hashtag,
      imageUrl: dataset.imageUrl,
      similarDatasets: filteredDatasets,
    };
  }
}
