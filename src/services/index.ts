// Services index file - central export point for all services
import api from "./api";
import * as newsService from "./newsService";
import * as reportService from "./reportService";
import * as statsService from "./statsService";
import * as userService from "./userService";

export { api, newsService, reportService, statsService, userService };
