document.getElementById('submitUserButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput').files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        // Show loader
        document.querySelector(".loader-container").style.display = "flex";

        try {
            for (const row of excelData) {
                const userData = {
                    name: row.name,
                    email: row.email,
                    walletAddress: row.walletAddress,
                    role: row.userType
                };
                console.log(userData);
                try {
                    const response = await axios.post('/api/user/signup', userData);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error caught while adding user:', error);
                }
            }

            alert("Users added successfully");
        } catch (error) {
            alert("An unexpected error occurred. Check console.");
            console.error('Error caught during processing:', error);
        } finally {
            // Hide loader
            document.querySelector(".loader-container").style.display = "none";
            window.location.reload(true);
        }
    };

    reader.readAsArrayBuffer(fileInput);
});
