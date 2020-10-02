import { Project } from "ts-morph";
import { addMissingImports } from "../../src/addImports";
import { addTypesToPage } from "../../src/addTypesToPage";
import { join } from "path";
import { getUsedNextFunctions, isJS } from "../../src/utils";
import { addJSDoc } from "../../src/addJSDoc";

let testProject: Project | null;

const files = ['js', 'jsx', 'ts', 'tsx']
export async function runTestProject(projectDir: string, fileToTest:string) {
  // Read more: https://ts-morph.com/setup/

  testProject = testProject ||  new Project({
    compilerOptions: {
      allowJs: true
    }
  });
  const pagesGlob = `./${fileToTest}`;
  const globs = join(projectDir, pagesGlob);
  const sourceFile = testProject.addSourceFileAtPath(globs)
  // Add source files
  const foundFunctions = getUsedNextFunctions(sourceFile)
  if(isJS(sourceFile)){
    addJSDoc(sourceFile, foundFunctions)
  }else {
    addMissingImports(sourceFile, foundFunctions);
    addTypesToPage(sourceFile, foundFunctions);
  }
  await testProject.save();

}