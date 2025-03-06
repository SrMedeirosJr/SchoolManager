import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryRelationToFinance1741275617778 implements MigrationInterface {
    name = 'AddCategoryRelationToFinance1741275617778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`finance\` CHANGE \`category\` \`categoryId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD CONSTRAINT \`FK_87fcb04cf4b4f5d8f394723e817\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`finance\` DROP FOREIGN KEY \`FK_87fcb04cf4b4f5d8f394723e817\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`categoryId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` CHANGE \`categoryId\` \`category\` varchar(255) NOT NULL`);
    }

}
