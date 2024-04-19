import type { ElysiaApp } from "~/index";

export default (app: ElysiaApp) => app.get('/', { ready: true })
