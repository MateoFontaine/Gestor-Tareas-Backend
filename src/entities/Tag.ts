import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Team } from "./Team";
import { Task } from "./Task";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column({ nullable: true })
  teamId?: number;

  @ManyToOne(() => Team, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "teamId" })
  team?: Team;

  @ManyToMany(() => Task, (task) => task.tags)  // ← Agregar esta línea
  tasks!: Task[];  // ← Agregar esta línea

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}