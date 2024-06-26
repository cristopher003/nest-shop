import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res, StreamableFile, Header } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helper';
import { createReadStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService:ConfigService
  ) { }

  @Post('product')
  @UseInterceptors(FileInterceptor('file',
  {fileFilter:fileFilter,
    // limits:{fieldSize}
    storage:diskStorage({
      destination:'./static/uploads',
      filename:fileNamer
    })
  }))
  uploadFile(@UploadedFile() file:Express.Multer.File) {
    if(!file)  throw new BadRequestException('error file');

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return secureUrl;
  }

  @Get('product/:imageName')
  @Header('Content-Type', 'image/jpeg')
  findProductImage(
  @Param('imageName') imageName:string){
    // const path= this.filesService.getStaticProductImage(imageName);
    const stream = createReadStream(this.filesService.getStaticProductImage(imageName));    
  
    return new StreamableFile(stream);
  }

}
