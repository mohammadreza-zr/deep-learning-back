import { DatasetInterface } from './interfaces/dataset.interface';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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
    });
    await newDataset.save();

    return {
      statusCode: 200,
      message: 'success',
    };
  }

  async findTitle(title: string) {
    title = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    const regex = `.*${title}.*`;
    if (!!title.trim()) {
      let result = null;
      try {
        result = await this.datasetModel
          .find({
            title: new RegExp(regex),
          })
          .limit(6);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      return result;
    } else {
      throw new HttpException('Title is empty!', HttpStatus.BAD_REQUEST);
    }
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
    search = search.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    const regex = `.*.${search.trim()}.*`;
    let count = null,
      datasets = null;
    try {
      count = await this.datasetModel
        .find({
          $or: [
            { title: { $regex: regex } },
            { hashtag: { $regex: regex } },
            { body: { $regex: regex } },
          ],
          $and: [
            {
              hashtag: hashtag,
            },
          ],
        })
        .count();

      datasets = await this.datasetModel
        .find({
          $or: [
            { title: { $regex: regex } },
            { hashtag: { $regex: regex } },
            { body: { $regex: regex } },
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
    } catch (error) {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }

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

    const filteredTitle = dataset.title.replace(
      /[&\/\\#,+()$~%.'":*?<>{}]/g,
      '',
    );
    const filteredHashtag = dataset.hashtag[0]?.replace(
      /[&\/\\#,+()$~%.'":*?<>{}]/g,
      '',
    );
    const filteredBody = dataset.body.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

    const titleRegex = `.*${filteredTitle}.*`;
    const hashtagRegex = `.*${filteredHashtag}.*`;
    const bodyRegex = `.*${filteredBody}.*`;
    let datasets = null;

    try {
      datasets = await this.datasetModel
        .find({
          $or: [
            { title: { $regex: titleRegex } },
            {
              hashtag: { $regex: hashtagRegex },
            },
            { body: { $regex: bodyRegex } },
          ],
        })
        .limit(10)
        .sort({ createdAt: 1 });
    } catch (error) {
      throw new HttpException(
        'Error from server, please try other page',
        HttpStatus.BAD_REQUEST,
      );
    }

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

    dataset.views = dataset.views + 1;
    await dataset.save();

    return {
      title: dataset.title,
      body: dataset.body,
      hashtag: dataset.hashtag,
      imageUrl: dataset.imageUrl,
      similarDatasets: filteredDatasets,
    };
  }
}
