import "reflect-metadata";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Task, TaskStatus, TaskPriority } from "../entities/Task";
import { Comment } from "../entities/Comment";
import { TeamMembership, MemberRole } from "../entities/TeamMembership";
import { TaskDependency, DependencyType } from "../entities/TaskDependency";
import { Tag } from "../entities/Tag";

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos");

    // Verificar si ya hay datos
    const userCount = await AppDataSource.getRepository(User).count();
    if (userCount > 0) {
      console.log("⚠️ Base de datos con datos previos. BORRANDO TODO PARA EMPEZAR DE CERO...");
      
      // Limpieza radical para que no haya conflictos de IDs
      await AppDataSource.query(`TRUNCATE TABLE "comments", "task_tags", "tags", "task_dependencies", "tasks", "team_memberships", "teams", "users" RESTART IDENTITY CASCADE;`);
      console.log("🧹 Base de datos limpia.");
    }

    console.log("Creando datos masivos...");

    // 1. Usuarios
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.save([
      { email: "admin@gestor.com", password: "admin123", firstName: "Admin", lastName: "Sistema" },
      { email: "juan.perez@dev.com", password: "dev123", firstName: "Juan", lastName: "Pérez" },
      { email: "maria.garcia@dev.com", password: "dev123", firstName: "María", lastName: "García" },
      { email: "carlos.lopez@dev.com", password: "dev123", firstName: "Carlos", lastName: "López" }
    ]);

    // 2. Equipos
    const teamRepo = AppDataSource.getRepository(Team);
    const teams = await teamRepo.save([
      { name: "Frontend Team", description: "UI/UX y React", ownerId: users[0].id },
      { name: "Backend Team", description: "API, Node y Base de Datos", ownerId: users[0].id },
      { name: "QA & Testing", description: "Control de Calidad", ownerId: users[1].id },
      { name: "DevOps", description: "Infraestructura y Cloud", ownerId: users[1].id }
    ]);

    // 3. Tags
    const tagRepo = AppDataSource.getRepository(Tag);
    const tags = await tagRepo.save([
      { name: "Urgente", color: "#ef4444" },
      { name: "Bug", color: "#f97316" },
      { name: "Feature", color: "#3b82f6" },
      { name: "Mejora", color: "#10b981" },
      { name: "Documentación", color: "#8b5cf6" }
    ]);

    // 4. Generación de 60 Tareas
    const taskRepo = AppDataSource.getRepository(Task);
    const createdTasks: Task[] = [];
    
    const taskTitles = [
      "Implementar Login", "Diseñar Home", "Corregir Bug #102", "Optimizar DB", 
      "Configurar Docker", "Crear Tests Unitarios", "Revisar PRs", "Actualizar Node",
      "Cambiar colores CSS", "Reunión con Cliente", "Hacer Deploy", "Configurar CI/CD",
      "Documentar Endpoints", "Refactorizar Auth", "Crear Seed", "Arreglar Navbar",
      "Optimizar Imágenes", "Configurar Nginx", "Migrar a TypeScript", "Backup Semanal"
    ];

    console.log("Generando 60 tareas...");
    for (let i = 0; i < 60; i++) {
        const randomTitle = taskTitles[Math.floor(Math.random() * taskTitles.length)];
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomStatus = Object.values(TaskStatus)[Math.floor(Math.random() * 4)];
        const randomPriority = Object.values(TaskPriority)[Math.floor(Math.random() * 3)];

        const task = await taskRepo.save({
            title: `${randomTitle} (Iteración ${i+1})`,
            description: `Descripción detallada para la tarea ${i+1}. Esto es un texto de relleno para que se vea bien en el modal.`,
            teamId: randomTeam.id,
            createdById: users[0].id,
            assignedToId: randomUser.id,
            status: randomStatus,
            priority: randomPriority,
            dueDate: new Date(new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 30))) // Fecha futura random
        });
        
        // Asignar tags random
        if (Math.random() > 0.5) {
            const randomTag = tags[Math.floor(Math.random() * tags.length)];
            await AppDataSource.createQueryBuilder().relation(Task, "tags").of(task).add(randomTag);
        }

        createdTasks.push(task);
    }

    // 5. Dependencias (Bloqueos)
    console.log("Generando bloqueos aleatorios...");
    const depRepo = AppDataSource.getRepository(TaskDependency);
    
    // Creamos 15 dependencias al azar
    for (let i = 0; i < 15; i++) {
        const source = createdTasks[Math.floor(Math.random() * createdTasks.length)];
        const target = createdTasks[Math.floor(Math.random() * createdTasks.length)];

        if (source.id !== target.id) {
            // Evitamos duplicados con un try/catch simple
            try {
                await depRepo.save({
                    sourceTaskId: source.id,
                    targetTaskId: target.id,
                    type: DependencyType.DEPENDS_ON,
                    note: "Dependencia generada automáticamente",
                });
            } catch (e) {} // Ignoramos si ya existe o hay ciclo
        }
    }

    // 6. Comentarios
    const commentRepo = AppDataSource.getRepository(Comment);
    for (const task of createdTasks) {
        if (Math.random() > 0.7) { // 30% de las tareas tienen comentario
             await commentRepo.save({
                content: "Este es un comentario de prueba generado automáticamente.",
                taskId: task.id,
                createdById: users[Math.floor(Math.random() * users.length)].id
             });
        }
    }

    console.log("\n🎉 ¡Seed Masivo completado!");
    console.log(`📊 Se crearon:`);
    console.log(`   - 60 Tareas`);
    console.log(`   - 15 Dependencias`);
    console.log(`   - 4 Equipos`);
    console.log(`   - 5 Tags`);
    console.log("\n🚀 Ahora puedes probar la paginación real en el Frontend.");

  } catch (error) {
    console.error("❌ Error en el seed:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase();