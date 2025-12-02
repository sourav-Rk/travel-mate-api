import { UserRepository } from "../repositories/user.repository";
import { PostRepository } from "../repositories/post.repository";
import { S3Service } from "../services/s3.service";
import { AuthService } from "../services/auth.service";
import { PostService } from "../services/post.service";
import { AuthController } from "../controllers/auth.controller";
import { PostController } from "../controllers/post.controller";
import { AuthRoute } from "../routes/auth.routes";
import { PostRoutes } from "../routes/post.routes";

class Container {
  // Repositories
  private _userRepository: UserRepository | null = null;
  private _postRepository: PostRepository | null = null;

  // Services
  private _s3Service: S3Service | null = null;
  private _authService: AuthService | null = null;
  private _postService: PostService | null = null;

  // Controllers
  private _authController: AuthController | null = null;
  private _postController: PostController | null = null;

  //Routes
  private _authRouter: AuthRoute | null = null;
  private _postRouter: PostRoutes | null = null;

  // Repository Getters
  get userRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository();
    }
    return this._userRepository;
  }

  get postRepository(): PostRepository {
    if (!this._postRepository) {
      this._postRepository = new PostRepository();
    }
    return this._postRepository;
  }

  // Service Getters
  get s3Service(): S3Service {
    if (!this._s3Service) {
      this._s3Service = new S3Service();
    }
    return this._s3Service;
  }

  get authService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService(this.userRepository);
    }
    return this._authService;
  }

  get postService(): PostService {
    if (!this._postService) {
      this._postService = new PostService(
        this.postRepository,
        this.s3Service,
        this.userRepository
      );
    }
    return this._postService;
  }

  // Controller Getters
  get authController(): AuthController {
    if (!this._authController) {
      this._authController = new AuthController(this.authService);
    }
    return this._authController;
  }

  get postController(): PostController {
    if (!this._postController) {
      this._postController = new PostController(this.postService);
    }
    return this._postController;
  }

  get authRouter(): AuthRoute {
    if (!this._authRouter) {
      this._authRouter = new AuthRoute();
    }
    return this._authRouter;
  }

  get postRouter(): PostRoutes {
    if (!this._postRouter) {
      this._postRouter = new PostRoutes();
    }

    return this._postRouter;
  }
}

export const container = new Container();
