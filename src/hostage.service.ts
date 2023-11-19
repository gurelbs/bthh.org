import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Hostage, CreatePersonDto } from './app.interfaces';

@Injectable()
export class HostageService {
  constructor(
    @Inject('PERSON_MODEL')
    private personModel: Model<Hostage>,
  ) {}

  async create(createPersonDto: CreatePersonDto): Promise<Hostage> {
    const createdPerson = new this.personModel(createPersonDto);
    return createdPerson.save();
  }

  async findAll(): Promise<Hostage[]> {
    return this.personModel.find().exec();
  }
}
