
import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // console.log(payload)
  // create a user object
  const userData: Partial<TUser> = {};
  //if password is not given , use default password
  userData.password = password || (config.default_password as string);
  //set student role
  userData.role = 'student';
  //year semester Code 4 digits number 
  // find academic semester
  const admissionSemester = await  AcademicSemester.findById(
    payload.admissionSemester,
  );
   //set manually generated it
  // userData.id = '2030100001';
  //set  generated id
  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }
  userData.id = await generateStudentId(admissionSemester); 


  // create a user
  const newUser = await User.create(userData);
  // console.log(newUser, userData);

  //create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; //reference _id

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};