export class CreateHouseholdDTO {
  readonly name: string;
  readonly description: string;
  readonly admin_id: string;
  // upon initial creation of a Household, the creator will be the admin
  //  by default. He can transfer or share the rights  with any other member
}
