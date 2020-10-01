import {
  export_variations,
  import_variations,
  page_export_variations,
} from "../../fixtures/variations";

type Filter = (value: string, index: number, array: string[]) => boolean;
export function buildVariations(filter?: {
  import?: Filter;
  export?: Filter;
  page?: Filter;
}): { [filename: string]: string } {
  const variations = {};
  // Please no comments on this
  const filtered_import_variations_keys = filter?.import
    ? Object.keys(import_variations.ts).filter(filter?.import)
    : Object.keys(import_variations.ts);
  const filtered_export_variations_keys = filter?.export
    ? Object.keys(export_variations.ts).filter(filter?.export)
    : Object.keys(export_variations.ts);
  const filtered_page_export_variations_keys = filter?.page
    ? Object.keys(page_export_variations.ts).filter(filter?.page)
    : Object.keys(page_export_variations.ts);

  filtered_import_variations_keys.forEach((imp_var_name) => {
    filtered_export_variations_keys.forEach((exp_var_name) => {
      filtered_page_export_variations_keys.forEach((page_exp_var_name) => {
        const testFileName = `${imp_var_name}_and_${exp_var_name}_and_${page_exp_var_name}.ts`;
        variations[testFileName] =
          import_variations.ts[imp_var_name] +
          export_variations.ts[exp_var_name] +
          page_export_variations.ts[page_exp_var_name];
      });
    });
  });
  return variations;
}
