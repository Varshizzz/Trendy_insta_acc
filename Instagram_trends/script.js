let accountData = [];
fetch('./data.csv')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then(csvText => {
    accountData = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    }).data;
    if (accountData.length === 0) {
      throw new Error("CSV file is empty or incorrectly formatted.");
    }
    console.log("Data loaded successfully:", accountData);
  })
  .catch(error => {
    console.error('Error loading CSV file:', error);
    document.getElementById('search-result').innerText = "Failed to load CSV data. Please check the console for more details.";
  });

document.getElementById('search-button').addEventListener('click', () => {
  const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
  const searchResultElement = document.getElementById('search-result');
  const tableBody = document.getElementById('accounts-table').querySelector('tbody');
  const accountsTable = document.getElementById('accounts-table');
  tableBody.innerHTML = '';
  accountsTable.style.display = 'none';
  searchResultElement.innerHTML = '';

  const categoryResults = accountData.filter(account => account.Category?.toLowerCase() === searchInput);
  if (categoryResults.length > 0) {
    accountsTable.style.display = 'block';
    categoryResults.forEach(account => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${account.rank}</td>
        <td>${account.name}</td>
        <td>${account.Category}</td>
        <td>${account.Followers}</td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    const nameResult = accountData.find(account => account.name?.toLowerCase() === searchInput);
    if (nameResult) {
      accountsTable.style.display = 'block';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${nameResult.rank}</td>
        <td>${nameResult.name}</td>
        <td>${nameResult.Category}</td>
        <td>${nameResult.Followers}</td>
      `;
      tableBody.appendChild(row);
    } else {
      searchResultElement.innerText = 'No matching account or category found.';
    }
  }
});
