import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1677332359826 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`,
    );

    await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "brand"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`,
    );
  }
}
