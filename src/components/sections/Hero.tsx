import { ArrowDownRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroProps {
  heading: string
  role: string
  description: string
  buttons: {
    primary: {
      text: string
      url: string
      className?: string
    }
    secondary: {
      text: string
      url: string
    }
  }
  imageSrc: string
  imageAlt: string
  className?: string
}

const Hero = ({
  heading,
  role,
  description,
  buttons,
  imageSrc,
  imageAlt,
  className,
}: HeroProps) => {
  return (
    <section className={cn("flex min-h-[calc(100vh-4rem)] items-center", className)}>
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left">
          <h1 className="mt-6 text-4xl font-bold text-pretty lg:text-6xl xl:text-7xl">
            {heading}
          </h1>
          <p className="mt-2 text-lg font-medium text-primary lg:text-xl">
            {role}
          </p>
          <p className="mb-12 mt-6 max-w-xl text-muted-foreground leading-relaxed lg:text-lg">
            {description}
          </p>
          <div className="flex w-full flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button asChild className="w-full sm:w-auto">
              <a href={buttons.primary.url}>{buttons.primary.text}</a>
            </Button>
            <Button asChild variant="outline">
              <a href={buttons.secondary.url}>
                {buttons.secondary.text}
                <ArrowDownRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="flex">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-h-150 w-full rounded-md object-cover lg:max-h-200"
          />
        </div>
      </div>
    </section>
  )
}

export { Hero }
