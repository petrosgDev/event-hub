import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-white/20 dark:border-white/10 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap backdrop-blur-md transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm [a]:hover:bg-primary/90",
        secondary:
          "bg-white/60 dark:bg-white/10 text-secondary-foreground [a]:hover:bg-white/80 dark:[a]:hover:bg-white/20 shadow-sm",
        destructive:
          "bg-destructive/20 text-destructive border-destructive/30 focus-visible:ring-destructive/20 dark:bg-destructive/30 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/30",
        outline:
          "border-white/30 dark:border-white/15 bg-white/40 dark:bg-white/[0.04] text-foreground [a]:hover:bg-white/60 [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-white/40 hover:text-foreground dark:hover:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
