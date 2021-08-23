import * as core from '@actions/core';
import * as github from '@actions/github';

import { jira } from './jira';
import { octokit } from './octokit';
import { join } from './utils';

(async (): Promise<void> => {
  const url = core.getInput('url', { required: true });
  const ticketPath = core.getInput('ticketPath');

  const projects = await jira.listProjects();
  const autolinkTargets = projects
    .map((project: { key: string }) => project.key)
    .map((key: string) => [
      `${key}-`,
      join(url, ticketPath.replace('<project>', key)),
    ]);

  const existingAutolinks = await octokit.repos.listAutolinks({
    ...github.context.repo,
  });

  core.info(JSON.stringify(autolinkTargets, null, 2));
  core.info(JSON.stringify(existingAutolinks, null, 2));
})();
