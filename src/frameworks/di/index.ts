import { UsecaseRegistory } from "./usecase.registory";
import { RepositoryRegistry } from "./repository.register";
import { ServiceRegistory } from "./service.register";

export class DependencyInjection {
  static registerAll(): void {
    RepositoryRegistry.registerRepositories();
    UsecaseRegistory.registerUsecases();
    ServiceRegistory.registerService();
  }
}
