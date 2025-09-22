export type Row = Record<string, unknown>;
export type Message = {
  text: string;
  tableColumns?:
    | {
        accessorKey: string;
        header: string;
      }[]
    | undefined;
  tableRows?:
    | {
        [x: string]: unknown;
      }[]
    | undefined;
};
