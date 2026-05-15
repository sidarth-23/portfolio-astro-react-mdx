import { HugeiconsIcon } from "@hugeicons/react"
import {
  Briefcase01Icon,
  Award03Icon,
  Layers01Icon,
  UserSquareIcon,
} from "@hugeicons/core-free-icons"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SkillIcon } from "@/components/icons/skill-icons"
import avatarImage from "@/assets/images/avatar.jpg"
import type { CollectionEntry } from "astro:content"

type CvEntry = CollectionEntry<"cv">

export function CvContent({ data }: { data: CvEntry["data"] }) {
  return (
    <div className="space-y-14">
      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-4">
            <img
              src={avatarImage.src}
              alt={data.profile.name}
              className="size-14 rounded-full object-cover ring-1 ring-border md:size-16"
              loading="eager"
              decoding="async"
            />
            <div>
              <CardTitle className="text-2xl md:text-3xl">
                {data.profile.name}
              </CardTitle>
              <CardDescription className="text-base">
                {data.profile.role}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="max-w-3xl text-sm leading-6 md:text-base">
            {data.profile.summary}
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            {data.profile.focus.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <HugeiconsIcon icon={Briefcase01Icon} size={20} strokeWidth={2} />
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Experience
          </h2>
        </div>

        <Timeline defaultValue={data.experience.length} className="w-full">
          {data.experience.map((item) => (
            <TimelineItem
              key={item.id}
              step={item.id}
              className="group-data-[orientation=vertical]/timeline:ms-10"
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineTitle className="mt-0.5 text-base font-semibold">
                  {item.role}
                </TimelineTitle>
                <TimelineIndicator className="flex size-6 items-center justify-center border-none bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground group-data-[orientation=vertical]/timeline:-left-7">
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    size={14}
                    strokeWidth={2}
                  />
                </TimelineIndicator>
              </TimelineHeader>

              <TimelineContent>
                <p className="text-sm font-medium text-foreground">
                  {item.company} · {item.location}
                </p>
                <TimelineDate className="mt-1 mb-3">{item.period}</TimelineDate>
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {item.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <HugeiconsIcon icon={Layers01Icon} size={20} strokeWidth={2} />
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Technologies & Skills
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {data.skills.map((group) => (
            <Card key={group.title} size="sm" className="h-full">
              <CardHeader>
                <CardTitle>{group.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <Badge
                    key={skill.label}
                    variant="outline"
                    className="gap-1.5"
                  >
                    <SkillIcon icon={skill.icon} />
                    {skill.label}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <HugeiconsIcon icon={Award03Icon} size={20} strokeWidth={2} />
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Certifications
          </h2>
        </div>
        <Card size="sm">
          <CardContent className="pt-1">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.certifications.map((cert) => (
                <li key={cert} className="flex items-start gap-2">
                  <HugeiconsIcon
                    icon={UserSquareIcon}
                    size={14}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0"
                  />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
