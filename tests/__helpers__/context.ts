import del from 'del'
import mkdir from 'make-dir'
import * as jetpack from "fs-jetpack";
const { wrap } = require('jest-snapshot-serializer-raw');

// Import one of jetpack's interfaces to cast it on a variable declaration.
import { InspectResult } from "fs-jetpack/types";

import { dirname, join } from 'path'
import tempy from 'tempy'
import dedent from 'dedent'
import { readAsync } from 'fs-jetpack';

const testRootDir = tempy.directory()
interface Options {
  fs: {
    [filename: string]: string
  }
}
export class TestContext {
  async beforeEach(){
    await mkdir(testRootDir)
  }
  async afterEach(){
    await del(testRootDir, { force: true }) // Need force: true because `del` does not delete dirs outside the CWD
  }
  async setup(options: Options){
    const testDir = await writeFiles(testRootDir, options.fs)
    return testDir
  }
  async snapshotFiles(){
    const tree = jetpack.inspectTree(testRootDir, {relativePath: true})
    const wait = tree.children.map(async (child) => {
      if(child.type === 'file' && child.relativePath){
        const data = await readAsync(join(testRootDir, child.relativePath))
        expect(wrap(dedent(data))).toMatchSnapshot()
      }
    })
    await Promise.all(wait)
  }
}

// create a temporary set of files
async function writeFiles(
  root: string,
  files: {
    [name: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
  },
): Promise<string> {
  for (const name in files) {
    const filepath = join(root, name)
    // console.log(name);
    await mkdir(dirname(filepath))
    await jetpack.writeAsync(filepath, dedent(files[name]))
  }
  // return the test path
  return root
}

