import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, ChangePasswordValues } from "types";
import { APILoginResponse, APIRequestPayload, LoginRequestPayload } from "../../../../shared";
import { baseUrl } from "../index";

const login = async (values: LoginRequestPayload): Promise<APIRequestPayload<APILoginResponse>> => {
  const response = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  return response.json();
};

const register = async (values: Partial<User>): Promise<any> => {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }

  return response.json();
};

const updateUser = async (values: ChangePasswordValues): Promise<any> => {
  const response = await fetch(`${baseUrl}/auth/user/${values.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  return response.json();
};

const logout = async (): Promise<void> => {
  const response = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Logout failed: ${response.statusText}`);
  }

  return;
};

// React Query hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
  });
};

export const useUpdatUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
  });
};

export const validateRegistrationFields = (values: User): boolean => {
  return false;
};

export {
  login as handleLogin,
  register as handleRegister,
  updateUser as handlePasswordChange,
  logout as handleLogout
};
