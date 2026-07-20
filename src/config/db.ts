import { Sequelize } from "sequelize-typescript";
import { Follow, Interest, User } from "../models/User.js";
import { Post, Tag, PostTags } from "../models/Post.js";
import { File } from "../models/File.js";
import { Comment } from "../models/Comment.js";
import { Rating } from "../models/Rating.js";
import { Notification } from "../models/Notification.js";
import { Collection, CollectionPost } from "../models/Collection.js";
import { ReportComment, ReportFile, ReportReason } from "../models/Reports.js";
import { Mail } from "../models/Mail.js";
import { Role, UserRole } from "../models/Role.js";

export const sequelize: Sequelize = new Sequelize(process.env.DB_URL!, {
  logging: false,
  models: [
    User,
    Role,
    UserRole,
    Follow,
    Post,
    PostTags,
    File,
    Interest,
    Tag,
    Comment,
    Rating,
    ReportReason,
    ReportFile,
    ReportComment,
    Notification,
    Collection,
    CollectionPost,
    Mail
  ],
});

try {
  await sequelize.authenticate();
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}