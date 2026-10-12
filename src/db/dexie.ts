/**
 * IndexedDB schema, owned by Dexie.
 *
 * Keep this file thin: schema definition only. Any logic that operates on the
 * tables lives in sibling stores (reviewStore.ts, etc.) so individual
 * domains can be tested and mocked without touching the DB instance.
 *
 * Schema migrations: bump the version() number and add a new .stores() call.
 * Never edit an existing version block once it's shipped.
 *
 * DR-036: one database per owner -- `aburungo:guest`, `aburungo:<user id>` --
 * so no read or write can reach another owner's records by accident. The
 * pre-DR-036 shared database, plain `aburungo`, has no owner key and so no
 * evidence of whose it is: it is never opened automatically, only for the
 * explicit recovery in adoption.ts.
 */
import Dexie, { type EntityTable } from "dexie";
import type { Owner, PathProgress, ReviewState } from "@/types";

export class AburunGoDB extends Dexie {
  reviewStates!: EntityTable<ReviewState, "phraseId">;
  pathProgress!: EntityTable<PathProgress, "pathId">;

  constructor(name: string) {
    super(name);
    // v1: review state per phrase. Indexes: dueAt for "what's due now" queries.
    this.version(1).stores({
      reviewStates: "phraseId, dueAt",
    });
    // v2: per-path lesson progress for the guided daily loop (one row per pathId, e.g. "n5").
    this.version(2).stores({
      reviewStates: "phraseId, dueAt",
      pathProgress: "pathId",
    });
  }
}

const LEGACY_DB_NAME = "aburungo";
const byOwner = new Map<Owner, AburunGoDB>();

/** The owner's own database. The owner is always explicit -- never "whoever is signed in". */
export function dbFor(owner: Owner): AburunGoDB {
  let db = byOwner.get(owner);
  if (db === undefined) {
    db = new AburunGoDB(`aburungo:${owner}`);
    byOwner.set(owner, db);
  }
  return db;
}

let legacy: AburunGoDB | null = null;

/** The pre-DR-036 shared database, or null if this browser never had one. Opening it never creates it. */
export async function legacyDb(): Promise<AburunGoDB | null> {
  if (legacy === null && (await Dexie.exists(LEGACY_DB_NAME))) legacy = new AburunGoDB(LEGACY_DB_NAME);
  return legacy;
}
