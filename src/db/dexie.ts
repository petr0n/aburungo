/**
 * IndexedDB schema, owned by Dexie.
 *
 * Keep this file thin: schema definition only. Any logic that operates on the
 * tables lives in sibling stores (reviewStore.ts, etc.) so individual
 * domains can be tested and mocked without touching the DB instance.
 *
 * Schema migrations: bump the version() number and add a new .stores() call.
 * Never edit an existing version block once it's shipped.
 */
import Dexie, { type EntityTable } from "dexie";
import type { PathProgress, ReviewState } from "@/types";

export class AburunGoDB extends Dexie {
  reviewStates!: EntityTable<ReviewState, "phraseId">;
  pathProgress!: EntityTable<PathProgress, "pathId">;

  constructor() {
    super("aburungo");
    // v1: review state per phrase. Indexes: dueAt for "what's due now" queries.
    this.version(1).stores({
      reviewStates: "phraseId, dueAt",
    });
    // v2: per-path unit progress for the guided daily loop (one row per pathId, e.g. "n5").
    this.version(2).stores({
      reviewStates: "phraseId, dueAt",
      pathProgress: "pathId",
    });
  }
}

export const db = new AburunGoDB();
