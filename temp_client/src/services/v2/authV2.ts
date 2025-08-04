import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DUserDTO } from "../api.definitions";
import { DChangePasswordValues } from "../../pages/user/definitions";
import { APILoginResponse, APIRequestPayload, LoginRequestPayload } from "../../../../shared";
import { baseUrl } from "../index";

const handleLogin = async (values: Partial<DUserDTO>): Promise<APIRequestPayload<APILoginResponse>> => {
  console.log({ baseUrl });
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

const registerAPI = async (values: Partial<DUserDTO>): Promise<any> => {
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

const changePasswordAPI = async (values: DChangePasswordValues): Promise<any> => {
  const response = await fetch(`${baseUrl}/auth/password/change`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });
  
  if (!response.ok) {
    throw new Error(`Password change failed: ${response.statusText}`);
  }
  
  return response.json();
};

const logoutAPI = async (): Promise<void> => {
  const response = await fetch(`${baseUrl}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Logout failed: ${response.statusText}`);
  }
  
  localStorage.clear();
  return;
};

// React Query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleLogin,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      
      if (data.payload?.authenticated) {
        queryClient.setQueryData(['user'], data.payload);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      
      if (data.payload?.authenticated) {
        queryClient.setQueryData(['user'], data.payload);
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    }
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
    onError: (error) => {
      console.error('Password change failed:', error);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.clear();
      
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['session'] });
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      queryClient.clear();
    }
  });
};

export const validateRegistrationFields = (values: DUserDTO): boolean => {
  return false;
};

export {
  handleLogin as loginAPI,
  registerAPI,
  changePasswordAPI,
  logoutAPI
};
