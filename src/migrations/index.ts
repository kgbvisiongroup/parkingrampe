import * as migration_20261012_143841_initial from './20261012_143841_initial';
import * as migration_20261012_194417_home_key_layout from './20261012_194417_home_key_layout';
import * as migration_20261012_201751_portfolio_galerija from './20261012_201751_portfolio_galerija';
import * as migration_20261012_210000_bez_mup_licence from './20261012_210000_bez_mup_licence';

export const migrations = [
  {
    up: migration_20261012_143841_initial.up,
    down: migration_20261012_143841_initial.down,
    name: '20261012_143841_initial',
  },
  {
    up: migration_20261012_194417_home_key_layout.up,
    down: migration_20261012_194417_home_key_layout.down,
    name: '20261012_194417_home_key_layout',
  },
  {
    up: migration_20261012_201751_portfolio_galerija.up,
    down: migration_20261012_201751_portfolio_galerija.down,
    name: '20261012_201751_portfolio_galerija',
  },
  {
    up: migration_20261012_210000_bez_mup_licence.up,
    down: migration_20261012_210000_bez_mup_licence.down,
    name: '20261012_210000_bez_mup_licence'
  },
];
