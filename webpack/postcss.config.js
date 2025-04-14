// postcss.config.js
import autoprefixer from "autoprefixer"
import postcssPresetEnv from "postcss-preset-env"

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ["last 2 versions", ">1%"],
    }),
    postcssPresetEnv(),
  ],
}
