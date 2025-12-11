import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

export enum DependencyType {
  DEPENDS_ON = "DEPENDS_ON",       // La tarea depende de otra para avanzar
  BLOCKED_BY = "BLOCKED_BY",       // La tarea está bloqueada externamente
  DUPLICATED_WITH = "DUPLICATED_WITH" // Tareas duplicadas
}

@Entity("task_dependencies")
export class TaskDependency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: DependencyType,
    default: DependencyType.DEPENDS_ON
  })
  type!: DependencyType;

  @Column({ type: "text", nullable: true })
  note?: string; 

  // --- RELACIÓN: Tarea Origen (Quién tiene la dependencia) ---
  @Column({ name: 'source_task_id' })
  sourceTaskId!: number;

  @ManyToOne(() => Task, (task) => task.outgoingDependencies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_task_id' })
  sourceTask!: Task;

  // --- RELACIÓN: Tarea Objetivo (De quién depende) ---
  @Column({ name: 'target_task_id' })
  targetTaskId!: number;

  @ManyToOne(() => Task, (task) => task.incomingDependencies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'target_task_id' })
  targetTask!: Task;

  // --- Auditoría ---
  @Column({ name: 'created_by', nullable: true })
  createdById?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}