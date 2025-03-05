import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeesTable1740538291521 implements MigrationInterface {
    name = 'CreateEmployeesTable1740538291521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullName\` varchar(255) NOT NULL, \`birthDate\` date NOT NULL, \`position\` varchar(255) NOT NULL, \`salary\` decimal(10,2) NOT NULL, \`hiringDate\` date NULL, \`phoneNumber\` varchar(255) NULL, \`email\` varchar(255) NULL, \`status\` varchar(255) NOT NULL DEFAULT 'ativo', UNIQUE INDEX \`IDX_817d1d427138772d47eca04885\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_817d1d427138772d47eca04885\` ON \`employee\``);
        await queryRunner.query(`DROP TABLE \`employee\``);
    }

}
