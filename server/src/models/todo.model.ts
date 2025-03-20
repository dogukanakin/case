import mongoose, { Schema } from 'mongoose';
import { ITodo, Priority } from '../interfaces/todo.interfaces';

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    tags: {
      type: [String],
      default: [],
    },
    recommendation: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: null,
    },
    fileUrl: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITodo>('Todo', todoSchema); 