document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#data-table tbody');
  const searchInput = document.querySelector('#search-input');
  const searchButton = document.querySelector('#search-button');
  const clearButton = document.querySelector('#clear-button');
  const postsList = document.querySelector('#posts-list');

  let originalData = [];

  // Fetch user data
  fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => {
          originalData = data;
          displayData(originalData);
      })
      .catch(error => {
          console.error('Error fetching user data:', error);
          displayError('Failed to fetch user data.');
      });

  // Function to display user data in the table
  function displayData(data) {
      tableBody.innerHTML = ''; // Clear the table body
      data.forEach(user => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${user.id}</td>
              <td>${user.name}</td>
              <td>${user.email}</td>
          `;
          tableBody.appendChild(row);

          // Add click event listener to each row
          row.addEventListener('click', () => {
              displayUserDetails(user);
              fetchUserPosts(user.id);
          });
      });
  }

  // Function to display user posts
  function displayPosts(posts) {
      postsList.innerHTML = ''; // Clear previous posts
      if (posts.length > 0) {
          posts.forEach(post => {
              const listItem = document.createElement('li');
              listItem.innerHTML = `<strong>${post.title}</strong><p>${post.body}</p>`;
              postsList.appendChild(listItem);
          });
      } else {
          postsList.innerHTML = '<li>No posts available for this user.</li>';
      }
  }

  // Function to fetch user posts with loader
  function fetchUserPosts(userId) {
      const loader = document.querySelector('.loader');
      loader.style.display = 'block'; // Show loader
      fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
          .then(response => response.json())
          .then(posts => {
              displayPosts(posts);
              loader.style.display = 'none'; // Hide loader
          })
          .catch(error => {
              console.error('Error fetching posts:', error);
              loader.style.display = 'none'; // Hide loader
          });
  }

  // Function to display user details in the detail table
  function displayUserDetails(user) {
      const detailBody = document.querySelector('#detail-body');
      detailBody.innerHTML = ''; // Clear previous details

      const details = [
          { label: 'ID', value: user.id },
          { label: 'Nama', value: user.name },
          { label: 'Email', value: user.email },
          { label: 'Username', value: user.username },
          { label: 'Website', value: user.website },
          { label: 'Telepon', value: user.phone },
          { label: 'Alamat', value: `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}` },
          { label: 'Perusahaan', value: user.company.name },
          { label: 'Slogan Perusahaan', value: user.company.catchPhrase },
          { label: 'Strategi Bisnis', value: user.company.bs },
          { label: 'Tanggal Lahir', value: user.birthday || 'Tidak tersedia' },
          { label: 'Jenis Kelamin', value: user.gender || 'Tidak tersedia' },
          { label: 'LinkedIn', value: user.socialMedia?.linkedin || 'Tidak tersedia' },
          { label: 'Twitter', value: user.socialMedia?.twitter || 'Tidak tersedia' },
          { label: 'Deskripsi', value: user.bio || 'Tidak tersedia' },
          { label: 'Negara', value: user.address.country || 'Tidak tersedia' },
          { label: 'Provinsi', value: user.address.state || 'Tidak tersedia' },
          { label: 'Latitude', value: user.address.geo?.lat || 'Tidak tersedia' },
          { label: 'Longitude', value: user.address.geo?.lng || 'Tidak tersedia' }
      ];

      details.forEach(detail => {
          const row = document.createElement('tr');
          row.innerHTML = `<td>${detail.label}</td><td>${detail.value}</td>`;
          detailBody.appendChild(row);
      });
  }

  // Search functionality
  searchButton.addEventListener('click', () => {
      const userId = searchInput.value.trim();
      if (userId) {
          const user = originalData.find(user => user.id == userId);
          if (user) {
              displayData([user]);
              displayUserDetails(user);
              fetchUserPosts(userId);
          } else {
              tableBody.innerHTML = '<tr><td colspan="3">No user found with this ID.</td></tr>';
              postsList.innerHTML = '';
              document.querySelector('#detail-body').innerHTML = ''; 
          }
      } else {
          displayData(originalData);
          postsList.innerHTML = '';
          document.querySelector('#detail-body').innerHTML = '';
      }
  });

  // Clear search functionality
  clearButton.addEventListener('click', () => {
      searchInput.value = '';
      displayData(originalData);
      postsList.innerHTML = '';
      document.querySelector('#detail-body').innerHTML = '';
  });

  // Show loader
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.textContent = 'Loading...';
  document.body.appendChild(loader);
});

// Function to display error message
function displayError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  document.body.appendChild(errorElement);
  setTimeout(() => {
      errorElement.remove();
  }, 3000);
}
