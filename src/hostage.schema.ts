import { Schema } from 'mongoose';
import type { Hostage } from './app.interfaces';

export const PersonSchema = new Schema<Hostage>({});
