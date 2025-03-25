class Router {
  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {},
    };
  }

  get(path, callback) {
    this.routes.GET[path] = callback;
  }

  post(path, callback) {
    this.routes.POST[path] = callback;
  }

  put(path, callback) {
    this.routes.PUT[path] = callback;
  }

  delete(path, callback) {
    this.routes.DELETE[path] = callback;
  }

  handleRequest(req, res) {
    const { method, url } = req;

    if (this.routes[method] && this.routes[method][url]) {
      this.routes[method][url](req, res);
      return;
    }

    const matchingRoute = Object.keys(this.routes[method] || {}).find(
      (route) => {
        const routeParts = route.split("/");
        const urlParts = url.split("/");

        if (routeParts.length !== urlParts.length) return false;

        return routeParts.every(
          (part, i) => part.startsWith(":") || part === urlParts[i]
        );
      }
    );

    if (matchingRoute) {
      const routeParts = matchingRoute.split("/");
      const urlParts = url.split("/");
      const params = {};

      routeParts.forEach((part, i) => {
        if (part.startsWith(":")) {
          params[part.slice(1)] = urlParts[i];
        }
      });

      req.params = params;
      this.routes[method][matchingRoute](req, res);
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }

  use(basePath, subRouter) {
    Object.keys(subRouter.routes).forEach((method) => {
      Object.entries(subRouter.routes[method]).forEach(([path, handler]) => {
        const newPath = `${basePath}${path === "/" ? "" : path}`;
        this.routes[method][newPath] = handler;
      });
    });
  }
}

module.exports = new Router();
