import { Flex, Input, Table, Typography, theme, type TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

const { Title } = Typography;

export interface DataTableProps<RecordType>
  extends Omit<TableProps<RecordType>, 'title'> {
  /** Heading shown in the toolbar above the table. */
  title?: ReactNode;
  /** Right-aligned toolbar actions (e.g. a "New" button). */
  toolbar?: ReactNode;
  /** When provided, renders a search input wired to this callback. */
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
}

/**
 * Table + toolbar pattern (title · search · actions). Wraps antd `Table` and
 * forwards every Table prop, so columns/pagination/loading behave as usual.
 */
export function DataTable<RecordType extends object = Record<string, unknown>>({
  title,
  toolbar,
  onSearch,
  searchPlaceholder = 'Buscar…',
  ...tableProps
}: DataTableProps<RecordType>) {
  const { token } = theme.useToken();
  const hasToolbar = title || toolbar || onSearch;

  return (
    <div>
      {hasToolbar && (
        <Flex
          align="center"
          justify="space-between"
          gap="middle"
          wrap="wrap"
          style={{ marginBottom: token.margin }}
        >
          {title ? (
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
          ) : (
            <span />
          )}
          <Flex align="center" gap="small" wrap="wrap">
            {onSearch && (
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                style={{ width: 240, maxWidth: '100%' }}
              />
            )}
            {toolbar}
          </Flex>
        </Flex>
      )}
      <Table<RecordType> {...tableProps} />
    </div>
  );
}
