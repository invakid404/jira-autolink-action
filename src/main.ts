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
    .map((project: { key: string }) => project.key)
    .map((key: string) => [
      `${key}-`,
      join(url, ticketPath.replace('<project>', key)),
    ])
    .filter(([prefix]: [string]) => !autolinkKeys.has(prefix));

  await Promise.all(
    autolinkTargets.map(async ([prefix, targetURL]: [string, string]) =>
      octokit.repos.createAutolink({
        ...github.context.repo,
        key_prefix: prefix,
        url_template: targetURL,
      }),
    ),
  );
})();
