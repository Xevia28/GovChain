document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".loader-container").style.display = "flex";
    const userTableBody = document.querySelector(".user-table tbody");

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/user');
            const users = await response.json();
            userTableBody.innerHTML = '';
            users.data.forEach((user, index) => {
                const row = createTableRow(user, index);
                userTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const createTableRow = (user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
            <td><button type="button" class="btn btn-danger btn-sm delete-btn" data-user-id="${user._id}">Remove User</button></td>
        `;
        return row;
    };

    userTableBody.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const userId = event.target.getAttribute('data-user-id');
            try {
                // console.log(userId)
                await fetch(`http://localhost:3000/api/user/${userId}`, { method: 'DELETE' });
                fetchUsers(); // Refresh the user list
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    });
    fetchUsers();
    document.querySelector(".loader-container").style.display = "none";
});
