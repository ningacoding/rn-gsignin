module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // release commits won't pass otherwise
    'footer-max-line-length': [0, 'always', 5000],
  },
};
