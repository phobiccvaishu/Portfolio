async function fetchLeetCodeDetails(username: string) {
  const query = JSON.stringify({
    query: `
      query getUserExtraDetails($username: String!) {
        matchedUser(username: $username) {
          languageProblemCount {
            languageName
            problemsSolved
          }
        }
        recentAcSubmissionList(username: $username, limit: 10) {
          id
          title
          titleSlug
          timestamp
        }
      }
    `,
    variables: { username }
  });

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://leetcode.com/'
      },
      body: query
    });

    const data = await res.json();
    console.log('Extra details:', JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

fetchLeetCodeDetails('vaish_phob');
