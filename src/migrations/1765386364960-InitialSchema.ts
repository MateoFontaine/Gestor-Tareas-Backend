import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1765386364960 implements MigrationInterface {
    name = 'InitialSchema1765386364960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "owner_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" character varying NOT NULL, "teamId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "task_id" integer NOT NULL, "author_id" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."task_dependencies_type_enum" AS ENUM('DEPENDS_ON', 'BLOCKED_BY', 'DUPLICATED_WITH')`);
        await queryRunner.query(`CREATE TABLE "task_dependencies" ("id" SERIAL NOT NULL, "type" "public"."task_dependencies_type_enum" NOT NULL DEFAULT 'DEPENDS_ON', "note" text, "source_task_id" integer NOT NULL, "target_task_id" integer NOT NULL, "created_by" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e31de0e173af595a21c4ec8e48b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('pendiente', 'en_curso', 'finalizada', 'cancelada')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('alta', 'media', 'baja')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'pendiente', "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'media', "dueDate" TIMESTAMP, "team_id" integer NOT NULL, "created_by" integer NOT NULL, "assigned_to" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."team_memberships_role_enum" AS ENUM('propietario', 'miembro')`);
        await queryRunner.query(`CREATE TABLE "team_memberships" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "team_id" integer NOT NULL, "role" "public"."team_memberships_role_enum" NOT NULL DEFAULT 'miembro', "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_11c823f69a675c3f05d0fc31958" UNIQUE ("user_id", "team_id"), CONSTRAINT "PK_053171f713ec8a2f09ed58f08f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_histories" ("id" SERIAL NOT NULL, "action" character varying NOT NULL, "description" text NOT NULL, "task_id" integer NOT NULL, "user_id" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bd96cd730a4a6bb227688793d97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_tags" ("task_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_a7354e3c3f630636f6e4a29694a" PRIMARY KEY ("task_id", "tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_70515bc464901781ac60b82a1e" ON "task_tags" ("task_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f883135d033e1541f6a81972e7" ON "task_tags" ("tag_id") `);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_03655bd3d01df69022646faffd5" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tags" ADD CONSTRAINT "FK_a77182f8628e30cc478b549246b" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_18c2493067c11f44efb35ca0e03" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_a97bfc5bf1f93cfdf477fd7606f" FOREIGN KEY ("source_task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_2b1ff0f247bcfe867d9fda93d57" FOREIGN KEY ("target_task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" ADD CONSTRAINT "FK_4a251b37965df3adc13d3f37ddb" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_2b1604aae04e0dec6e38580e099" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_5770b28d72ca90c43b1381bf787" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_memberships" ADD CONSTRAINT "FK_c9eb2ded8e0e2f4bcb41fd0984a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_memberships" ADD CONSTRAINT "FK_b917b8603c6d5c526fcdb2009de" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_histories" ADD CONSTRAINT "FK_7d2e8dc4063a9b4c59d22918e90" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_histories" ADD CONSTRAINT "FK_9c6197febe174e17b315ac97e14" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_tags" ADD CONSTRAINT "FK_70515bc464901781ac60b82a1ea" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_tags" ADD CONSTRAINT "FK_f883135d033e1541f6a81972e7d" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_tags" DROP CONSTRAINT "FK_f883135d033e1541f6a81972e7d"`);
        await queryRunner.query(`ALTER TABLE "task_tags" DROP CONSTRAINT "FK_70515bc464901781ac60b82a1ea"`);
        await queryRunner.query(`ALTER TABLE "task_histories" DROP CONSTRAINT "FK_9c6197febe174e17b315ac97e14"`);
        await queryRunner.query(`ALTER TABLE "task_histories" DROP CONSTRAINT "FK_7d2e8dc4063a9b4c59d22918e90"`);
        await queryRunner.query(`ALTER TABLE "team_memberships" DROP CONSTRAINT "FK_b917b8603c6d5c526fcdb2009de"`);
        await queryRunner.query(`ALTER TABLE "team_memberships" DROP CONSTRAINT "FK_c9eb2ded8e0e2f4bcb41fd0984a"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_5770b28d72ca90c43b1381bf787"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_2b1604aae04e0dec6e38580e099"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_4a251b37965df3adc13d3f37ddb"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_2b1ff0f247bcfe867d9fda93d57"`);
        await queryRunner.query(`ALTER TABLE "task_dependencies" DROP CONSTRAINT "FK_a97bfc5bf1f93cfdf477fd7606f"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e6d38899c31997c45d128a8973b"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_18c2493067c11f44efb35ca0e03"`);
        await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_a77182f8628e30cc478b549246b"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_03655bd3d01df69022646faffd5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f883135d033e1541f6a81972e7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70515bc464901781ac60b82a1e"`);
        await queryRunner.query(`DROP TABLE "task_tags"`);
        await queryRunner.query(`DROP TABLE "task_histories"`);
        await queryRunner.query(`DROP TABLE "team_memberships"`);
        await queryRunner.query(`DROP TYPE "public"."team_memberships_role_enum"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "task_dependencies"`);
        await queryRunner.query(`DROP TYPE "public"."task_dependencies_type_enum"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
