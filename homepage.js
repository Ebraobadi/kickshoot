
// Toggle burger menu animation
document.querySelector(".menu-icon-wrapper").onclick = function () {
  const menuIcon = document.querySelector(".menu-icon");
  menuIcon.classList.toggle("menu-icon-active");
  document.getElementById("menu").classList.toggle("active");
};

// RapidAPI configuration
const apiKey = '7b3064d6ecmshe5da4e2e7fa2433p185306jsn2e56659bafe1'; // Replace with your actual RapidAPI key
const apiHost = 'api-football-v1.p.rapidapi.com';
const season = 2024; // Adjust to the current season

// List of leagues
const leagues = [
  { name: 'Premier League', id: 39 },
  { name: 'Pro League', id: 307 },
  { name: 'La Liga', id: 140 },
  { name: 'Eredivisie', id: 88 },
  { name: 'Ligue 1', id: 61 },
  { name: 'Bundesliga', id: 78 },
  { name: 'Primeira Liga', id: 94 },
  { name: 'Serie A', id: 71 },
  { name: 'Saudi Pro League', id: 307 }
];

// Fetch live matches
async function fetchLiveMatches(leagueId) {
  const url = `https://${apiHost}/v3/fixtures?live=all&league=${leagueId}`; // Fetch live matches for selected league

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error fetching live matches:', error);
  }
}

// Function to update the live match section
function updateLiveMatch(match) {
  const matchContainer = document.querySelector('.match');

  // Clear existing content (if any)
  matchContainer.innerHTML = '';

  const homeTeam = match.teams.home.name;
  const awayTeam = match.teams.away.name;
  const homeTeamLogo = match.teams.home.logo;
  const awayTeamLogo = match.teams.away.logo;
  const score = `${match.goals.home} - ${match.goals.away}`;

  // Populate the match data into the HTML structure
  matchContainer.innerHTML = `
    <div class="team">
      <img src="${homeTeamLogo}" alt="${homeTeam}" class="team-logo" />
      <span class="team-name">${homeTeam}</span>
    </div>
    <div class="score">
      <span>${score}</span>
    </div>
    <div class="team">
      <img src="${awayTeamLogo}" alt="${awayTeam}" class="team-logo" />
      <span class="team-name">${awayTeam}</span>
    </div>
  `;
}

// Fetch upcoming matches for selected league (10 matches)
async function fetchUpcomingMatches(leagueId) {
  const url = `https://${apiHost}/v3/fixtures?league=${leagueId}&season=${season}&next=10`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error fetching the matches:', error);
  }
}

// Fetch league standings for selected league
async function fetchLeagueStandings(leagueId) {
  const url = `https://${apiHost}/v3/standings?league=${leagueId}&season=${season}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.response[0].league.standings[0]; // Return the standings array
  } catch (error) {
    console.error('Error fetching the standings:', error);
  }
}

// Function to update the "Fixtures" section
function updateFixtures(matches) {
  const fixturesContainer = document.querySelector('.results-card');

  // Clear existing fixtures
  fixturesContainer.innerHTML = '<h3>Fixtures</h3>';

  // Create fixture cards from API data
  matches.forEach(match => {
    const matchDate = new Date(match.fixture.date);
    const homeTeam = match.teams.home.name;
    const awayTeam = match.teams.away.name;
    const homeTeamLogo = match.teams.home.logo;
    const awayTeamLogo = match.teams.away.logo;
    const time = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const matchDay = document.createElement('div');
    matchDay.classList.add('match-day');

    matchDay.innerHTML = `
      <div class="match-date">${matchDate.toDateString()}</div>
      <div class="match-tcard">
        <div class="time">${time}</div>
        <div class="teams">
          <div class="team">
            <img src="${homeTeamLogo}" alt="${homeTeam}" class="team-logo" />
            <span>${homeTeam}</span>
          </div>
          <div class="team">
            <img src="${awayTeamLogo}" alt="${awayTeam}" class="team-logo" />
            <span>${awayTeam}</span>
          </div>
        </div>
      </div>
    `;

    fixturesContainer.appendChild(matchDay);
  });
}

// Function to update the "Schedule League" standings
function updateLeagueStandings(standings) {
  const scheduleContainer = document.querySelector('.schedule-league tbody');

  // Clear existing standings
  scheduleContainer.innerHTML = '';

  // Create table rows from API data
  standings.forEach((team, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="rank">${index + 1}</td>
      <td class="team-name">
        <img src="${team.team.logo}" class="team-logo" alt="${team.team.name}" />
        ${team.team.name}
      </td>
      <td class="score">${team.points}</td>
    `;
    scheduleContainer.appendChild(row);
  });
}

// Function to handle league selection
async function handleLeagueChange(leagueId) {
  // Fetch and update fixtures
  const upcomingMatches = await fetchUpcomingMatches(leagueId);
  updateFixtures(upcomingMatches);

  // Fetch and update league standings
  const leagueStandings = await fetchLeagueStandings(leagueId);
  updateLeagueStandings(leagueStandings);

  // Fetch and update live matches
  const liveMatches = await fetchLiveMatches(leagueId);
  if (liveMatches.length > 0) {
    updateLiveMatch(liveMatches[0]); // Display the first live match for the selected league
  } else {
    const matchContainer = document.querySelector('.match');
    matchContainer.innerHTML = '<p>No live matches currently available for this league.</p>';
  }
}

// Initialize and Fetch Data based on the selected league
document.addEventListener('DOMContentLoaded', async () => {
  const selectElement = document.querySelector('.simple-select');

  // Set up event listener for league selection
  selectElement.addEventListener('change', async (event) => {
    const selectedLeague = event.target.value;
    const league = leagues.find(league => league.name === selectedLeague);
    if (league) {
      await handleLeagueChange(league.id); // Fetch and update data for the selected league
    }
  });

  // Load the default league (Premier League) on page load
  handleLeagueChange(39); // Premier League ID is 39
});
