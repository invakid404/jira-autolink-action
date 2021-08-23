import * as core from '@actions/core';

import { jira } from './jira';

(async (): Promise<void> => {
  core.info('Hello, world!');

  const projects = await jira.listProjects();
  core.info(JSON.stringify(projects, null, 2));
})();
