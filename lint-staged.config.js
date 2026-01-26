export default {
  '*.{ts,tsx,js,jsx}': (filenames) => {
    const commands = [];
    const files = filenames.join(' ');

    if (files) {
      commands.push(`eslint --fix ${files}`);
      commands.push(`prettier --write ${files}`);
    }

    return commands;
  },
  '*.{json,md,yml,yaml,css}': (filenames) => {
    const files = filenames.join(' ');
    return files ? [`prettier --write ${files}`] : [];
  },
};
