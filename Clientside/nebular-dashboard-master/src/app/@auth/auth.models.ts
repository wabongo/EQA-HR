export interface RegisterRequest {
  username: string;
  designation: string;
  facility: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  role: string;
  terms: string;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  Password: string;
  confirmPassword: string;
}


