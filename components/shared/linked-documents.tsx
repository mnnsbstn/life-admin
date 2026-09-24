import Link from "next/link";
import type { Document } from "@/lib/domain/types/document";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateDE, labelFromEnum } from "@/lib/utils/format";
import { FileText } from "lucide-react";

export function LinkedDocuments({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Documents</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">No linked documents.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((doc) => (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            className="flex items-center gap-3 rounded-md border border-border/50 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
          >
            <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{doc.title}</p>
              <p className="text-xs text-muted-foreground">
                {labelFromEnum(doc.type)}
                {doc.issuedAt ? ` · ${formatDateDE(doc.issuedAt)}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
