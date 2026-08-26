/** @type {import('@opennextjs/cloudflare').OpenNextConfig} */
const config = {
  default: {
    override: {
      wrapper: "cloudflare",
    },
  },
};

module.exports = config;
