import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';

export default {
  files: 'dist/**/*.test.js',
  nodeResolve: true,
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    junitReporter({
      outputPath: './test-results.xml',
      reportLogs: true,
    }),
  ],
};
