import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Team } from "./Team";
import { TeamMembership } from "./TeamMembership";
import * as bcrypt from "bcryptjs"; // Usamos esto para encriptar

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  // TRUCO 1: 'select: false' hace que la contraseña NUNCA viaje al frontend
  @Column({ select: false }) 
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Team, (team) => team.owner)
  ownedTeams!: Team[];

  @OneToMany(() => TeamMembership, (membership) => membership.user)
  memberships!: TeamMembership[];

  // TRUCO 2: Antes de guardar, encriptamos la contraseña automáticamente
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Si la contraseña existe y no parece ya encriptada...
    if (this.password && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}