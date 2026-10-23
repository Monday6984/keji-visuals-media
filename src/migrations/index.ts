import * as migration_20261023_144502_initial from './20261023_144502_initial';

export const migrations = [
  {
    up: migration_20261023_144502_initial.up,
    down: migration_20261023_144502_initial.down,
    name: '20261023_144502_initial'
  },
];
