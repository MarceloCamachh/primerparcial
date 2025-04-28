import axios from "axios";
import { BACKEND_URL } from "../constants";

export type Design = {
  id: string;
  title: string;
  data: any;
  createdAt: string;
  updatedAt: string;
  userEmail: string;
};

export const createDesign = async (
    design: Omit<Design, "id" | "createdAt" | "updatedAt">
  ): Promise<Design> => {
    const response = await axios.post<Design>(`${BACKEND_URL}/designs`, design);
    return response.data;
};

export const getDesignsByUser = async (email: string) => {
  const response = await axios.get(`${BACKEND_URL}/designs?email=${email}`);
  return response.data as Design[];
};

export const getDesignById = async (id: string) => {
  const response = await axios.get(`${BACKEND_URL}/designs/${id}`);
  return response.data as Design;
};

export const updateDesign = async (
    id: string,
    data: Partial<Design>
  ): Promise<Design> => {
    const response = await axios.put(`${BACKEND_URL}/designs/${id}`, data);
    return response.data as Design;
  };

export const deleteDesign = async (id: string) => {
  const response = await axios.delete(`${BACKEND_URL}/designs/${id}`);
  return response.data;
};
