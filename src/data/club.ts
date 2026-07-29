export const CLUB = {
  name: "Hull Speakers",
  tagline: "",
  email: "contact@hullspeakers.org",
  phone: "+44 1482 000 000",
  venue: "Holiday Inn Express, 80 Ferensway Hull, HU2 8LN,\u00a0 United Kingdom",
  when: "Every 2nd and 4th Tuesday, 7:00 pm to 9:00 pm",
};

export interface Meeting {
  id: string;
  date: string; // ISO date
  title: string;
  time: string;
  theme: string;
  format: "In person" | "Hybrid" | "Online";
  spaces: number;
}

export const MEETINGS: Meeting[] = [
  {
    id: "2026-08-05",
    date: "2026-08-05",
    title: "Regular club meeting",
    time: "7:00pm – 9:00pm",
    theme: "Speak up, stand out",
    format: "In person",
    spaces: 10,
  },
  {
    id: "2026-08-19",
    date: "2026-08-19",
    title: "Humorous speech contest heats",
    time: "7:00pm – 9:15pm",
    theme: "Make them laugh, make them listen",
    format: "In person",
    spaces: 5,
  },
  {
    id: "2026-09-02",
    date: "2026-09-02",
    title: "Regular club meeting",
    time: "7:00pm – 9:00pm",
    theme: "Impromptu speaking masterclass",
    format: "Hybrid",
    spaces: 12,
  },
  {
    id: "2026-09-16",
    date: "2026-09-16",
    title: "Open evening for guests",
    time: "6:45pm – 9:00pm",
    theme: "Bring a friend, try Table Topics",
    format: "In person",
    spaces: 20,
  },
  {
    id: "2026-10-07",
    date: "2026-10-07",
    title: "Pathways workshop",
    time: "7:00pm – 9:00pm",
    theme: "Choose your learning path",
    format: "Online",
    spaces: 30,
  },
];

export interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  readingTime: string;
  body: string[];
}

export const POSTS: Post[] = [
  {
    slug: "first-visit-what-to-expect",
    title: "Your first visit to Hull Speakers: what to expect",
    date: "2026-07-14",
    author: "Priya Nair",
    readingTime: "4 min read",
    excerpt:
      "Nervous about walking through the door? Here is exactly how a club evening runs, from the welcome desk to the closing round of applause.",
    body: [
      "Guests are welcome at every Hull Speakers meeting, and you never have to speak on your first night. A member meets you at the door, introduces you to a few people and finds you a seat with a good view of the lectern.",
      "A meeting has three parts. Prepared speeches come first: members deliver projects from the Toastmasters Pathways learning programme, usually five to seven minutes each. Table Topics follows, a fast round of one-to-two minute impromptu answers. Finally, evaluators give warm, specific feedback on everything they heard.",
      "The evening ends around 9pm and most of us head for a drink nearby. Bring nothing but curiosity — and if you would like to try Table Topics, just tell the Topicsmaster before we start.",
    ],
  },
  {
    slug: "beating-speaking-nerves",
    title: "Five practical ways to steady your speaking nerves",
    date: "2026-06-23",
    author: "Daniel Okafor",
    readingTime: "5 min read",
    excerpt:
      "Nerves never disappear completely — and they should not. Here is how our members turn adrenaline into energy the audience can feel.",
    body: [
      "Rehearse out loud, standing up, at least three times. Reading silently trains your eyes, not your voice.",
      "Arrive early and speak to people before you speak at people. A room of acquaintances is far easier than a room of strangers.",
      "Breathe low and slow for one minute before you stand. Four counts in, six counts out, repeated ten times, measurably lowers heart rate.",
      "Anchor your first thirty seconds word for word. Once the opening lands, the rest tends to follow.",
      "Book yourself in again quickly. Confidence compounds when the gap between speeches is short.",
    ],
  },
  {
    slug: "pathways-explained",
    title: "Toastmasters Pathways, explained simply",
    date: "2026-05-30",
    author: "Committee",
    readingTime: "3 min read",
    excerpt:
      "Eleven learning paths, one flexible programme. Here is how members at our Hull club choose where to start.",
    body: [
      "Pathways is the Toastmasters education programme. You pick a path — such as Dynamic Leadership or Presentation Mastery — and work through projects at your own pace.",
      "Each project pairs a short online module with a live speech at a club meeting, so learning is always tested in front of a real audience.",
      "New members complete an assessment that suggests a path, but the choice is always yours, and you can add further paths later.",
    ],
  },
];
