import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFinanceTable1740540576946 implements MigrationInterface {
    name = 'UpdateFinanceTable1740540576946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`employeeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD CONSTRAINT \`FK_6227c3bbbff203d83c2d26639b7\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`finance\` DROP FOREIGN KEY \`FK_6227c3bbbff203d83c2d26639b7\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`employeeId\``);
    }

}
