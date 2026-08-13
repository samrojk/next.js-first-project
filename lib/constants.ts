export interface EventItem {
  title: string;
  slug: string;
  image: string;
  location: string;
  date: string;
  time: string;
}

export const events: EventItem[] = [
  {
    title: "React Summit 2026",
    slug: "react-summit-2026",
    image: "/images/event1.png",
    location: "Amsterdam, Netherlands",
    date: "2026-10-14",
    time: "09:00",
  },
  {
    title: "JSConf EU 2026",
    slug: "jsconf-eu-2026",
    image: "/images/event2.png",
    location: "Lisbon, Portugal",
    date: "2026-11-05",
    time: "09:30",
  },
  {
    title: "KubeCon + CloudNativeCon",
    slug: "kubecon-cloudnative-2026",
    image: "/images/event3.png",
    location: "Barcelona, Spain",
    date: "2026-10-27",
    time: "10:00",
  },
  {
    title: "PyCon US 2027",
    slug: "pycon-us-2027",
    image: "/images/event4.png",
    location: "Salt Lake City, USA",
    date: "2027-04-21",
    time: "09:00",
  },
  {
    title: "NodeConf EU 2026",
    slug: "nodeconf-eu-2026",
    image: "/images/event5.png",
    location: "Dublin, Ireland",
    date: "2026-09-22",
    time: "09:30",
  },
  {
    title: "HackMIT 2026",
    slug: "hackmit-2026",
    image: "/images/event6.png",
    location: "Cambridge, MA, USA",
    date: "2026-11-14",
    time: "18:00",
  },
  {
    title: "Local Dev Meetup: Cloud & Serverless",
    slug: "local-dev-meetup-cloud-serverless",
    image: "/images/event-full.png",
    location: "Seattle, WA, USA",
    date: "2026-09-12",
    time: "18:30",
  },
];

export default events;
