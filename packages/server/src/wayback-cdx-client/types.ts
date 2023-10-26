export type FieldType =
  | 'urlkey'
  | 'timestamp'
  | 'original'
  | 'mimetype'
  | 'statuscode'
  | 'digest'
  | 'length';

export type SearchFilter = {
  [key in FieldType]: string;
};

export type SearchOptions = {
  filter: SearchFilter;
};
