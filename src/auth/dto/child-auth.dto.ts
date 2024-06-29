import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChildAuthDto {
    child_id: number;

    login_code: string;

    name: string;
    sex: string;
    dob: string;
    balance: number;
}
