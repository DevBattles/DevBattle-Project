import { buildPaginationMeta, getOffset, sanitizeSortColumn } from '../../src/utils/pagination';

describe('pagination utils', () => {
  it('computes offsets', () => {
    expect(getOffset(1, 20)).toBe(0);
    expect(getOffset(3, 10)).toBe(20);
  });

  it('builds pagination metadata', () => {
    const meta = buildPaginationMeta(95, 3, 20);
    expect(meta).toEqual({
      page: 3,
      limit: 20,
      total: 95,
      totalPages: 5,
      hasNext: true,
      hasPrev: true,
    });

    const first = buildPaginationMeta(10, 1, 20);
    expect(first.hasPrev).toBe(false);
    expect(first.hasNext).toBe(false);

    const last = buildPaginationMeta(95, 5, 20);
    expect(last.hasNext).toBe(false);
  });

  it('never reports zero pages', () => {
    expect(buildPaginationMeta(0, 1, 20).totalPages).toBe(1);
  });

  it('sanitizes sort columns against an allow-list', () => {
    const allowed = ['title', 'createdAt'];
    expect(sanitizeSortColumn('title', allowed, 'createdAt')).toBe('title');
    expect(sanitizeSortColumn('id; DROP TABLE', allowed, 'createdAt')).toBe('createdAt');
    expect(sanitizeSortColumn(undefined, allowed, 'createdAt')).toBe('createdAt');
  });
});
