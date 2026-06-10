import type { SvgComponent } from "astro/types"
import ArrowLeftIcon from "lucide-static/icons/arrow-left.svg"
import FileTextIcon from "lucide-static/icons/file-text.svg"
import CheckIcon from "lucide-static/icons/check.svg"
import CloseIcon from "lucide-static/icons/x.svg"
import LoaderCircleIcon from "lucide-static/icons/loader-circle.svg"
import ChevronRightIcon from "lucide-static/icons/chevron-right.svg"
import ChevronLeftIcon from "lucide-static/icons/chevron-left.svg"
import PanelLeftIcon from "lucide-static/icons/panel-left.svg"
import EllipsisIcon from "lucide-static/icons/ellipsis.svg"
import MailIcon from "lucide-static/icons/mail.svg"
import PhoneIcon from "lucide-static/icons/phone.svg"
import MapPinIcon from "lucide-static/icons/map-pin.svg"
import GithubBrandIcon from "simple-icons/icons/github.svg"
import FacebookBrandIcon from "simple-icons/icons/facebook.svg"
import InstagramBrandIcon from "simple-icons/icons/instagram.svg"
import PinterestBrandIcon from "simple-icons/icons/pinterest.svg"
import YouTubeBrandIcon from "simple-icons/icons/youtube.svg"
import TikTokBrandIcon from "simple-icons/icons/tiktok.svg"
import SnapchatBrandIcon from "simple-icons/icons/snapchat.svg"
import RedditBrandIcon from "simple-icons/icons/reddit.svg"
import TumblrBrandIcon from "simple-icons/icons/tumblr.svg"
import WhatsAppBrandIcon from "simple-icons/icons/whatsapp.svg"
import TelegramBrandIcon from "simple-icons/icons/telegram.svg"
import DiscordBrandIcon from "simple-icons/icons/discord.svg"
import VimeoBrandIcon from "simple-icons/icons/vimeo.svg"
import FlickrBrandIcon from "simple-icons/icons/flickr.svg"
import YelpBrandIcon from "simple-icons/icons/yelp.svg"
import SpotifyBrandIcon from "simple-icons/icons/spotify.svg"
import BehanceBrandIcon from "simple-icons/icons/behance.svg"
import DribbbleBrandIcon from "simple-icons/icons/dribbble.svg"
import SoundCloudBrandIcon from "simple-icons/icons/soundcloud.svg"
import TwitchBrandIcon from "simple-icons/icons/twitch.svg"
import RssBrandIcon from "simple-icons/icons/rss.svg"
import XBrandIcon from "simple-icons/icons/x.svg"
import { LinkedInIcon } from "@/components/icon"

type IconComponent = SvgComponent | typeof LinkedInIcon

export const iconRegistry = {
  "arrow-left": ArrowLeftIcon,
  "file-text": FileTextIcon,
  check: CheckIcon,
  x: CloseIcon,
  "loader-circle": LoaderCircleIcon,
  "chevron-right": ChevronRightIcon,
  "chevron-left": ChevronLeftIcon,
  "panel-left": PanelLeftIcon,
  ellipsis: EllipsisIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  "map-pin": MapPinIcon,
  github: GithubBrandIcon,
  rss: RssBrandIcon,
  xBrand: XBrandIcon,
  linkedin: LinkedInIcon,
  twitter: XBrandIcon,
  facebook: FacebookBrandIcon,
  instagram: InstagramBrandIcon,
  pinterest: PinterestBrandIcon,
  youtube: YouTubeBrandIcon,
  tiktok: TikTokBrandIcon,
  snapchat: SnapchatBrandIcon,
  reddit: RedditBrandIcon,
  tumblr: TumblrBrandIcon,
  whatsapp: WhatsAppBrandIcon,
  telegram: TelegramBrandIcon,
  discord: DiscordBrandIcon,
  vimeo: VimeoBrandIcon,
  flickr: FlickrBrandIcon,
  yelp: YelpBrandIcon,
  spotify: SpotifyBrandIcon,
  behance: BehanceBrandIcon,
  dribbble: DribbbleBrandIcon,
  soundcloud: SoundCloudBrandIcon,
  twitch: TwitchBrandIcon,
} as const satisfies Record<string, IconComponent>

type IconKey = keyof typeof iconRegistry

const hrefMap = {
  "x.com": "xBrand",
  twitter: "twitter",
  facebook: "facebook",
  instagram: "instagram",
  pinterest: "pinterest",
  youtube: "youtube",
  tiktok: "tiktok",
  snapchat: "snapchat",
  reddit: "reddit",
  tumblr: "tumblr",
  "wa.me": "whatsapp",
  telegram: "telegram",
  discord: "discord",
  vimeo: "vimeo",
  flickr: "flickr",
  yelp: "yelp",
  spotify: "spotify",
  behance: "behance",
  dribbble: "dribbble",
  soundcloud: "soundcloud",
  github: "github",
  twitch: "twitch",
  "tel:": "phone",
  "mailto:": "mail",
  "maps.app.goo.gl": "map-pin",
  linkedin: "linkedin",
} as const

const iconSources = iconRegistry satisfies Record<IconKey, IconComponent>

function isIconKey(value: string): value is IconKey {
  return value in iconSources
}

export function resolveIcon(
  name?: string | number | null,
  href?: string
): IconComponent | undefined {
  if (name === "x.com") {
    return iconRegistry.xBrand as IconComponent
  }

  if (typeof name === "string" && isIconKey(name)) {
    return iconSources[name]
  }

  if (typeof name === "number") {
    const icon = iconSources[String(name) as IconKey]
    return icon
  }

  if (!href) return undefined

  const hrefKey = Object.keys(hrefMap).find((key) => href.includes(key))
  if (!hrefKey) return undefined

  const resolved = hrefMap[hrefKey as keyof typeof hrefMap]
  if (!isIconKey(resolved)) return undefined

  return iconSources[resolved]
}
