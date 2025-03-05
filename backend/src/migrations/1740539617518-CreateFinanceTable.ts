import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFinanceTable1740539617518 implements MigrationInterface {
    name = 'CreateFinanceTable1740539617518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`finance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`description\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`paymentMethod\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`childId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD CONSTRAINT \`FK_afa4d22fd80a1236d72ebda9282\` FOREIGN KEY (\`childId\`) REFERENCES \`child\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`finance\` DROP FOREIGN KEY \`FK_afa4d22fd80a1236d72ebda9282\``);
        await queryRunner.query(`DROP TABLE \`finance\``);
    }

}
