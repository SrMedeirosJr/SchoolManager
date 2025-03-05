import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChildrenTable1740534412815 implements MigrationInterface {
    name = 'CreateChildrenTable1740534412815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`child\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullName\` varchar(255) NOT NULL, \`birthDate\` datetime NOT NULL, \`enrollmentDate\` datetime NOT NULL, \`schedule\` varchar(255) NOT NULL, \`class\` varchar(255) NOT NULL, \`feeAmount\` int NOT NULL, \`dueDate\` int NOT NULL, \`fatherName\` varchar(255) NULL, \`fatherPhone\` varchar(255) NULL, \`motherName\` varchar(255) NULL, \`motherPhone\` varchar(255) NULL, UNIQUE INDEX \`IDX_5e4e62a9633bcba57649457cf9\` (\`fullName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_5e4e62a9633bcba57649457cf9\` ON \`child\``);
        await queryRunner.query(`DROP TABLE \`child\``);
    }

}
