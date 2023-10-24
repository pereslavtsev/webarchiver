import { FC, useEffect, useState } from 'react';
import PagesService from '../services/pages.service';
import {
  useReactTable,
  flexRender,
  createColumnHelper,
  getCoreRowModel,
} from '@tanstack/react-table';
import { HTMLTable, Tag } from "@blueprintjs/core";

const columnHelper = createColumnHelper<any>();

const pagesService = new PagesService();

const PageList: FC = () => {
  const [pages, setPages] = useState<any>([]);
  useEffect(() => {
    pagesService.list().then((value) => setPages(value.data));
  }, []);
  const { getHeaderGroups, getRowModel, getCenterTotalSize } = useReactTable({
    data: pages,
    columns: [
      columnHelper.accessor('id', {
        header: 'ID',
        size: 50,
      }),
      columnHelper.accessor('title', {
        header: 'Title',
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        size: 50,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        size: 0,
        cell: props => <Tag minimal>{props.getValue()}</Tag>
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <HTMLTable
      bordered
      interactive
      striped
      style={{ width: '100%' }}
    >
      <thead>
        {getHeaderGroups().map((headerGroup) => {
          const { headers } = headerGroup;
          return (
            <tr key={headerGroup.id}>
              {headers.map((header) => {
                const { colSpan, column, getContext, getSize } = header;
                return (
                  <th
                    colSpan={colSpan}
                    key={column.id}
                    style={{ width: getSize() }}
                  >
                    {flexRender(column.columnDef.header, getContext())}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody>
        {getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
};

export default PageList;
