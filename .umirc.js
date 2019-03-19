// const Config = require("webpack-chain");
const path = require("path");
// const UmiPluginDva = require("umi-plugin-dva");

// const config = new Config();
// config.resolve.alias.set("@", path.resolve(__dirname, "./src/pages"));
// config.plugin("umi-plugin-dva").use(UmiPluginDva);

// export default config.toConfig();

export default {
  alias: {
    "@": path.resolve(__dirname, "./src") //src根目录
  },
  plugins: ["umi-plugin-dva"]
};
