# AutoTypes for NextJSs Funky Function

## Setup

```
yarn
```

## Development

### Running all tests

`yarn test`

### Running Specific Tests

Remove the skip from `dev.test.ts`
Then run `yarn dev` and check the snapshot

You are able to filter the tests by modifying the filter function on `buildVariations`

```
buildVariations({
  page: (value) => {
    return value.includes("const_named");
  },
  import: (value) => value.includes("server"),
});
```
