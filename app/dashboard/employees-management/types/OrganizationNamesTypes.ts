export interface OrganizationNamesApiResponse {
  orgs:        Org[];
  currentPage: number;
  limit:       number;
  totalOrgs:   number;
  totalPages:  number;
  hasNext:     boolean;
  hasPrev:     boolean;
}

export interface Org {
  id:        string;
  orgId:     null;
  name:      string;
  status:    string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterState {
  status:string;
  from: Date | "";
  to: Date | "";
  organizationName: string;
}

//---------------------## Dummy types Start ##---------------------
// TODO: Remove this dummy types later
export interface GetOrganizationNamesApiResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CreateOrganizationNamesApiResponse{

}

export interface Product {
  id: string
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: Meta
  images: string[]
  thumbnail: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface Meta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}


//---------------------## Dummy types End ##-----------------------