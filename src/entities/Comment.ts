import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Relación con Tarea
  @Column({ name: 'task_id' })
  taskId!: number;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  // Relación con Usuario (Creador)
  @Column({ name: 'user_id', nullable: true }) // 'nullable: true' evita errores si hay datos viejos
  createdById!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  createdBy!: User; 
}