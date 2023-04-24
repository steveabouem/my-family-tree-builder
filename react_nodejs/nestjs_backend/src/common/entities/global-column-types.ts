import { Column } from 'typeorm';

export class CreatedAndUpdated {
  // use prefix record
  @Column({ default: () => 'NOW()' })
  created: Date;

  @Column({ nullable: true })
  updated: Date;
}

export class CreatedAndUpdatedBy {
  // use prefix record
  @Column(() => CreatedAndUpdated)
  date: Date;
  // TODO: check readme
  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;
}

export class NameAndDesc {
  // use prefix item
  @Column({ default: 'auto' })
  name: string;

  @Column({ nullable: true })
  description: string;
}
