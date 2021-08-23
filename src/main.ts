import * as core from '@actions/core';

import { jira } from './jira';

(async (): Promise<void> => {
  const projects = await jira.listProjects();
  const projectKeys = projects.map((project: { key: string }) => project.key);

  core.info(JSON.stringify(projectKeys, null, 2));
})();
