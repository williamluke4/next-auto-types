import { join } from "path";
import { Project, ProjectOptions } from "ts-morph";
import { addMissingImports } from "./addImports";
import { addJSDoc } from "./addJSDoc";
import { addTypesToPage } from "./addTypesToPage";
import { getUsedNextFunctions, isJS } from "./utils";

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
    const foundFunctions = getUsedNextFunctions(sourceFile)
    if(isJS(sourceFile)){
      addJSDoc(sourceFile, foundFunctions)
    }else {
      addMissingImports(sourceFile, foundFunctions);
      addTypesToPage(sourceFile, foundFunctions);
    }
  });
  if (options.save) {
    await project.save();
  }
}
