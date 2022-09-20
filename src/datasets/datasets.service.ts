import { DatasetInterface } from './interfaces/dataset.interface';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDatasetDto } from './dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DatasetsService {
  constructor(
    @InjectModel('Dataset')
    private readonly datasetModel: Model<DatasetInterface>,
  ) {}

  async create(
    id: string,
    imagePath: string,
    createDatasetDto: CreateDatasetDto,
  ) {
    //check for title is exist?
    const oldDataset = await this.datasetModel
      .findOne({
        title: createDatasetDto.title,
      })
      .exec();

    if (oldDataset) throw new ForbiddenException('title is exist!');

    //save dataset i database
    const newDataset = new this.datasetModel({
      imageUrl: imagePath,
      title: createDatasetDto.title,
      body: createDatasetDto.body,
      hashtag: createDatasetDto.hashtag,
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

  async findAll(skip: number, limit: number) {
    const count = await this.datasetModel.find().count();

    const datasets = await this.datasetModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });

    const filteredDatasets = datasets.map((dataset: DatasetInterface) => {
      return {
        id: dataset.id,
        title: dataset.title,
        body: dataset.body,
        hashtag: dataset.hashtag,
        imageUrl: dataset.imageUrl,
      };
    });

    return {
      data: filteredDatasets,
      count: count,
    };
  }

  async search(skip: number, limit: number, search: string) {
    const count = await this.datasetModel
      .find({
        $or: [
          { title: new RegExp('.*' + search + '.*') },
          { hashtag: new RegExp('.*' + search + '.*') },
          { body: new RegExp('.*' + search + '.*') },
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
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 });

    const filteredDatasets = datasets.map((dataset: DatasetInterface) => {
      return {
        id: dataset.id,
        title: dataset.title,
        body: dataset.body,
        hashtag: dataset.hashtag,
        imageUrl: dataset.imageUrl,
      };
    });

    return {
      data: filteredDatasets,
      count: count,
    };
  }

  async findOne(id: string) {
    const dataset = await this.datasetModel.findById(id);
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

    const filteredDatasets = datasets.map((dataset: DatasetInterface) => {
      return {
        id: dataset.id,
        title: dataset.title,
        body: dataset.body,
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
