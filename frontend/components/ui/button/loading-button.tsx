import { Loader2 } from "lucide-react"

import { Button, ButtonProps } from "@/components/ui/button/button"

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
}

export function LoadingButton(props: LoadingButtonProps) {
  const { loading, disabled, children, ...rest } = props
  return (
    <Button {...rest} disabled={loading || disabled}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
