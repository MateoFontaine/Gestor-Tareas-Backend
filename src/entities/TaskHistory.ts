import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity("task_histories")
export class TaskHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string; // Ej: "CAMBIO_ESTADO", "ASIGNACION", "COMENTARIO"

  @Column("text")
  description!: string; // Ej: "Cambió el estado de Pendiente a En Curso"

  // Relación con la Tarea
  @Column({ name: 'task_id' })
  taskId!: number;

  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;

  // Relación con el Usuario que hizo la acción
  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @CreateDateColumn()
  createdAt!: Date;
}