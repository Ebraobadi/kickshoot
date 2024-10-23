document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data from localStorage
  const selectedMatch = JSON.parse(localStorage.getItem('selectedMatch'));

  // Mapping match numbers and days to iframe URLs
  const iframeUrls = {
    today: {
      1: 'https://www.youtube.com/embed/ghNNQL0EdpQ?si=Gn0gr3iUr6N-EPsr',
      2: 'https://koora.vip/share.php?ch=today_2',
      3: 'https://koora.vip/share.php?ch=today_3',
      11: 'https://aliezstream.pro/live/diemasport3_bulgaria.php',
    },
    tomorrow: {
      1: 'https://koora.vip/share.php?ch=tomorrow_1',
      2: 'https://koora.vip/share.php?ch=tomorrow_2',
      3: 'https://koora.vip/share.php?ch=tomorrow_3',
    },
    yesterday: {
      1: 'https://koora.vip/share.php?ch=yesterday_1',
      2: 'https://koora.vip/share.php?ch=yesterday_2',
      3: 'https://koora.vip/share.php?ch=yesterday_3',
    }
  };

  // Check if match data exists
  if (selectedMatch) {
    const matchNumber = selectedMatch.matchNumber; // Get the match number
    const selectedDay = selectedMatch.selectedDay; // Get the selected day (today, tomorrow, yesterday)

    // Assign the correct iframe URL based on the match number and selected day
    const iframeSrc = iframeUrls[selectedDay][matchNumber] || 'https://koora.vip/share.php?ch=default'; // Default iframe if no match is found

    // Insert the iframe into the watch section
    const embedVideoSection = document.querySelector('.embedvideo iframe');
    embedVideoSection.src = iframeSrc;

    // Create the new match card HTML
    const matchCardHTML = `
      <div class="match-card">
        <div class="team-names">
          <h2 class="team-name-left">${selectedMatch.homeTeam}</h2> 
          <img src="${selectedMatch.homeLogo}" alt="${selectedMatch.homeTeam}" class="team-logo-left" /> 
        </div>
        <div class="match-info-text">
          <h3>VS</h3>
        </div>
        <div class="team-names">
          <h2 class="team-name-right">${selectedMatch.awayTeam}</h2> 
          <img src="${selectedMatch.awayLogo}" alt="${selectedMatch.awayTeam}" class="team-logo-right" /> 
        </div>
      </div>
    `;

    // Select the main.top element and insert the match card
    const topMain = document.querySelector('.top');
    topMain.insertAdjacentHTML('beforeend', matchCardHTML);
  } else {
    console.error("No match data found in localStorage.");
  }
});
