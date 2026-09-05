#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/db0130dd5f0c81b81ddec8dbba42c1562c7bd3c54fbb645bef8b0c83ef90ca7c/contract';
import endContract from '../../snapshots/db0130dd5f0c81b81ddec8dbba42c1562c7bd3c54fbb645bef8b0c83ef90ca7c/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'submissions',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('language', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('output', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'submissions_status_check_527a4465',
            "\"status\" IN ('Processing', 'Succus', 'Fail')",
          ),
        ],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
