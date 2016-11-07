import { provideRouter, RouterConfig } from '@angular/router';

import {LoginRoutes} from './login/index';
import {AuditRoutes} from './audit/index';
import {SimplebindRoutes} from './simplebind/index';

const routes: RouterConfig = [
  ...LoginRoutes,
  ...AuditRoutes,
  ...SimplebindRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
