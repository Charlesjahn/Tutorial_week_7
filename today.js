const electron = require("electron");
const { ipcRenderer } = electron;
ipcRenderer.send("appointment:request:today");
ipcRenderer.on("appointment:response:today", (event, appointments) => {
    const listDiv = document.getElementById("list");
    listDiv.innerHTML = "";
    appointments.forEach(appointment => {
        const appointmentDiv = document.createElement("div");
        appointmentDiv.className = "divAppoit";
        const nameParagraph = document.createElement("p");
        nameParagraph.innerHTML = `Name: ${appointment.name}`;
        const numberParagraph = document.createElement("p");
        numberParagraph.innerHTML = `Phone Number: ${appointment.number}`;
        const dateParagraph = document.createElement("p");
        dateParagraph.innerHTML = `Date: ${appointment.date}`;
        const hourParagraph = document.createElement("p");
        hourParagraph.innerHTML = `Hour: ${appointment.hour}`;
        const symptomsParagraph = document.createElement("p");
        symptomsParagraph.innerHTML = `Symptoms: ${appointment.symptoms}`;
        const doneParagraph = document.createElement("p");
        doneParagraph.innerHTML = `Done: ${appointment.done ? "Yes" : "No"}`;
        const doneButton = document.createElement("button");
        doneButton.innerHTML = "Done";
        doneButton.className = "btnGeral";
        doneButton.disabled = appointment.done ? true : false;
        doneButton.onclick = () => done(appointment.id);
        appointmentDiv.appendChild(nameParagraph);
        appointmentDiv.appendChild(numberParagraph);
        appointmentDiv.appendChild(dateParagraph);
        appointmentDiv.appendChild(doneParagraph);
        appointmentDiv.appendChild(hourParagraph);
        appointmentDiv.appendChild(symptomsParagraph);
        appointmentDiv.appendChild(doneButton);
        listDiv.append(appointmentDiv);
    });
});
const done = id => {
    ipcRenderer.send("appointment:done", id);
};