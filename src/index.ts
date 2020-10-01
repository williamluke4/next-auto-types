import { join } from "path";
import { Project, ProjectOptions } from "ts-morph";
import { addMissingImports } from "./addImports";
import { addTypesToPage } from "./addTypesToPage";

interface Options {
  tsProjectOptions?: ProjectOptions;
  /**
   * default:  "./pages/**\/*.{ts,tsx}"
   */
  customPagesGlob?: string;
  /**
   * default:  true
   */
  save: boolean;
}

export async function run(projectDir: string, options?: Options) {
  // Read more: https://ts-morph.com/setup/
  const project = new Project(options?.tsProjectOptions);
  const pagesGlob = options?.customPagesGlob || "./pages/**/*.{ts,tsx}";
  const globs = join(projectDir, pagesGlob);
  // Add source files
  const sourceFiles = project.addSourceFilesAtPaths(globs);
  sourceFiles.forEach((sourceFile) => {
    const foundFunctions = addMissingImports(sourceFile);
    addTypesToPage(sourceFile, foundFunctions);
  });
  if (options.save) {
    await project.save();
  }
}
