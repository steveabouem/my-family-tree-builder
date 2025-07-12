export interface DFamilyDTO {
  id: number;
  name:string;
  profile_url: string;
  head_count: number;
  description: string;
  base_location:number; //TODO: google locations
  head_1: number;
  head_2: number;
  tree: number;
  members:number[];
  created_by: Date;
  createdAt: Date;
  updatedAt: Date;
}