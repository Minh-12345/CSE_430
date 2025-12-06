export interface Service {
  _id: string;
  name: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  user?: any;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddService: undefined;
  ServiceDetail: { id: string };
  EditService: { id: string };
  DeleteService: { id: string };
};
