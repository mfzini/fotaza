import { Sequelize } from "sequelize-typescript";
import { Follow, User } from "../models/User.js";
import { Post, Tag, PostTags } from "../models/Post.js";
import { File, Report, ReportReason } from "../models/File.js";
import { Comment } from "../models/Comment.js";
import { Rating } from "../models/Rating.js";
import { Notification } from "../models/Notification.js";

export const sequelize: Sequelize = new Sequelize(process.env.DB_URL!, {
  logging: false,
  models: [
    User,
    Follow,
    Post,
    PostTags,
    File,
    Tag,
    Comment,
    Rating,
    Report,
    Notification,
    ReportReason
  ],
});

try {
  await sequelize.authenticate();
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}