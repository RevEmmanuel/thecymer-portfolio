export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  /** Optional override; defaults to a frame from the Google Drive video. */
  thumbnail?: string;
  videoUrl: string;
}

/** Cover image for a project: explicit override, else Google Drive's auto-generated video frame. */
export function getThumbnail(p: Project, width = 800): string {
  if (p.thumbnail) return p.thumbnail;
  const id = p.videoUrl.match(/\/file\/d\/([^/]+)/)?.[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w${width}` : "";
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Fashion Shoot 01",
    client: "Freelance",
    category: "Fashion Shoots",
    videoUrl: "https://drive.google.com/file/d/1S8_65ujyOUTW9DQmxvuzKbazeoA3tP7s/preview"
  },
  {
    id: "2",
    title: "Event Coverage",
    client: "Freelance",
    category: "Events",
    videoUrl: "https://drive.google.com/file/d/17VkhgOZcsmQ--u3WuHhcvHPqrtkMJa6P/preview"
  },
  {
    id: "3",
    title: "BTS 01",
    client: "Freelance",
    category: "BTS",
    videoUrl: "https://drive.google.com/file/d/1QOHZ1gYuyJUxh2g1iAXJYsqKgKTGVNQV/preview"
  },
  {
    id: "7",
    title: "BTS 02",
    client: "Freelance",
    category: "BTS",
    videoUrl: "https://drive.google.com/file/d/1NV9rieIeKHQ4OUBTk9b2PRgVOks-pAYA/preview"
  },
  {
    id: "8",
    title: "BTS 03",
    client: "Freelance",
    category: "BTS",
    videoUrl: "https://drive.google.com/file/d/1GxqfmzvMlsLixg0OCrJhCvHUYWocHrdO/preview"
  },
  {
    id: "4",
    title: "Birthday Shoot 01",
    client: "Freelance",
    category: "Birthday Shoots",
    videoUrl: "https://drive.google.com/file/d/1AeiTeeG_yxQaVQM-AN1SjvuDYaTHW08g/preview"
  },
  {
    id: "9",
    title: "Birthday Shoot 02",
    client: "Freelance",
    category: "Birthday Shoots",
    videoUrl: "https://drive.google.com/file/d/1PorQHpAO4Fg2-ZAav65C9vMpldBUPbpK/preview"
  },
  {
    id: "10",
    title: "Birthday Shoot 03",
    client: "Freelance",
    category: "Birthday Shoots",
    videoUrl: "https://drive.google.com/file/d/10OYtIyqpqb885e4aL2X1-wrW1gDvsQhj/preview"
  },
  {
    id: "11",
    title: "Birthday Shoot 04",
    client: "Freelance",
    category: "Birthday Shoots",
    videoUrl: "https://drive.google.com/file/d/1kcjUx4cWOKBQ2LXGMnP2pIBQEKLfBXP-/preview"
  },
  {
    id: "5",
    title: "Fashion Shoot 02",
    client: "Freelance",
    category: "Fashion Shoots",
    videoUrl: "https://drive.google.com/file/d/1Yh99lrqfjpYkFTOj4EItVb2e5zR1f5Pq/preview"
  },
  {
    id: "12",
    title: "Fashion Shoot 03",
    client: "Freelance",
    category: "Fashion Shoots",
    videoUrl: "https://drive.google.com/file/d/1AfaFGI6CnNGuLZr9EU_jyfv6a71pVIi3/preview"
  },
  {
    id: "13",
    title: "Fashion Shoot 04",
    client: "Freelance",
    category: "Fashion Shoots",
    videoUrl: "https://drive.google.com/file/d/1oR7_2hm5_IkMl5mF6sZiXpVspiTBC5EU/preview"
  },
  {
    id: "14",
    title: "Fashion Shoot 05",
    client: "Freelance",
    category: "Fashion Shoots",
    videoUrl: "https://drive.google.com/file/d/1WLV46O787FLI-h3_P3zoZHGAx9L0QPE9/preview"
  },
  {
    id: "15",
    title: "Event Coverage 02",
    client: "Freelance",
    category: "Events",
    thumbnail: "/thumbnails/event-coverage-02.jpg",
    videoUrl: "https://drive.google.com/file/d/1h1Qa8tHsJVhpoUSFgVCM9FhbN6KGcd0-/preview"
  },
  {
    id: "16",
    title: "Event Coverage 03",
    client: "Freelance",
    category: "Events",
    videoUrl: "https://drive.google.com/file/d/1aiQS5tjkWLnGK_vAi8t_IZ-gl9YKxx2N/preview"
  },
  {
    id: "17",
    title: "Event Coverage 04",
    client: "Freelance",
    category: "Events",
    videoUrl: "https://drive.google.com/file/d/1P-VyyeYKjY-QUJg7_bzwRqye5ectvpX7/preview"
  },
  {
    id: "18",
    title: "Content Video 01",
    client: "Freelance",
    category: "Content Videos",
    videoUrl: "https://drive.google.com/file/d/1L59OYYhuqE5i1qeHwQ3XX7b0HogdtLqF/preview"
  },
];
