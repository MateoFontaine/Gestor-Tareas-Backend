import { AppDataSource } from "../config/database";
import { Tag } from "../entities/Tag";

export class TagService {
  private static tagRepository = AppDataSource.getRepository(Tag);

  static async getAll(): Promise<Tag[]> {
    return await this.tagRepository.find({
      relations: ["team"],
      order: { name: "ASC" }
    });
  }

  static async getByTeam(teamId: number): Promise<Tag[]> {
    return await this.tagRepository.find({
      where: { teamId },
      relations: ["team"],
      order: { name: "ASC" }
    });
  }

  static async getById(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ["team"]
    });

    if (!tag) {
      throw new Error("Etiqueta no encontrada");
    }

    return tag;
  }

  static async create(tagData: {
    name: string;
    color: string;
    teamId?: number;
  }): Promise<Tag> {
    const tag = this.tagRepository.create(tagData);
    const savedTag = await this.tagRepository.save(tag);
    return this.getById(savedTag.id);
  }

  static async update(
    id: number,
    updates: {
      name?: string;
      color?: string;
    }
  ): Promise<Tag> {
    const tag = await this.getById(id);
    Object.assign(tag, updates);
    await this.tagRepository.save(tag);
    return this.getById(id);
  }

  static async delete(id: number): Promise<{ id: number; name: string }> {
    const tag = await this.getById(id);
    await this.tagRepository.remove(tag);
    return { id, name: tag.name };
  }
}