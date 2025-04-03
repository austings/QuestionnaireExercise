document.addEventListener("DOMContentLoaded", function () {
    fetch("/data/questionnaire_questionnaires.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.trim().split("\n").slice(1);
            const container = document.getElementById("buttons-container");
            
            rows.forEach(row => {
                const [id, name] = row.split(",");
                const button = document.createElement("button");
                button.textContent = name;
                button.onclick = () => window.location.href = `http://localhost:3000/${id}/`;
                container.appendChild(button);
            });
        })
        .catch(error => console.error("Error loading CSV:", error));
});
