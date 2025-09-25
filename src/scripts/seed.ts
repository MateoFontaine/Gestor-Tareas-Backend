import "reflect-metadata";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Task, TaskStatus, TaskPriority } from "../entities/Task";
import { Comment } from "../entities/Comment";
import { TeamMembership, MemberRole } from "../entities/TeamMembership";

async function seedDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Conectado a la base de datos");

    // Verificar si ya hay datos
    const userCount = await AppDataSource.getRepository(User).count();
    if (userCount > 0) {
      console.log("La base de datos ya contiene usuarios. El seed ya fue ejecutado.");
      console.log("Si deseas volver a ejecutar el seed, limpia la base de datos primero.");
      return;
    }

    console.log("Creando datos de prueba...");

    // Crear usuarios
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.save([
      { email: "admin@gestor.com", password: "admin123", firstName: "Admin", lastName: "Sistema" },
      { email: "juan.perez@dev.com", password: "dev123", firstName: "Juan", lastName: "Pérez" },
      { email: "maria.garcia@dev.com", password: "dev123", firstName: "María", lastName: "García" },
      { email: "carlos.lopez@dev.com", password: "dev123", firstName: "Carlos", lastName: "López" }
    ]);
    console.log(`✓ Creados ${users.length} usuarios`);

    // Crear equipos
    const teamRepo = AppDataSource.getRepository(Team);
    const teams = await teamRepo.save([
      { name: "Frontend Team", description: "Desarrollo de interfaces de usuario", ownerId: users[0].id },
      { name: "Backend Team", description: "Desarrollo de APIs y servicios", ownerId: users[0].id },
      { name: "QA Team", description: "Control de calidad y testing", ownerId: users[1].id }
    ]);
    console.log(`✓ Creados ${teams.length} equipos`);

    // Crear membresías
    const membershipRepo = AppDataSource.getRepository(TeamMembership);
    await membershipRepo.save([
      { userId: users[1].id, teamId: teams[0].id, role: MemberRole.MEMBER },
      { userId: users[2].id, teamId: teams[0].id, role: MemberRole.MEMBER },
      { userId: users[2].id, teamId: teams[1].id, role: MemberRole.MEMBER },
      { userId: users[3].id, teamId: teams[1].id, role: MemberRole.MEMBER },
      { userId: users[3].id, teamId: teams[2].id, role: MemberRole.MEMBER }
    ]);
    console.log("✓ Membresías creadas");

    // Crear tareas
    const taskRepo = AppDataSource.getRepository(Task);
    const tasks = await taskRepo.save([
      {
        title: "Implementar autenticación",
        description: "Desarrollar sistema de login con JWT",
        teamId: teams[1].id,
        createdById: users[0].id,
        assignedToId: users[2].id,
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date('2025-12-31')
      },
      {
        title: "Diseñar homepage",
        description: "Crear diseño responsive de la página principal",
        teamId: teams[0].id,
        createdById: users[0].id,
        assignedToId: users[1].id,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING,
        dueDate: new Date('2025-11-30')
      },
      {
        title: "Testing de endpoints",
        description: "Pruebas unitarias para todos los endpoints de la API",
        teamId: teams[2].id,
        createdById: users[1].id,
        assignedToId: users[3].id,
        priority: TaskPriority.LOW,
        status: TaskStatus.COMPLETED
      },
      {
        title: "Documentar API",
        description: "Crear documentación completa con Swagger",
        teamId: teams[1].id,
        createdById: users[0].id,
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING
      }
    ]);
    console.log(`✓ Creadas ${tasks.length} tareas`);

    // Crear comentarios
    const commentRepo = AppDataSource.getRepository(Comment);
    await commentRepo.save([
      {
        content: "Iniciando implementación del sistema de autenticación",
        taskId: tasks[0].id,
        authorId: users[2].id
      },
      {
        content: "JWT configurado correctamente, falta middleware de validación",
        taskId: tasks[0].id,
        authorId: users[2].id
      },
      {
        content: "Mockups aprobados por el cliente, comenzando desarrollo",
        taskId: tasks[1].id,
        authorId: users[1].id
      },
      {
        content: "Testing completado - 95% de cobertura alcanzado",
        taskId: tasks[2].id,
        authorId: users[3].id
      },
      {
        content: "Todas las pruebas pasan correctamente",
        taskId: tasks[2].id,
        authorId: users[1].id
      }
    ]);
    console.log("✓ Comentarios creados");

    console.log("\n🎉 ¡Seed completado exitosamente!");
    console.log("\n📊 Datos de prueba disponibles:");
    console.log("👥 4 usuarios:");
    console.log("   - admin@gestor.com / admin123");
    console.log("   - juan.perez@dev.com / dev123");
    console.log("   - maria.garcia@dev.com / dev123");
    console.log("   - carlos.lopez@dev.com / dev123");
    console.log("🏢 3 equipos (Frontend, Backend, QA)");
    console.log("📋 4 tareas con diferentes estados");
    console.log("💬 5 comentarios en las tareas");
    console.log("👨‍👩‍👧‍👦 Membresías de usuarios en equipos");
    console.log("\n🚀 ¡Ya puedes probar la API con los datos cargados!");

  } catch (error) {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase();