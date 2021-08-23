import * as core from '@actions/core';
import * as github from '@actions/github';
import { get } from 'lodash';

import { jira } from './jira';
import { addLabelByName, removeLabelByName } from './labels';

(async (): Promise<void> => {
  const ticket = core.getInput('ticket');
  const fields = core.getInput('fields');
  const label = core.getInput('label');

  const id = github?.context?.payload?.pull_request?.node_id;
  const labels = github?.context?.payload?.pull_request?.labels ?? [];

  if (!ticket) {
    core.info('No ticket supplied, exiting.');

    return;
  }

  try {
    const ticketData = await jira.findIssue(ticket);

    if (!fields) {
      return;
    }

    const missingFields = fields
      .split(',')
      .map((field) => [field, get(ticketData, field)])
      .filter(([_, value]) => value == null);

    if (missingFields.length) {
      if (label && id) {
        await addLabelByName({ id }, label);
      }

      core.setFailed(
        `Fields ${missingFields
          .map(([field]) => `"${field}"`)
          .join(', ')} are missing!`,
      );

      return;
    }
  } catch (error) {
    core.setFailed(`"${ticket}" is not a valid Jira ticket!`);

    return;
  }

  const hasBadLabel = labels.some(
    (curr: { name: string }) => curr.name === label,
  );

  if (hasBadLabel && id) {
    await removeLabelByName({ id }, label);
  }
})();
