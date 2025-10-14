import typescript from "@rollup/plugin-typescript";
import packageJson from "./package.json" with { type: "json" };

/** @type {{ format: rollup.InternalModuleFormat, target: string, file: string  }[]} */
const formats = [
  { format: "cjs", target: "es5", file: packageJson.main },
  { format: "es", target: "es2019", file: packageJson.module },
];

export default formats.map((format) => ({
  plugins: [
    typescript({
      compilerOptions: { target: format.target },
    }),
  ],
  external: Object.keys(packageJson.dependencies),
  input: "src/index.ts",
  output: {
    file: format.file,
    format: format.format,
    sourcemap: true,
  },
}));
