#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7dfe11495f0679c95599b8015bbf7c1995a5df234491c385a70315542c9269f9/contract';
import endContract from '../../snapshots/7dfe11495f0679c95599b8015bbf7c1995a5df234491c385a70315542c9269f9/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/db0130dd5f0c81b81ddec8dbba42c1562c7bd3c54fbb645bef8b0c83ef90ca7c/contract';
import startContract from '../../snapshots/db0130dd5f0c81b81ddec8dbba42c1562c7bd3c54fbb645bef8b0c83ef90ca7c/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.setDefault({
        schema: 'public',
        table: 'submissions',
        column: 'status',
        defaultSql: "DEFAULT 'Processing'",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
