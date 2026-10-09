// Refreshes src/data/contributions.json from the GitHub GraphQL API.
// Without a token, or if the API fails, the committed snapshot is kept so builds never break.
import { writeFile } from 'node:fs/promises';

const LOGIN = 'FreddieTheObserver';
const OUT = new URL('../src/data/contributions.json', import.meta.url);
const LEVELS = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const token = process.env.GH_CONTRIB_TOKEN;
if (!token) {
  console.log('GH_CONTRIB_TOKEN not set, keeping the committed snapshot.');
  process.exit(0);
}

const query = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

try {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'layaungphyo.dev',
    },
    body: JSON.stringify({ query, variables: { login: LOGIN } }),
  });
  const body = await res.json();
  if (!res.ok || body.errors) throw new Error(JSON.stringify(body.errors ?? body));

  const calendar = body.data.user.contributionsCollection.contributionCalendar;
  const snapshot = {
    login: LOGIN,
    fetchedAt: new Date().toISOString(),
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((w) =>
      w.contributionDays.map((d) => [d.date, d.contributionCount, LEVELS[d.contributionLevel] ?? 0]),
    ),
  };
  await writeFile(OUT, JSON.stringify(snapshot) + '\n');
  console.log(`Wrote ${snapshot.weeks.length} weeks, ${snapshot.total} contributions.`);
} catch (err) {
  console.log(`::warning::Could not refresh contributions, keeping the snapshot. ${err.message}`);
}
