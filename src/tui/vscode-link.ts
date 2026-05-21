const wrapOsc8 = (url: string, text: string): string =>
  `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;

export const toVscodeLink = (projectPath: string, label: string): string => {
  if (!projectPath || projectPath === "unknown") return label;
  const encoded = projectPath.split("/").map(encodeURIComponent).join("/");
  return wrapOsc8(`vscode://file${encoded}`, label);
};
