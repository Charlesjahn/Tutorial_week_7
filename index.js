const electron = require("electron");
const fs = require("fs");
const uuid = require("uuid");
const { app, BrowserWindow, Menu, ipcMain } = electron;
let todayWindow;
let createWindow;
let listWindow;
let allServices = [];
fs.readFile("db.json", (err, jsonServices) => {
    if (!err) {
        const oldServices = JSON.parse(jsonServices);
        allServices = oldServices;
    };
});
app.on("ready", () => {
    // creating main window
    todayWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        min_width: 600,
        min_height: 650,
        title: "CA Bikes service booking"
    });
    todayWindow.loadURL(`file://${__dirname}/today.html`);
    todayWindow.on("closed", () => {
        const jsonServices = JSON.stringify(allServices);
        fs.writeFileSync("db.json", jsonServices);
        app.quit();
        todayWindow = null;
    });
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});
// creating new appoinment window
const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        min_width: 500,
        min_height: 650,
        title: "Booking New Service "
    }); createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", () => (createWindow = null));
};
// creating all appoinment window

const listWindowCreator = () => {
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        min_width: 700,
        min_height: 700,
        title: "All Services"
    });
    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", () => (listWindow = null));
};
ipcMain.on("servicesBikes:create", (event, servicesBikes) => {
    servicesBikes["id"] = uuid();
    servicesBikes["done"] = 0;
    allServices.push(servicesBikes);
    sendTodayServices();
    createWindow.close();
});
ipcMain.on("servicesBikes:request:list", event => {
    listWindow.webContents.send("servicesBikes:response:list",
        allServices);
});
ipcMain.on("servicesBikes:request:today", event => {
    sendTodayServices();
});
ipcMain.on("servicesBikes:done", (event, id) => {
    allServices.forEach(servicesBikes => {
        if (servicesBikes.id === id) servicesBikes.done = 1;
    });
    sendTodayServices();
});
const sendTodayServices = () => {
    const today = new Date().toISOString().slice(0, 10);
    const filtered = allServices.filter(
        servicesBikes => servicesBikes.date === today
    );
    todayWindow.webContents.send("servicesBikes:response:today", filtered);
};
const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New Services",
                click() {
                    createWindowCreator();
                }
            },
            {
                label: "All Services",
                click() {
                    listWindowCreator();
                }
            },
            {
                label: "Quit",
                accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: "View",
        submenu: [{ role: "reload" }, { role: "toggledevtools" }]
    }
];