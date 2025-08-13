import { RepositoryRegistry } from "./repository.register";
import { ServiceRegistory } from "./service.register";
import { UsecaseRegistory } from "./usecase.registory";

export class DependencyInjection {
  static registerAll(): void {
    RepositoryRegistry.registerRepositories();
    UsecaseRegistory.registerUsecases();
    ServiceRegistory.registerService();
  }
}
