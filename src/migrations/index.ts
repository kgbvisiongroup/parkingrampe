import * as migration_20261012_143841_initial from './20261012_143841_initial';
import * as migration_20261012_194417_home_key_layout from './20261012_194417_home_key_layout';
import * as migration_20261012_201751_portfolio_galerija from './20261012_201751_portfolio_galerija';
import * as migration_20261012_210000_bez_mup_licence from './20261012_210000_bez_mup_licence';
import * as migration_20261013_170000_pocetna_klijenti from './20261013_170000_pocetna_klijenti';
import * as migration_20261125_213505_seo_polja from './20261125_213505_seo_polja';
import * as migration_20261125_213749_kljucne_reci from './20261125_213749_kljucne_reci';
import * as migration_20261125_220703_gradovi from './20261125_220703_gradovi';
import * as migration_20261125_221304_lokalni_podaci from './20261125_221304_lokalni_podaci';

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
    name: '20261012_210000_bez_mup_licence',
  },
  {
    up: migration_20261013_170000_pocetna_klijenti.up,
    down: migration_20261013_170000_pocetna_klijenti.down,
    name: '20261013_170000_pocetna_klijenti',
  },
  {
    up: migration_20261125_213505_seo_polja.up,
    down: migration_20261125_213505_seo_polja.down,
    name: '20261125_213505_seo_polja',
  },
  {
    up: migration_20261125_213749_kljucne_reci.up,
    down: migration_20261125_213749_kljucne_reci.down,
    name: '20261125_213749_kljucne_reci',
  },
  {
    up: migration_20261125_220703_gradovi.up,
    down: migration_20261125_220703_gradovi.down,
    name: '20261125_220703_gradovi',
  },
  {
    up: migration_20261125_221304_lokalni_podaci.up,
    down: migration_20261125_221304_lokalni_podaci.down,
    name: '20261125_221304_lokalni_podaci'
  },
];
