import { index } from "@/i18n/index"

export const LandingSkeleton = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <p className="text-sm text-muted-foreground">{index.loading()}</p>
    </div>
  )
}
