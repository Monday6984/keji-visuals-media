import * as migration_20261023_144502_initial from './20261023_144502_initial';
import * as migration_20261023_222255_content_model from './20261023_222255_content_model';
import * as migration_20261023_222300_seed_content from './20261023_222300_seed_content';
import * as migration_20261024_194037_rate_limits from './20261024_194037_rate_limits';
import * as migration_20261024_201001_media_mobile_size from './20261024_201001_media_mobile_size';
import * as migration_20261115_193306_about_drop_headline_bio from './20261115_193306_about_drop_headline_bio';
import * as migration_20261115_193456_about_page from './20261115_193456_about_page';
import * as migration_20261115_210729_about_hero_drop_old from './20261115_210729_about_hero_drop_old';
import * as migration_20261115_210754_about_hero_b from './20261115_210754_about_hero_b';

export const migrations = [
  {
    up: migration_20261023_144502_initial.up,
    down: migration_20261023_144502_initial.down,
    name: '20261023_144502_initial',
  },
  {
    up: migration_20261023_222255_content_model.up,
    down: migration_20261023_222255_content_model.down,
    name: '20261023_222255_content_model',
  },
  {
    up: migration_20261023_222300_seed_content.up,
    down: migration_20261023_222300_seed_content.down,
    name: '20261023_222300_seed_content',
  },
  {
    up: migration_20261024_194037_rate_limits.up,
    down: migration_20261024_194037_rate_limits.down,
    name: '20261024_194037_rate_limits',
  },
  {
    up: migration_20261024_201001_media_mobile_size.up,
    down: migration_20261024_201001_media_mobile_size.down,
    name: '20261024_201001_media_mobile_size',
  },
  {
    up: migration_20261115_193306_about_drop_headline_bio.up,
    down: migration_20261115_193306_about_drop_headline_bio.down,
    name: '20261115_193306_about_drop_headline_bio',
  },
  {
    up: migration_20261115_193456_about_page.up,
    down: migration_20261115_193456_about_page.down,
    name: '20261115_193456_about_page',
  },
  {
    up: migration_20261115_210729_about_hero_drop_old.up,
    down: migration_20261115_210729_about_hero_drop_old.down,
    name: '20261115_210729_about_hero_drop_old',
  },
  {
    up: migration_20261115_210754_about_hero_b.up,
    down: migration_20261115_210754_about_hero_b.down,
    name: '20261115_210754_about_hero_b'
  },
];
