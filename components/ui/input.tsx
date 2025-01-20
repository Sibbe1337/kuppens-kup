import React, { forwardRef } from "react"
import cn from "classnames"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input type
   * @default text
   */
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "file"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      aria-invalid={props["aria-invalid"]}
      aria-describedby={props["aria-describedby"]}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input

