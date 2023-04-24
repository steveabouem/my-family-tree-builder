export class CreateHouseholdDTO {
  readonly itemName: string;
  readonly itemDescription: string;
  readonly admin: string;
  // upon initial creation of a Household, the creator will be the admin
  //  by default. He can transfer or share the rights  with any other member
}
