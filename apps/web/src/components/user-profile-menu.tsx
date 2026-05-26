import { CaretDownIcon, SignOutIcon } from "@phosphor-icons/react"
import { Button } from "@aidoris/kineti-ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@aidoris/kineti-ui/components/dropdown-menu"
import { cn } from "@aidoris/kineti-ui/lib/utils"
import { root } from "@/i18n/root"

type UserProfileMenuProps = {
  name: string | null | undefined
  email: string
  image?: string | null
  onSignOut: () => void | Promise<void>
  align?: "start" | "center" | "end"
  className?: string
}

const getInitials = (name: string | null | undefined, email: string) => {
  const source = name?.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase()
}

const getDisplayName = (name: string | null | undefined, email: string) =>
  name?.trim() || email.split("@")[0] || email

export const UserProfileMenu = ({
  name,
  email,
  image,
  onSignOut,
  align = "end",
  className,
}: UserProfileMenuProps) => {
  const displayName = getDisplayName(name, email)
  const initials = getInitials(name, email)

  const handleSignOut = () => {
    void onSignOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-10 max-w-[min(100%,12rem)] gap-2 px-1.5 sm:px-2.5",
              className
            )}
            aria-label={root.profile.menuLabel()}
          />
        }
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary"
          aria-hidden
        >
          {image ? (
            <img
              src={image}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </span>
        <span className="hidden min-w-0 truncate sm:inline">{displayName}</span>
        <CaretDownIcon
          className="size-3.5 shrink-0 opacity-60"
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className="w-[min(calc(100vw-2rem),16rem)] p-1.5 sm:min-w-48"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2.5 py-2 text-sm font-medium text-foreground">
            <span className="block truncate">{displayName}</span>
            <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
              {email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="min-h-10 gap-2.5 px-2.5 text-sm"
          onClick={handleSignOut}
        >
          <SignOutIcon className="size-4" aria-hidden />
          {root.nav.signOut()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
