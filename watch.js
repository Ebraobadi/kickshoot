// Toggle burger menu animation
document.querySelector(".menu-icon-wrapper").onclick = function () {
    const menuIcon = document.querySelector(".menu-icon");
    menuIcon.classList.toggle("menu-icon-active");
    document.getElementById("menu").classList.toggle("active");
  };


  document.addEventListener('DOMContentLoaded', () => {
    // Retrieve data from localStorage
    const selectedMatch = JSON.parse(localStorage.getItem('selectedMatch'));
  
    // Check if match data exists
    if (selectedMatch) {
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
  