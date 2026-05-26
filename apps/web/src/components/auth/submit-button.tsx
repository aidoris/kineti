import { CircleNotchIcon } from "@phosphor-icons/react"
import { Button } from "@aidoris/kineti-ui/components/button"

type SubmitButtonProps = {
  isPending: boolean
  label: string
  pendingLabel: string
}

export const SubmitButton = ({
  isPending,
  label,
  pendingLabel,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full gap-2"
      size="lg"
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? (
        <>
          <CircleNotchIcon className="size-4 animate-spin" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  )
}
