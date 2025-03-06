import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrackingColumnChild1741272320064 implements MigrationInterface {
    name = 'AddTrackingColumnChild1741272320064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`createdBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`updatedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`deletedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`child\` ADD \`deletedAt\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`deletedBy\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`updatedBy\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`createdBy\``);
        await queryRunner.query(`ALTER TABLE \`child\` DROP COLUMN \`deleted\``);
    }

}
