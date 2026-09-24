import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  mapDocumentRow,
  mapDocumentToRow,
} from "@/lib/repositories/supabase/mappers/document";

describe("document mapper", () => {
  it("maps storage fields and contract link", () => {
    const row = {
      id: "d1",
      household_id: "h1",
      title: "Versicherung",
      document_type: "insurance" as const,
      issued_at: "2026-01-15",
      storage_path: "h1/d1/policy.pdf",
      mime_type: "application/pdf",
      mock_file_name: "policy.pdf",
      mock_file_size_bytes: 2048,
      link_type: "contract" as const,
      link_target_id: "c1",
      notes: "Scan",
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    const domain = mapDocumentRow(row);
    assert.equal(domain.storagePath, "h1/d1/policy.pdf");
    assert.equal(domain.link.type, "contract");
    assert.equal(domain.mockFileSizeBytes, 2048);

    const back = mapDocumentToRow(domain);
    assert.equal(back.storage_path, "h1/d1/policy.pdf");
    assert.equal(back.link_type, "contract");
    assert.equal(back.link_target_id, "c1");
  });

  it("maps no link", () => {
    const row = {
      id: "d2",
      household_id: "h1",
      title: "Sonstiges",
      document_type: "other" as const,
      issued_at: null,
      storage_path: null,
      mime_type: null,
      mock_file_name: "demo.pdf",
      mock_file_size_bytes: 100,
      link_type: "none" as const,
      link_target_id: null,
      notes: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
    };

    const domain = mapDocumentRow(row);
    assert.equal(domain.link.type, "none");
    assert.equal(domain.storagePath, undefined);

    const back = mapDocumentToRow(domain);
    assert.equal(back.link_type, "none");
    assert.equal(back.link_target_id, null);
  });
});
