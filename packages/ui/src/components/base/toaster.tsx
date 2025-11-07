"use client"

import { useToast } from "@repo/ui/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { X, CheckCircle, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-[420px] min-w-[320px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-in slide-in-from-bottom-3 fade-in duration-200"
        >
          <Alert
            variant={t.variant || "default"}
            className="shadow-xl border-2 backdrop-blur-sm transition-all hover:shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {t.variant === "destructive" ? (
                  <div className="rounded-full bg-destructive/10 p-1.5">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                ) : (
                  <div className="rounded-full bg-green-500/10 p-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {t.title && (
                  <AlertTitle className="font-semibold text-sm mb-1 leading-tight">
                    {t.title}
                  </AlertTitle>
                )}
                {t.description && (
                  <AlertDescription className="text-sm leading-relaxed">
                    {t.description}
                  </AlertDescription>
                )}
              </div>

              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-md p-1 opacity-60 ring-offset-background transition-all hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </Alert>
        </div>
      ))}
    </div>
  )
}
