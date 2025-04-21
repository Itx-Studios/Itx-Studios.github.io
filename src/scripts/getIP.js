document.addEventListener("DOMContentLoaded", () => {
    fetch("https://api.ipify.org?format=json")
    .then(response => response.json())
    .then(data => {
        document.querySelector("#ip-text").innerHTML = `Your Ip-Address: ${data.ip}`;
    })
    .catch(err => {
        console.log(err);
        alert("Failed to find your ip");
    });
});