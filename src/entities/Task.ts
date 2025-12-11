import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Team } from "./Team";
import { Tag } from "./Tag";
import { Comment } from "./Comment";
import { TaskDependency } from "./TaskDependency"; 

export enum TaskStatus {
  PENDING = "pendiente",
  IN_PROGRESS = "en_curso", 
  COMPLETED = "finalizada",
  CANCELLED = "cancelada"
}

export enum TaskPriority {
  HIGH = "alta",
  MEDIUM = "media",
  LOW = "baja"
}

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status!: TaskStatus;

  @Column({
    type: "enum", 
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  priority!: TaskPriority;

  @Column({ nullable: true })
  dueDate?: Date;

  @ManyToOne(() => Team)
  @JoinColumn({ name: "team_id" })
  team!: Team;

  @Column({ name: "team_id" })
  teamId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @Column({ name: "created_by" })
  createdById!: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "assigned_to" })
  assignedTo?: User;

  @Column({ name: "assigned_to", nullable: true })
  assignedToId?: number;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments!: Comment[];

  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable({
    name: "task_tags",
    joinColumn: { name: "task_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags!: Tag[];

  // --- NUEVAS RELACIONES DE DEPENDENCIAS ---
  
  // Dependencias que SALEN (Yo dependo de...)
  @OneToMany(() => TaskDependency, (dep) => dep.sourceTask)
  outgoingDependencies!: TaskDependency[];

  // Dependencias que ENTRAN (Alguien depende de mi...)
  @OneToMany(() => TaskDependency, (dep) => dep.targetTask)
  incomingDependencies!: TaskDependency[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}