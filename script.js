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
  