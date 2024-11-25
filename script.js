const poolData = {
  A: [
    { team: "Spike Masters", wins: 3, losses: 0, differential: 45, total: 125, place: 1 },
    { team: "Beach Kings", wins: 2, losses: 1, differential: 25, total: 115, place: 2 },
    { team: "Net Warriors", wins: 1, losses: 2, differential: -15, total: 95, place: 3 },
    { team: "Sand Stars", wins: 0, losses: 3, differential: -55, total: 75, place: 4 }
  ],
  B: [
    { team: "Volley Vikings", wins: 3, losses: 0, differential: 40, total: 120, place: 1 },
    { team: "Serve Squad", wins: 2, losses: 1, differential: 20, total: 110, place: 2 },
    { team: "Block Brigade", wins: 1, losses: 2, differential: -10, total: 90, place: 3 },
    { team: "Dig Dynasty", wins: 0, losses: 3, differential: -50, total: 70, place: 4 }
  ],
  C: [
    { team: "Set Strikers", wins: 3, losses: 0, differential: 35, total: 115, place: 1 },
    { team: "Bump Bruisers", wins: 2, losses: 1, differential: 15, total: 105, place: 2 },
    { team: "Rally Rebels", wins: 1, losses: 2, differential: -5, total: 85, place: 3 },
    { team: "Court Crushers", wins: 0, losses: 3, differential: -45, total: 65, place: 4 }
  ]
};

const matchPairings = {
  A: [
    { team1: "Spike Masters", team2: "Beach Kings" },
    { team1: "Spike Masters", team2: "Net Warriors" },
    { team1: "Spike Masters", team2: "Sand Stars" },
    { team1: "Beach Kings", team2: "Net Warriors" },
    { team1: "Beach Kings", team2: "Sand Stars" },
    { team1: "Net Warriors", team2: "Sand Stars" }
  ],
  B: [
    { team1: "Volley Vikings", team2: "Serve Squad" },
    { team1: "Volley Vikings", team2: "Block Brigade" },
    { team1: "Volley Vikings", team2: "Dig Dynasty" },
    { team1: "Serve Squad", team2: "Block Brigade" },
    { team1: "Serve Squad", team2: "Dig Dynasty" },
    { team1: "Block Brigade", team2: "Dig Dynasty" }
  ],
  C: [
    { team1: "Set Strikers", team2: "Bump Bruisers" },
    { team1: "Set Strikers", team2: "Rally Rebels" },
    { team1: "Set Strikers", team2: "Court Crushers" },
    { team1: "Bump Bruisers", team2: "Rally Rebels" },
    { team1: "Bump Bruisers", team2: "Court Crushers" },
    { team1: "Rally Rebels", team2: "Court Crushers" }
  ]
};

function showPool(pool) {
  const tableBody = document.querySelector('#poolTable tbody');
  tableBody.innerHTML = '';

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

document.getElementById('adminScoreForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = {
    tournament: document.getElementById('tournament').value,
    pool: document.getElementById('pool').value,
    match: document.getElementById('match').value,
    set: document.getElementById('set').value, // Added Set field
    team1Score: parseInt(document.getElementById('team1Score').value),
    team2Score: parseInt(document.getElementById('team2Score').value),
  };

  // Validate formData
  if (!formData.tournament || !formData.pool || !formData.match || !formData.set) {
    alert('Please complete all fields.');
    return;
  }

  // Find the match information
  const matchInfo = matchPairings[formData.pool]?.find(
    (match, index) => index + 1 === parseInt(formData.match)
  );

  if (matchInfo) {
    const team1 = poolData[formData.pool].find(t => t.team === matchInfo.team1);
    const team2 = poolData[formData.pool].find(t => t.team === matchInfo.team2);

    // Update scores and stats
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

    // Sort and update team standings
    const pool = poolData[formData.pool];
    pool.sort((a, b) => b.wins - a.wins || b.differential - a.differential);
    pool.forEach((team, index) => {
      team.place = index + 1;
    });

    // Refresh displayed pool
    showPool(formData.pool);
  }

  console.log('Form Submitted:', formData);
  resetForm();
  hideAdminForm();
});
