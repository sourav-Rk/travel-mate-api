import { AdminRoute } from "../admin/admin.route";
import { BaseRoute } from "../base.route";
import { ClientRoute } from "../client/client.route";
import { GuideRoute } from "../guide/guide.route";
import { VendorRoute } from "../vendor/vendor.route";

export class PrivateRoute extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    this.router.use("/_cl", new ClientRoute().router);
    this.router.use("/_ad", new AdminRoute().router);
    this.router.use("/_ve", new VendorRoute().router);
    this.router.use("/_gu", new GuideRoute().router);
  }
}
