// Initialize placeholders for poolData and matchPairings
let poolData = {};
let matchPairings = {};

// Fetch data from the API and replace test data
async function fetchTeamsData() {
  const apiUrl = 'https://lumgutev6i.execute-api.us-east-1.amazonaws.com/teams';
  
  try {
    const response = await fetch(apiUrl); // Fetch data
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Parse JSON response
    
    // Log the raw API data for reference
    console.log('Fetched API Data:', data);
    
    // Transform the data and replace `poolData`
    poolData = transformApiData(data);
    
    // Optionally generate match pairings
    matchPairings = generateMatchPairings(poolData);
    
    // Log the final data for debugging
    console.log('Updated poolData:', poolData);
    console.log('Updated matchPairings:', matchPairings);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Helper function to transform API data to match `poolData` format
function transformApiData(apiData) {
  const poolMap = {};
  
  // Process each team from the API
  apiData.forEach(team => {
    const pool = team.Pool;
    if (!poolMap[pool]) {
      poolMap[pool] = [];
    }
    poolMap[pool].push({
      team: team.TeamName,
      wins: team.PoolPlayWins || 0,
      losses: 0, // Losses can be derived if needed
      differential: team.PoolPlayDifferentialTotal || 0,
      total: team.PoolPlayDifferentialTotal || 0,
      place: null // Placeholder for rank; calculate if required
    });
  });

  return poolMap;
}

// Helper function to generate match pairings (optional)
function generateMatchPairings(poolData) {
  const pairings = {};
  
  Object.keys(poolData).forEach(pool => {
    const teams = poolData[pool].map(team => team.team);
    pairings[pool] = [];
    
    // Create round-robin matchups
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        pairings[pool].push({ team1: teams[i], team2: teams[j] });
      }
    }
  });
  
  return pairings;
}

// Call the fetch function to replace test data
fetchTeamsData();




// const poolData = {
//   A: [
//     { team: "Spike Masters", wins: 3, losses: 0, differential: 45, total: 125, place: 1 },
//     { team: "Beach Kings", wins: 2, losses: 1, differential: 25, total: 115, place: 2 },
//     { team: "Net Warriors", wins: 1, losses: 2, differential: -15, total: 95, place: 3 },
//     { team: "Sand Stars", wins: 0, losses: 3, differential: -55, total: 75, place: 4 }
//   ],
//   B: [
//     { team: "Volley Vikings", wins: 3, losses: 0, differential: 40, total: 120, place: 1 },
//     { team: "Serve Squad", wins: 2, losses: 1, differential: 20, total: 110, place: 2 },
//     { team: "Block Brigade", wins: 1, losses: 2, differential: -10, total: 90, place: 3 },
//     { team: "Dig Dynasty", wins: 0, losses: 3, differential: -50, total: 70, place: 4 }
//   ],
//   C: [
//     { team: "Set Strikers", wins: 3, losses: 0, differential: 35, total: 115, place: 1 },
//     { team: "Bump Bruisers", wins: 2, losses: 1, differential: 15, total: 105, place: 2 },
//     { team: "Rally Rebels", wins: 1, losses: 2, differential: -5, total: 85, place: 3 },
//     { team: "Court Crushers", wins: 0, losses: 3, differential: -45, total: 65, place: 4 }
//   ]
// };

// const matchPairings = {
//   A: [
//     { team1: "Spike Masters", team2: "Beach Kings" },
//     { team1: "Spike Masters", team2: "Net Warriors" },
//     { team1: "Spike Masters", team2: "Sand Stars" },
//     { team1: "Beach Kings", team2: "Net Warriors" },
//     { team1: "Beach Kings", team2: "Sand Stars" },
//     { team1: "Net Warriors", team2: "Sand Stars" }
//   ],
//   B: [
//     { team1: "Volley Vikings", team2: "Serve Squad" },
//     { team1: "Volley Vikings", team2: "Block Brigade" },
//     { team1: "Volley Vikings", team2: "Dig Dynasty" },
//     { team1: "Serve Squad", team2: "Block Brigade" },
//     { team1: "Serve Squad", team2: "Dig Dynasty" },
//     { team1: "Block Brigade", team2: "Dig Dynasty" }
//   ],
//   C: [
//     { team1: "Set Strikers", team2: "Bump Bruisers" },
//     { team1: "Set Strikers", team2: "Rally Rebels" },
//     { team1: "Set Strikers", team2: "Court Crushers" },
//     { team1: "Bump Bruisers", team2: "Rally Rebels" },
//     { team1: "Bump Bruisers", team2: "Court Crushers" },
//     { team1: "Rally Rebels", team2: "Court Crushers" }
//   ]
// };

function showPool(pool) {
  const tableBody = document.querySelector('#poolTable tbody');
  tableBody.innerHTML = '';  // Clear existing table rows

  if (poolData[pool]) {
    poolData[pool].forEach(team => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${team.team}</td>
        <td>${team.wins}</td>
        <td>${team.losses}</td>
        <td>${team.differential}</td>
        <td>${team.total}</td>
        <td>${team.place}</td>
      `;
      tableBody.appendChild(row);
    });
  }
}


function showTournament(number) {
  document.querySelector('.tournament-grid').style.display = 'none';
  document.querySelector('#tournamentView').style.display = 'block';
  document.querySelector('#tournamentTitle').textContent = `Tournament #${number} Details`;
  showPool('A'); // Show Pool A by default
}

function showHome() {
  document.querySelector('.tournament-grid').style.display = 'grid';
  document.querySelector('#tournamentView').style.display = 'none';
}

// Show Pool A by default when the tournament view is active
showPool('A');

// Admin form functionality
function showAdminForm() {
  document.getElementById('adminFormContainer').style.display = 'flex';
}

function hideAdminForm() {
  document.getElementById('adminFormContainer').style.display = 'none';
}

function resetForm() {
  document.getElementById('adminScoreForm').reset();
  document.getElementById('team1Name').textContent = '-';
  document.getElementById('team2Name').textContent = '-';
}

function updatePoolOptions() {
  const poolSelect = document.getElementById('pool');
  poolSelect.value = '';
  document.getElementById('match').innerHTML = '';
  document.getElementById('set').value = '';
  document.getElementById('team1Name').textContent = '-';
  document.getElementById('team2Name').textContent = '-';
}

function updateMatchOptions() {
  const pool = document.getElementById('pool').value;
  const matchSelect = document.getElementById('match');
  matchSelect.innerHTML = '';

  if (pool && matchPairings[pool]) {
    matchPairings[pool].forEach((match, index) => {
      const option = document.createElement('option');
      option.value = index + 1;
      option.textContent = `Match ${index + 1}: ${match.team1} vs ${match.team2}`;
      matchSelect.appendChild(option);
    });

    matchSelect.addEventListener('change', () => {
      const selectedMatch = matchPairings[pool][matchSelect.value - 1];
      document.getElementById('team1Name').textContent = selectedMatch.team1;
      document.getElementById('team2Name').textContent = selectedMatch.team2;
    });
  }
}

// document.getElementById('adminScoreForm').addEventListener('submit', function (e) {
//   e.preventDefault();

//   const formData = {
//     tournament: document.getElementById('tournament').value,
//     pool: document.getElementById('pool').value,
//     match: document.getElementById('match').value,
//     set: document.getElementById('set').value, // Added Set field
//     team1Score: parseInt(document.getElementById('team1Score').value),
//     team2Score: parseInt(document.getElementById('team2Score').value),
//   };

//   // Validate formData
//   if (!formData.tournament || !formData.pool || !formData.match || !formData.set) {
//     alert('Please complete all fields.');
//     return;
//   }

//   // Find the match information
//   const matchInfo = matchPairings[formData.pool]?.find(
//     (match, index) => index + 1 === parseInt(formData.match)
//   );

//   if (matchInfo) {
//     const team1 = poolData[formData.pool].find(t => t.team === matchInfo.team1);
//     const team2 = poolData[formData.pool].find(t => t.team === matchInfo.team2);

//     // Update scores and stats
//     if (formData.team1Score > formData.team2Score) {
//       team1.wins++;
//       team2.losses++;
//     } else {
//       team2.wins++;
//       team1.losses++;
//     }

//     team1.differential += formData.team1Score - formData.team2Score;
//     team2.differential -= formData.team1Score - formData.team2Score;

//     team1.total += formData.team1Score;
//     team2.total += formData.team2Score;

//     // Sort and update team standings
//     const pool = poolData[formData.pool];
//     pool.sort((a, b) => b.wins - a.wins || b.differential - a.differential);
//     pool.forEach((team, index) => {
//       team.place = index + 1;
//     });

//     // Refresh displayed pool
//     showPool(formData.pool);
//   }

//   console.log('Form Submitted:', formData);
//   resetForm();
//   hideAdminForm();
// });


document.getElementById('adminScoreForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    tournament: document.getElementById('tournament').value, // Selected tournament
    pool: document.getElementById('pool').value, // Selected pool
    match: document.getElementById('match').value, // Selected match
    set: document.getElementById('set').value, // Set field
    team1Score: parseInt(document.getElementById('team1Score').value), // Team 1 score
    team2Score: parseInt(document.getElementById('team2Score').value), // Team 2 score
  };

  // Validate form data
  if (!formData.tournament || !formData.pool || !formData.match || !formData.set) {
    alert('Please complete all fields.');
    return;
  }

  const matchInfo = matchPairings[formData.pool]?.find(
    (match, index) => index + 1 === parseInt(formData.match)
  );

  if (matchInfo) {
    const team1 = poolData[formData.pool]?.find(t => t.team === matchInfo.team1);
    const team2 = poolData[formData.pool]?.find(t => t.team === matchInfo.team2);

    if (team1 && team2) {
      // Update scores and stats for the selected teams
      if (formData.team1Score > formData.team2Score) {
        team1.wins++;
        team2.losses++;
      } else {
        team2.wins++;
        team1.losses++;
      }

      team1.differential += formData.team1Score - formData.team2Score;
      team2.differential -= formData.team1Score - formData.team2Score;

      team1.total += formData.team1Score;
      team2.total += formData.team2Score;

      // Sort and update team standings for the selected pool
      poolData[formData.pool].sort((a, b) => b.wins - a.wins || b.differential - a.differential);
      poolData[formData.pool].forEach((team, index) => {
        team.place = index + 1;
      });

      // Update the displayed pool table for the selected pool
      showPool(formData.pool);

      // Update the API only for the selected teams and pool
      const team1Updates = {
        PoolPlayDifferentialPoints: [team1.differential],
        PoolPlayWins: team1.wins,
        PoolPlayMatchState: "played",
      };
      const team2Updates = {
        PoolPlayDifferentialPoints: [team2.differential],
        PoolPlayWins: team2.wins,
        PoolPlayMatchState: "played",
      };

      // Send updates to the API
      await updateTeamInAPI(team1.id, team1Updates);
      await updateTeamInAPI(team2.id, team2Updates);
    }
  }

  resetForm();
  hideAdminForm();
});


async function updateTeamInAPI(teamId, updates) {
  try {
    const apiUrl = `https://lumgutev6i.execute-api.us-east-1.amazonaws.com/teams/Team#${teamId}`;
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update team ${teamId}. Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(`Team ${teamId} updated successfully:`, responseData);
  } catch (error) {
    console.error("Error updating team in API:", error);
  }
}
