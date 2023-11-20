import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiPropertyOptional,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('persons')
@ApiTags('persons')
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get all persons' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  findAll() {
    return this.appService.getAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get person by name' })
  async findOne(@Param('name') name: string) {
    return this.appService.getByName(name);
  }

  @Get(':name/news')
  @ApiOperation({
    summary: 'Get the latest news and updates that mention this person.',
  })
  @ApiPropertyOptional({
    name: 'lang',
    description: 'language of the news (ISO 639-1)',
    example: '/persons/shem/news',
    examples: [
      { language: 'English', value: 'en' },
      { language: 'Hebrew', value: 'he' },
      { language: 'French', value: 'fr' },
      { language: 'German', value: 'de' },
      'https://www.loc.gov/standards/iso639-2/php/code_list.php',
    ],
  })
  async getNewsByName(
    @Param('name') name: string,
    @Query('lang') lang: string = 'he',
  ) {
    return await this.appService.getNewsByName(name, lang);
  }

  // @Put(':name')
  // @ApiPropertyOptional()
  // @ApiOperation({ summary: 'put news on person object' })
  // async find(@Param('name') name: string) {
  //   return this.appService.getByName(name);
  // }
  // @Get('/person?name=name&lang=lang&news=news')
  // getByName(
  //   @Query('name') name: string,
  //   @Optional() @Query('news') news: boolean = false,
  //   @Optional() @Query('lang') lang: string = 'he'
  // ) {
  //   if (!name || !news || !lang) return this.appService.getByName(name);
  //   if (news) this.appService.getNewsByName(name);
  //   if (news && lang) this.appService.getNewsByName(name, lang);
  // }
}
