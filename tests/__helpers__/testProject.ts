import { Project } from "ts-morph";
import { addMissingImports } from "../../src/addImports";
import { addTypesToPage } from "../../src/addTypesToPage";
import { join } from "path";

let testProject: Project | null;
export async function runTestProject(projectDir: string, fileToTest:string) {
  // Read more: https://ts-morph.com/setup/
  testProject = testProject ||  new Project();
  const pagesGlob = `./${fileToTest}`;
  const globs = join(projectDir, pagesGlob);
  const sourceFile = testProject.addSourceFileAtPath(globs)
  // Add source files

  const foundFunctions = addMissingImports(sourceFile);
  addTypesToPage(sourceFile, foundFunctions);
  await testProject.save();

}