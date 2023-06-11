export interface PaginationParamsInput {
  rows: number;
  page: number;
}

export interface PaginationParamsOutput extends PaginationParamsInput {
  offset: number;
}

export function getPaginationParams({
  rows,
  page,
}: PaginationParamsInput): PaginationParamsOutput {
  let offset = 0;
  if (!rows) rows = 10;
  if (!page) page = 1;
  rows = +rows;
  page = +page;
  offset = (page - 1) * rows;

  return {
    rows,
    offset,
    page,
  };
}
