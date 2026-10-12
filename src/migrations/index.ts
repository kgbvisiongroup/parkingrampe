import * as migration_20261012_143841_initial from './20261012_143841_initial';

export const migrations = [
  {
    up: migration_20261012_143841_initial.up,
    down: migration_20261012_143841_initial.down,
    name: '20261012_143841_initial'
  },
];
