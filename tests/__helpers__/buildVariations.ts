import {
  export_variations,
  import_variations,
  page_export_variations,
} from "../../fixtures/variations";

type Filter = (value: string, index: number, array: string[]) => boolean;
type Extension = 'js' | 'jsx' | 'ts' | 'tsx'
export function buildVariations(extension: Extension, filter?: {
  import?: Filter;
  export?: Filter;
  page?: Filter;
}): { [filename: string]: string } {
  const variations = {};
  // Please no comments on this
  const filtered_import_variations_keys = filter?.import
    ? Object.keys(import_variations).filter(filter?.import)
    : Object.keys(import_variations);
  const filtered_export_variations_keys = filter?.export
    ? Object.keys(export_variations).filter(filter?.export)
    : Object.keys(export_variations);
  const filtered_page_export_variations_keys = filter?.page
    ? Object.keys(page_export_variations).filter(filter?.page)
    : Object.keys(page_export_variations);

  filtered_import_variations_keys.forEach((imp_var_name) => {
    filtered_export_variations_keys.forEach((exp_var_name) => {
      filtered_page_export_variations_keys.forEach((page_exp_var_name) => {
        const testFileName = `${imp_var_name}_and_${exp_var_name}_and_${page_exp_var_name}.${extension}`;
        variations[testFileName] =
          import_variations[imp_var_name] +
          export_variations[exp_var_name] +
          page_export_variations[page_exp_var_name];
      });
    });
  });
  return variations;
}
