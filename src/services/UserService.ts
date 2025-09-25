import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

export class UserService {
  private static userRepository = AppDataSource.getRepository(User);

  static async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  static async create(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const { email, password, firstName, lastName } = userData;

    if (!email || !password || !firstName || !lastName) {
      throw new Error("Todos los campos son obligatorios");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("El formato del email no es válido");
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Ya existe un usuario con este email");
    }

    const newUser = this.userRepository.create({
      email,
      password,
      firstName,
      lastName
    });

    return await this.userRepository.save(newUser);
  }

  static async getById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  static async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
}