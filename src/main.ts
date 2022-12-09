import * as core from '@actions/core';
import * as github from '@actions/github';

import { jira } from './jira';
import { octokit } from './octokit';
import { join } from './utils';

(async (): Promise<void> => {
  const url = core.getInput('url', { required: true });
  const ticketPath = core.getInput('ticketPath');

  const { data: existingAutolinks } = await octokit.repos.listAutolinks({
    ...github.context.repo,
  });

  const autolinkKeys = new Set(
    existingAutolinks.map((autolink) => autolink.key_prefix),
  );

  const projects = await jira.listProjects();
  const autolinkTargets = projects
    .map((project: Record<string, string>) => project.key)
    .map((key) => ({
      prefix: `${key}-`,
      targetURL: join(url, ticketPath.replace('<project>', key)),
    }))
    .filter(({ prefix }) => !autolinkKeys.has(prefix));

  await Promise.all(
    autolinkTargets.map(async ({ prefix, targetURL }) =>
      octokit.repos.createAutolink({
        ...github.context.repo,
        key_prefix: prefix,
        url_template: targetURL,
        is_alphanumeric: false,
      }),
    ),
  );
})();
