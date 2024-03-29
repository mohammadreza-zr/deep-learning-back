import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { DatasetsService } from './datasets.service';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidV4 } from 'uuid';
import { GetUser, Roles } from 'src/auth/decorator';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Role } from 'src/types';
import {
  CreateDatasetDto,
  QueryDatasetDto,
  SearchDto,
  SearchTitleDatasetDto,
} from './dto';

const storage = {
  storage: diskStorage({
    destination: './uploads/datasetImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidV4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  //create a dataset with upload file - protected for admins
  @ApiOperation({ summary: 'create dataset' })
  @ApiBody({
    description: 'this api need to call with form-data and send image file',
    schema: {
      title: 'dataset',
      example: {
        title: 'dataset-title',
        body: 'this is a body for dataset',
        hashtag: ['test', 'test2'],
        file: 'image file!',
      },
    },
  })
  @ApiCreatedResponse({
    description: 'just return ok',
  })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file', storage))
  Create(
    @GetUser('id') id: string,
    @UploadedFile() file,
    @Body() createDatasetDto: CreateDatasetDto,
  ) {
    if (!file)
      throw new HttpException('file is required!', HttpStatus.BAD_REQUEST);
    return this.datasetsService.create(
      id,
      `datasetImages/${file.filename}`,
      createDatasetDto,
    );
  }

  //search in title - protected for admins
  @ApiOperation({ summary: 'search in titles' })
  @ApiQuery({
    description:
      'this api search in datasets title for exist, incoming text will be filter for symbol characters.',
    example: 'this is a title',
  })
  @ApiCreatedResponse({
    description: 'return list of titles',
  })
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get('title/:title')
  findTitle(@Param() title: SearchTitleDatasetDto) {
    if (!!!title.title)
      throw new HttpException('title is required!', HttpStatus.BAD_REQUEST);
    return this.datasetsService.findTitle(title.title);
  }

  //dataset list - pagination with query
  @ApiOperation({ summary: 'return all datasets with pagination' })
  @ApiQuery({
    name: 'skip',
    example: '1',
  })
  @ApiQuery({
    name: 'hashtag',
    example: 'HASHTAG text',
  })
  @ApiCreatedResponse({
    description: 'return list of datasets',
  })
  @Get('list')
  findAll(@Query() query: QueryDatasetDto) {
    const limit = 20;
    const skip = query.skip ? query.skip : 0;
    const hashtag = query.hashtag
      ? query.hashtag
      : new RegExp('.*' + '' + '.*');
    return this.datasetsService.findAll(+skip, limit, hashtag);
  }

  //single dataset with id and similar datasets
  @ApiOperation({ summary: 'return one dataset' })
  @ApiCreatedResponse({
    description:
      'return one dataset information and similar datasets with:[title,hashtag[0],body]',
  })
  @Get('single/:title')
  findOne(@Param() title: SearchTitleDatasetDto) {
    return this.datasetsService.findOne(title.title);
  }

  //search in datasets with pagination
  @ApiOperation({ summary: 'search in datasets with pagination' })
  @Get('list/:search')
  Search(@Param() search: SearchDto, @Query() query: QueryDatasetDto) {
    const skip = query.skip ? query.skip : 0;
    const limit = 20;
    const hashtag = query.hashtag ? query.hashtag?.trim() : null;
    if (!search.search) throw new ForbiddenException('Empty Not Allowed');
    return this.datasetsService.search(+skip, limit, search.search, hashtag);
  }
}
