import { Octokit } from '@octokit/rest';

export const octokit = new Octokit({
  auth: `token ${process.env.GITHUB_TOKEN}`,
  userAgent: 'jira-autolink-action',
});
