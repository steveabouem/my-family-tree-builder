import { MigrationInterface, QueryRunner } from 'typeorm';

export class createObjectiveTable1667870001245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE  objective ( id int NOT NULL AUTO_INCREMENT, description varchar(255), cost int, created DATETIME NOT NULL, updated DATETIME, assignee int NOT NULL, PRIMARY KEY (id) );",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "objective";`);
  }
}
