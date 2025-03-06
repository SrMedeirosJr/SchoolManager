import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrackingColumn1741236642342 implements MigrationInterface {
    name = 'AddTrackingColumn1741236642342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updatedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deletedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`createdBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`updatedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`deletedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`deletedAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`deleted\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`createdBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`updatedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`deletedBy\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`finance\` ADD \`deletedAt\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`deletedBy\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`updatedBy\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`createdBy\``);
        await queryRunner.query(`ALTER TABLE \`finance\` DROP COLUMN \`deleted\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`deletedBy\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`updatedBy\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`createdBy\``);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`deleted\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deletedBy\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`updatedBy\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`createdBy\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deleted\``);
    }

}
