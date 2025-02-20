interface Address {
  id: string;
  type: string;
  thana: string | null;
  zilla: string | null;
  streetAddress: string | null;
  apartmentNo: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: string;
  name: string;
  designation: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfessionalInfo {
  id: string;
  occupation: string;
  organizationName: string;
  serviceOfferings: string;
  locationForServices: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface FamilyMember {
  id: string;
  userId: string | null;
  thumbnail: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string | null;
  password: string | null;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  birthPlace: string;
  usIDNo: string;
  usIDFile: string;
  relationship: string | null;
  parentUserId: string | null;
  spouseNationality: string | null;
  isActive: boolean;
  isDeleted: boolean;
  validTill: string | null;
  createdAt: string;
  updatedAt: string;
  systemRole: string | null;
  primaryRole: string | null;
  secondaryRole: string[];
  type: string;
  status: string;
  addresses: Address[];
}

interface UserResponseData {
  id: string;
  userId: string | null;
  thumbnail: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string | null;
  password: string | null;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  birthPlace: string;
  usIDNo: string;
  usIDFile: string;
  relationship: string | null;
  parentUserId: string | null;
  spouseNationality: string | null;
  isActive: boolean;
  isDeleted: boolean;
  validTill: string | null;
  createdAt: string;
  updatedAt: string;
  systemRole: string | null;
  primaryRole: string;
  secondaryRole: string[];
  type: string;
  status: string;
  addresses: Address[];
  organization: Organization[];
  professionalInfo: ProfessionalInfo | null;
  familyMembers: FamilyMember[];
}

interface UserApiResponse {
  success: boolean;
  message: string;
  data: UserResponseData;
  error: any | null;
}
