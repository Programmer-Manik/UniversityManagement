import bcrypt from "bcrypt";
import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    needsPasswordChange: { type: Boolean, required: true , default:true},
    role: { type: String, enum: ['admin', 'faculty', 'student'] },
     status:{type:String, enum:['in-progress', 'blocked'],
    default:"in-progress"
     },
    isAdmin: { type: Boolean, default: false },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
    next();
  });
  
  // set '' after saving password
  userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
  });
  

export const User = model<TUser>("User", userSchema);