import * as core from '@actions/core';

import { jira } from './jira';
import { join } from './utils';

(async (): Promise<void> => {
  const url = core.getInput('url', { required: true });
  const ticketPath = core.getInput('ticketPath');

  const projects = await jira.listProjects();
  const autolinkTargets = projects
    .map((project: { key: string }) => project.key)
    .map((key: string) => ticketPath.replace('<project>', key))
    .map((path: string) => join(url, path));

  core.info(JSON.stringify(autolinkTargets, null, 2));
})();
