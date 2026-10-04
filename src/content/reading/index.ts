/**
 * Reading-library glossaries (Book Three). One file per story in
 * data/reading/kc-yomyom.json: the words that story uses which Books One to
 * Three do not teach. Not lesson vocabulary -- Book Three's words arrive by
 * mining from the library (docs/plans/book-three-bands.md section 1) -- so
 * nothing here is ever referenced by a lesson.
 */
import type { GateText, GlossaryEntry } from "@/types";
import { parseGates, parseGlossary } from "./schema";
import gatesRaw from "./gates.yaml";

import kcAnataRaw from "./kc-anata.yaml";
import kcAnhsanarbeitwosuruRaw from "./kc-anhsanarbeitwosuru.yaml";
import kcAnhsaninterviewRaw from "./kc-anhsaninterview.yaml";
import kcConcertRaw from "./kc-concert.yaml";
import kcHajimemashiteRaw from "./kc-hajimemashite.yaml";
import kcHijoguchiRaw from "./kc-hijoguchi.yaml";
import kcIdolnoshigotoRaw from "./kc-idolnoshigoto.yaml";
import kcIdolyametaiRaw from "./kc-idolyametai.yaml";
import kcIwawakisanRaw from "./kc-iwawakisan.yaml";
import kcKabochaRaw from "./kc-kabocha.yaml";
import kcKekkonshikiRaw from "./kc-kekkonshiki.yaml";
import kcKisetsuRaw from "./kc-kisetsu.yaml";
import kcKiyohimeRaw from "./kc-kiyohime.yaml";
import kcKongozanRaw from "./kc-kongozan.yaml";
import kcManholeRaw from "./kc-manhole.yaml";
import kcObakeRaw from "./kc-obake.yaml";
import kcOkikusanRaw from "./kc-okikusan.yaml";
import kcRamenRaw from "./kc-ramen.yaml";
import kcSenshuyasaiRaw from "./kc-senshuyasai.yaml";
import kcTaroRaw from "./kc-taro.yaml";
import kcTennojiRaw from "./kc-tennoji.yaml";
import kcToshokanRaw from "./kc-toshokan.yaml";
import kcTsukimiRaw from "./kc-tsukimi.yaml";
import kcTsurinikkiRaw from "./kc-tsurinikki.yaml";
import kcWatashiRaw from "./kc-watashi.yaml";
import kcYadokariRaw from "./kc-yadokari.yaml";

export const allGlossaryEntries: GlossaryEntry[] = [
  ...parseGlossary(kcAnataRaw, "reading/kc-anata.yaml"),
  ...parseGlossary(kcAnhsanarbeitwosuruRaw, "reading/kc-anhsanarbeitwosuru.yaml"),
  ...parseGlossary(kcAnhsaninterviewRaw, "reading/kc-anhsaninterview.yaml"),
  ...parseGlossary(kcConcertRaw, "reading/kc-concert.yaml"),
  ...parseGlossary(kcHajimemashiteRaw, "reading/kc-hajimemashite.yaml"),
  ...parseGlossary(kcHijoguchiRaw, "reading/kc-hijoguchi.yaml"),
  ...parseGlossary(kcIdolnoshigotoRaw, "reading/kc-idolnoshigoto.yaml"),
  ...parseGlossary(kcIdolyametaiRaw, "reading/kc-idolyametai.yaml"),
  ...parseGlossary(kcIwawakisanRaw, "reading/kc-iwawakisan.yaml"),
  ...parseGlossary(kcKabochaRaw, "reading/kc-kabocha.yaml"),
  ...parseGlossary(kcKekkonshikiRaw, "reading/kc-kekkonshiki.yaml"),
  ...parseGlossary(kcKisetsuRaw, "reading/kc-kisetsu.yaml"),
  ...parseGlossary(kcKiyohimeRaw, "reading/kc-kiyohime.yaml"),
  ...parseGlossary(kcKongozanRaw, "reading/kc-kongozan.yaml"),
  ...parseGlossary(kcManholeRaw, "reading/kc-manhole.yaml"),
  ...parseGlossary(kcObakeRaw, "reading/kc-obake.yaml"),
  ...parseGlossary(kcOkikusanRaw, "reading/kc-okikusan.yaml"),
  ...parseGlossary(kcRamenRaw, "reading/kc-ramen.yaml"),
  ...parseGlossary(kcSenshuyasaiRaw, "reading/kc-senshuyasai.yaml"),
  ...parseGlossary(kcTaroRaw, "reading/kc-taro.yaml"),
  ...parseGlossary(kcTennojiRaw, "reading/kc-tennoji.yaml"),
  ...parseGlossary(kcToshokanRaw, "reading/kc-toshokan.yaml"),
  ...parseGlossary(kcTsukimiRaw, "reading/kc-tsukimi.yaml"),
  ...parseGlossary(kcTsurinikkiRaw, "reading/kc-tsurinikki.yaml"),
  ...parseGlossary(kcWatashiRaw, "reading/kc-watashi.yaml"),
  ...parseGlossary(kcYadokariRaw, "reading/kc-yadokari.yaml"),
];

export const bookThreeGates: GateText[] = parseGates(gatesRaw, "reading/gates.yaml");
