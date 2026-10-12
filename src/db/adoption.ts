/**
 * Moving progress between owners, only ever on the learner's explicit choice (DR-036).
 *
 * Two sources can be offered:
 * - "guest": what this browser practised signed out. Offered to an account
 *   once; brought in, it moves to that account and leaves the guest.
 * - "legacy": the pre-DR-036 shared database. Nobody can tell whose it is --
 *   it may mix several people -- so it is never loaded or synced on its own.
 *   Recovery copies it into the chosen owner and leaves the original in place.
 *
 * A guest import records its destination before it starts and retires the
 * guest copy only once everything has landed, so an interrupted import resumes
 * for the same account and is never offered to anyone else meanwhile.
 */
import type { AburunGoDB } from "./dexie";
import { dbFor, legacyDb } from "./dexie";
import { readGuestKana, writeGuestKana } from "./kanaLocal";
import { seenLessonIdsOf } from "./pathProgressStore";
import { submitKanaAnswer } from "@/api/progress";
import type { KanaProgressEntry, Owner } from "@/types";
import { GUEST_OWNER } from "@/types";

export type AdoptionSource = "guest" | "legacy";

/** Destination user id of a guest import that has started and not finished. */
const IMPORT_KEY = "aburungo:guest-import";
const decidedKey = (source: AdoptionSource, owner: Owner) => `aburungo:adoption:${source}:${owner}`;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

async function hasRecords(db: AburunGoDB): Promise<boolean> {
  return (await db.reviewStates.count()) + (await db.pathProgress.count()) > 0;
}

/** What to offer this owner, if anything. Reads only; moves nothing. */
export async function adoptionOffer(owner: Owner): Promise<AdoptionSource | null> {
  if (
    owner !== GUEST_OWNER &&
    read(decidedKey("guest", owner)) === null &&
    read(IMPORT_KEY) === null &&
    (readGuestKana().length > 0 || (await hasRecords(dbFor(GUEST_OWNER))))
  ) {
    return "guest";
  }
  if (read(decidedKey("legacy", owner)) === null) {
    const legacy = await legacyDb();
    if (legacy !== null && (await hasRecords(legacy))) return "legacy";
  }
  return null;
}

/** The learner chose to keep it separate. Nothing moves; this owner is not asked again. */
export function keepSeparate(source: AdoptionSource, owner: Owner): void {
  try {
    localStorage.setItem(decidedKey(source, owner), "kept");
  } catch {
    /* asked again next time */
  }
}

/** The learner chose to bring it in. */
export async function bringIn(source: AdoptionSource, owner: Owner): Promise<void> {
  if (source === "legacy") {
    const legacy = await legacyDb();
    if (legacy !== null) await copyRecords(legacy, dbFor(owner));
    keepSeparate("legacy", owner); // handled: not offered to this owner again
    return;
  }
  localStorage.setItem(IMPORT_KEY, owner);
  await finishGuestImport(owner);
}

/** Continue a guest import this owner accepted earlier, if one is unfinished. */
export async function resumeGuestImport(owner: Owner): Promise<void> {
  if (owner !== GUEST_OWNER && read(IMPORT_KEY) === owner) await finishGuestImport(owner);
}

async function finishGuestImport(owner: Owner): Promise<void> {
  const guest = dbFor(GUEST_OWNER);
  await copyRecords(guest, dbFor(owner));
  try {
    await importGuestKana(owner);
  } catch {
    return; // left in place under the guest; resumed on this account's next load
  }
  await guest.reviewStates.clear();
  await guest.pathProgress.clear();
  localStorage.removeItem(IMPORT_KEY);
}

/**
 * Merge one database's records into another, idempotently: the newer review
 * of an item wins, seen lessons are unioned. The account's own server sync
 * then pushes whatever the server lacks, as it does for any local write.
 */
async function copyRecords(from: AburunGoDB, to: AburunGoDB): Promise<void> {
  const [theirStates, myStates] = await Promise.all([from.reviewStates.toArray(), to.reviewStates.toArray()]);
  const mine = new Map(myStates.map((s) => [s.phraseId, s]));
  await to.reviewStates.bulkPut(
    theirStates.filter((s) => {
      const m = mine.get(s.phraseId);
      return m === undefined || (m.lastSeenAt ?? 0) < (s.lastSeenAt ?? 0);
    }),
  );

  const [theirPaths, myPaths] = await Promise.all([from.pathProgress.toArray(), to.pathProgress.toArray()]);
  const myPath = new Map(myPaths.map((p) => [p.pathId, seenLessonIdsOf(p)]));
  await to.pathProgress.bulkPut(
    theirPaths.map((p) => ({
      pathId: p.pathId,
      seenLessonIds: [...new Set([...(myPath.get(p.pathId) ?? []), ...seenLessonIdsOf(p)])],
    })),
  );
}

/**
 * The server only counts kana one answer at a time, so a guest count of 3 is
 * three requests. Each is ticked off the guest copy the moment it lands, so a
 * retry after an interruption sends only what is left.
 *
 * ponytail: one request per counted answer; a bulk kana import route if guest
 * histories ever get large enough for this to be slow.
 */
async function importGuestKana(owner: Owner): Promise<void> {
  const results = await Promise.allSettled(
    readGuestKana().map(async ({ character, script }) => {
      for (const mode of ["recognized", "recalled"] as const) {
        const field = mode === "recognized" ? "recognizedCount" : "recalledCount";
        while ((readGuestKana().find((e) => e.character === character)?.[field] ?? 0) > 0) {
          await submitKanaAnswer(owner, character, script, mode, true);
          writeGuestKana(
            readGuestKana().map((e): KanaProgressEntry => (e.character === character ? { ...e, [field]: e[field] - 1 } : e)),
          );
        }
      }
    }),
  );
  if (results.some((r) => r.status === "rejected")) throw new Error("guest kana import incomplete");
  writeGuestKana([]);
}
