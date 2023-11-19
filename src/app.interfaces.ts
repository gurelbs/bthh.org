import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class CreatePersonDto {
  @ApiProperty({
    example: 'ישראל',
    description: 'The hebrew name of the person',
  })
  name: string;
  // @ApiProperty({ example: 'israel', description: 'The english name of the person' })
  // englishName: string;
  // @ApiProperty() age: number;
}

export class HostageClass {
  @ApiProperty({ example: 1, description: 'The age of the Cat' })
  age: number;

  @ApiProperty({
    example: 'Maine Coon',
    description: 'The breed of the Cat',
  })
  breed: string;
}

export interface News {
  title?: string;
  time?: string;
  img?: string;
}

export interface Hostage extends Document {
  id: UUID;
  name: string;
  englishName: string;
  img?: string;
  tag?: string;
  link?: string;
  age: string;
  address: string;
  urlName: string;
  news: {
    [language: string]: News[];
  };
}
