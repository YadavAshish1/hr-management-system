import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getEmployees = async () => {
  const response = await api.get('/employees/');
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await api.post('/employees/', employeeData);
  return response.data;
};

export const deleteEmployee = async (employeeId) => {
  const response = await api.delete(`/employees/${employeeId}`);
  return response.data;
};

export const getAttendance = async () => {
  const response = await api.get('/attendance/');
  return response.data;
};

export const getEmployeeAttendance = async (employeeId) => {
  const response = await api.get(`/attendance/${employeeId}`);
  return response.data;
};

export const markAttendance = async (attendanceData) => {
  const response = await api.post('/attendance/', attendanceData);
  return response.data;
};
