// export enum UserType {
// 	doctor = "Doctor",
// 	admin = "Admin",
// 	agent = "Agent",
// }

// export interface Tokens {
// 	// access_token: string;
// 	// refresh_token: string;
// 	accessToken: string;
// 	refreshToken: string;
// }

// export enum AfterschoolStatus {
// 	active = "ACTIVE",
// 	inactive = "INACTIVE",
// }

// export interface UserCommonData {
// 	id: number;
// 	name: string;
// 	email: string;
// 	mobile: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// export interface Doctor extends UserCommonData {}

// export interface LoggedInUser<T> extends Tokens {
// 	user: T;
// }

// export interface TokensWithId extends Tokens {
// 	id: number;
// }

export interface AllUsers {
  users: SingleUser[];
  total: number;
  skip: number;
  limit: number;
}

export interface SingleUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  ip: string;
  address: Address;
  macAddress: string;
  university: string;
  bank: Bank;
  company: Company;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: Crypto;
  role: string;
}

export interface Hair {
  color: string;
  type: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates;
  country: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address2;
}

export interface Address2 {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  coordinates: Coordinates2;
  country: string;
}

export interface Coordinates2 {
  lat: number;
  lng: number;
}

export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}
