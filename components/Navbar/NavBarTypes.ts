export interface Profile {
  profileId: string;
  profilePhoto: string | null;
  dateOfBirth: string;
  gender: string;
  department: string | null;
  experience: string | null;
  licenseNo: string | null;
  age: number;
  weight: number;
  height: number;
  bloodGroup: string;
  licenseFile: string[];
  preferredLocations: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Address {
  addressId: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  country: string | null;
  fullAddress: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface UserProfile {
  userId: string;
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  role: string;
  allowedModules: string[];
  status: string;
  createdBy: string;
  createdAt: string;
  profile: Profile;
  address: Address[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}
