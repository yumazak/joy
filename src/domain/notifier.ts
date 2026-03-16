import { exec } from "node:child_process";

const escapeForOsascript = (str: string): string =>
  str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export const sendNotification = (title: string, message: string): void => {
  const t = escapeForOsascript(title);
  const m = escapeForOsascript(message);
  exec(
    `osascript -e 'display notification "${m}" with title "${t}" sound name "Glass"'`,
  );
};
