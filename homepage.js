
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










document.getElementById('submission-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevents the form from submitting normally

  const title = document.getElementById('title').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const article = document.getElementById('article').value;
  const fileInput = document.getElementById('file');
  const file = fileInput.files[0];  // Get the selected file
  let imageURL = '';

  // First, check how many articles this email has submitted
  db.collection('articles').where('email', '==', email).get().then(snapshot => {
    const submissionCount = snapshot.size;  // Get the number of articles submitted by this email

    // If the user has submitted fewer than 2 articles, allow the submission
    if (submissionCount < 2) {
      if (file) {
        // Upload image to Firebase Storage
        const fileRef = storageRef.child('images/' + file.name);
        fileRef.put(file).then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            imageURL = url;
            saveArticle(title, name, email, article, imageURL);  // Save the article with image URL
          }).catch((error) => {
            console.error('Error getting image URL:', error);
          });
        }).catch((error) => {
          console.error('Error uploading image:', error);
        });
      } else {
        // No image provided, just save the article
        saveArticle(title, name, email, article, imageURL);
      }
    } else {
      // Block the submission and inform the user
      alert('You have already submitted 2 articles and cannot submit more.');
    }
  }).catch(error => {
    console.error('Error checking submission count:', error);
  });
});

function saveArticle(title, name, email, article, imageURL) {
  // Save the article data to Firestore
  db.collection('articles').add({
    title: title,
    name: name,
    email: email,
    article: article,
    image: imageURL,  // Save the image URL (if uploaded)
    date: new Date()
  }).then(() => {
    console.log('Article added successfully');
    document.getElementById('submission-form').reset();  // Reset the form after submission
    fetchAndDisplayArticles();  // Re-fetch and display all articles after submission
  }).catch(error => {
    console.error('Error adding document:', error);
  });
}

// Function to display multiple articles
function displayArticle(title, name, article, imageURL, date) {
  const featureNews = document.querySelector('.feature-news');  // Select the container where articles will be displayed

  const articleHTML = `
    <div class="news-feature-item">
      <img src="${imageURL ? imageURL : '/Kachkol/imgs/placeholder.jpg'}" alt="Feature Image" class="news-feature-image" />
      <div class="news-details">
        <h3 class="news-title">${title}</h3>
        <p class="news-excerpt">${article.substring(0, 100)}...</p>
        <p class="news-meta">By <strong>${name}</strong> | ${new Date(date).toDateString()}</p>
      </div>
    </div>
  `;

  featureNews.insertAdjacentHTML('beforeend', articleHTML);  // Append each article to the container
}

// Fetch and display all articles on page load
document.addEventListener('DOMContentLoaded', fetchAndDisplayArticles);

function fetchAndDisplayArticles() {
  const featureNews = document.querySelector('.feature-news');
  featureNews.innerHTML = '';  // Clear existing articles before fetching new ones

  db.collection('articles').orderBy('date', 'desc').get().then(snapshot => {
    snapshot.forEach(doc => {
      const articleData = doc.data();
      displayArticle(articleData.title, articleData.name, articleData.article, articleData.image, articleData.date);
    });
  }).catch(error => {
    console.error('Error fetching articles:', error);
  });
}
