document.addEventListener('DOMContentLoaded', async () => {
  const liveNowBtn = document.querySelector('.matches-btn.live-now');
  const todayBtn = document.querySelector('.card.card-option:nth-child(1)'); // First button (Today)
  const tomorrowBtn = document.querySelector('.card.card-option:nth-child(2)'); // Second button (Tomorrow)
  const yesterdayBtn = document.querySelector('.card.card-option:nth-child(3)'); // Third button (Yesterday)
  const cardsContainer = document.querySelector('.bottom');

  const apiKey = '7b3064d6ecmshe5da4e2e7fa2433p185306jsn2e56659bafe1'; // Replace with your actual key
  const apiHost = 'api-football-v1.p.rapidapi.com';

  const allowedLeagues = [
    { name: 'UEFA Champions League', id: 2 },
    { name: 'EFL Cup', id: 48 },
    { name: 'AFC Champions League', id: 17 },
    { name: 'AFC Champions League', id: 6325 },
    { name: 'Premier League', id: 524 },
    { name: 'Pro League', id: 307 },
    { name: 'La Liga', id: 140 },
    { name: 'Eredivisie', id: 88 },
    { name: 'UEFA Europa League', id: 3 },
    { name: 'UEFA Europa Conference League', id: 848 },
    { name: 'Major League Soccer', id: 253 },
    { name: 'Bundesliga', id: 78 },
    { name: 'Serie A', id: 71 },
    { name: 'Ligue 1', id: 61 },
    { name: 'AFC Cup', id: 18 }
  ];

  let updateInterval;
  let selectedDay = 'today'; // Default to 'today'

  // Automatically fetch matches for today when the page loads
  const todayDate = getFormattedDate(new Date());
  const initialUrl = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${todayDate}`;
  await fetchMatches(initialUrl); // Fetch matches for today immediately

  liveNowBtn?.addEventListener('click', async () => {
    clearInterval(updateInterval);
    const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all';
    await fetchMatches(url);
    updateInterval = setInterval(() => fetchMatches(url), 30000); // Refresh every 30 seconds
  });

  todayBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    clearInterval(updateInterval);
    selectedDay = 'today'; // Set the selected day to 'today'
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${todayDate}`;
    await fetchMatches(url);
  });

  tomorrowBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    clearInterval(updateInterval);
    selectedDay = 'tomorrow'; // Set the selected day to 'tomorrow'
    const tomorrowDate = getFormattedDate(new Date(new Date().setDate(new Date().getDate() + 1)));
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${tomorrowDate}`;
    await fetchMatches(url);
  });

  yesterdayBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    clearInterval(updateInterval);
    selectedDay = 'yesterday'; // Set the selected day to 'yesterday'
    const yesterdayDate = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
    const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${yesterdayDate}`;
    await fetchMatches(url);
  });

  async function fetchMatches(url) {
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const filteredMatches = result.response.filter(match => {
        const league = match.league;
        return allowedLeagues.some(allowedLeague => 
          allowedLeague.name === league.name && allowedLeague.id === league.id
        );
      });

      displayMatches(filteredMatches);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function displayMatches(matches) {
    cardsContainer.innerHTML = ''; // Clear previous matches

    if (matches.length === 0) {
      cardsContainer.innerHTML = '<p>No matches found.</p>';
      return;
    }

    // Loop through matches and assign a unique number to each match-container
    matches.forEach((match, index) => {
      const matchStatus = match.fixture.status.short;
      const isLive = matchStatus === '1H' || matchStatus === '2H' || matchStatus === 'LIVE';
      const isNotStarted = matchStatus === 'NS';
      const isMatchEnded = matchStatus === 'FT' || matchStatus === 'AET' || matchStatus === 'PEN';
      const statusText = isLive ? `${match.fixture.status.elapsed}'` : (isMatchEnded ? 'Match End' : (isNotStarted ? 'Not Started' : 'Scheduled'));
      
      const currentHomeGoals = match.goals.home || 0;
      const currentAwayGoals = match.goals.away || 0;

      // Assign a unique match number for each card
      const matchNumber = index + 1; // Start counting from 1

      const matchCard = `
        <div class="match-container" data-match-number="${matchNumber}" data-home-team="${match.teams.home.name}" data-home-logo="${match.teams.home.logo}" data-away-team="${match.teams.away.name}" data-away-logo="${match.teams.away.logo}">
          <div class="img-text">
            <div class="img-responsive">
              <img src="${match.league.logo}" alt="${match.league.name}" />
            </div>
            <h1>${match.league.name}</h1>
          </div>
          <a href="watch.html" title="${match.teams.home.name} vs ${match.teams.away.name}">
            <div class="right-team">
              <div class="team-logo">
                <img src="${match.teams.home.logo}" alt="${match.teams.home.name}" title="${match.teams.home.name}" width="50" height="50" />
              </div>
              <div class="team-name">${match.teams.home.name}</div>
            </div>
            <div class="match-center">
              <div class="match-timing ${isLive ? 'playing' : ''}">
                <div id="match-time">${statusText}</div>
              </div>
              <div class="match-scores">
                <span class="home-score">${currentHomeGoals}</span>
                <span class="score-separator">-</span>
                <span class="away-score">${currentAwayGoals}</span>
              </div>
            </div>
            <div class="left-team">
              <div class="team-logo">
                <img src="${match.teams.away.logo}" alt="${match.teams.away.name}" title="${match.teams.away.name}" width="50" height="50" />
              </div>
              <div class="team-name">${match.teams.away.name}</div>
            </div>
          </a>
        </div>
      `;

      cardsContainer.innerHTML += matchCard;
    });

    // Adding the feature to store data in localStorage when a match card is clicked
    document.querySelectorAll('.match-container a').forEach(link => {
      link.addEventListener('click', (event) => {
        const matchContainer = event.currentTarget.closest('.match-container');
        const homeTeam = matchContainer.getAttribute('data-home-team');
        const homeLogo = matchContainer.getAttribute('data-home-logo');
        const awayTeam = matchContainer.getAttribute('data-away-team');
        const awayLogo = matchContainer.getAttribute('data-away-logo');
        const matchNumber = matchContainer.getAttribute('data-match-number'); // Get match number

        // Store the selected match data, including the unique match number and selected day, in localStorage
        const matchData = {
          homeTeam,
          homeLogo,
          awayTeam,
          awayLogo,
          matchNumber,
          selectedDay // Store the day (today, tomorrow, or yesterday)
        };

        console.log("Storing data in localStorage:", matchData); // Debugging log

        localStorage.setItem('selectedMatch', JSON.stringify(matchData));
      });
    });
  }

  function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});
