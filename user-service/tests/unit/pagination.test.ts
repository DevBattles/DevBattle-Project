import { buildPaginationMeta, getOffset, sanitizeSortColumn } from '../../src/utils/pagination';

describe('pagination utils', () => {
  it('computes offset', () => {
    expect(getOffset(1, 20)).toBe(0);
    expect(getOffset(3, 20)).toBe(40);
  });

  it('builds pagination meta', () => {
    const meta = buildPaginationMeta(45, 2, 20);
    expect(meta.total).toBe(45);
    expect(meta.totalPages).toBe(3);
    expect(meta.hasNext).toBe(true);
    expect(meta.hasPrev).toBe(true);
  });

  it('clamps totalPages to at least 1', () => {
    const meta = buildPaginationMeta(0, 1, 20);
    expect(meta.totalPages).toBe(1);
    expect(meta.hasNext).toBe(false);
  });

  it('sanitizes sort columns against allow-list', () => {
    expect(sanitizeSortColumn('email', ['email', 'createdAt'], 'createdAt')).toBe('email');
    expect(sanitizeSortColumn('drop table', ['email', 'createdAt'], 'createdAt')).toBe('createdAt');
  });
});
