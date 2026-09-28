import { Compass } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-canvas px-6">
      <Logo />
      <EmptyState
        icon={Compass}
        title="This route does not exist"
        description="The page you requested is not part of the RAGLab workspace. It may have moved, or it belongs to a later phase."
        actions={
          <Button variant="primary" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        }
        className="max-w-md"
      />
    </main>
  );
}
