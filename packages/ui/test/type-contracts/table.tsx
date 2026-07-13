import { Table, TableContainer } from "../../src/components/table";

const plainOverflow = (
  <TableContainer>
    <Table />
  </TableContainer>
);

const focusableWithAriaLabel = (
  <TableContainer focusable aria-label="Projects">
    <Table />
  </TableContainer>
);

const focusableWithAriaLabelledBy = (
  <TableContainer focusable aria-labelledby="projects-title">
    <Table />
  </TableContainer>
);

const invalidUnnamedFocusable = (
  // @ts-expect-error Focusable table regions require aria-label or aria-labelledby.
  <TableContainer focusable>
    <Table />
  </TableContainer>
);

void [plainOverflow, focusableWithAriaLabel, focusableWithAriaLabelledBy, invalidUnnamedFocusable];
