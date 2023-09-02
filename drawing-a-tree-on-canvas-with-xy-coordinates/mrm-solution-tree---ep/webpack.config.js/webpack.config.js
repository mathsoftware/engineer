module.exports = env => {
  let mode = 'prod';
  if (env['dev']) {
    mode = 'dev';
  }
  else if (!env['prod']) {
    const msg = `
      Invalid build argument env: ${ env }, use 'dev' or 'prod' only.\n
      Using 'prod' production mode by default.
    `;
    console.log(msg);
  }
  return require(`./webpack/webpack.config.${ mode }`);
};
