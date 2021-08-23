import * as core from '@actions/core';
import JiraApi from 'jira-client';

const url = core.getInput('url', { required: true });
const username = core.getInput('username', { required: true });
const password = core.getInput('password', { required: true });

const { protocol, host } = new URL(url);

export const jira = new JiraApi({
  protocol,
  apiVersion: '2',
  strictSSL: true,
  host,
  username,
  password,
});
