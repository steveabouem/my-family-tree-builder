export interface UserRegistrationData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  assigned_ips: string[];
  created_at: any;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface PasswordChangeData {
  email: string;
  currentPassword: string;
  newPassword: string;
} 