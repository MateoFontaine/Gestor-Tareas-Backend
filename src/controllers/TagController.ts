import { Request, Response } from "express";
import { TagService } from "../services/TagService";

export class TagController {
  static async getAll(req: Request, res: Response) {
    try {
      const tags = await TagService.getAll();
      res.json({
        message: "Etiquetas obtenidas correctamente",
        data: tags
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener etiquetas",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  static async getByTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;
      const tags = await TagService.getByTeam(parseInt(teamId));
      res.json({
        message: "Etiquetas del equipo obtenidas correctamente",
        data: tags
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener etiquetas del equipo",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const tag = await TagService.create(req.body);
      res.status(201).json({
        message: "Etiqueta creada correctamente",
        data: tag
      });
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : "Error al crear etiqueta"
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedTag = await TagService.update(parseInt(id), req.body);
      res.json({
        message: "Etiqueta actualizada correctamente",
        data: updatedTag
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Etiqueta no encontrada") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({
        message: error instanceof Error ? error.message : "Error al actualizar etiqueta"
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await TagService.delete(parseInt(id));
      res.json({
        message: "Etiqueta eliminada correctamente",
        data: result
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Etiqueta no encontrada") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error al eliminar etiqueta",
        error: error instanceof Error ? error.message : "Error desconocido"
      });
    }
  }
}