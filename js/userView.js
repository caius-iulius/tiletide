import { GridCanvas } from "./gridCanvas.js";
import { Save } from "./save.js";
import { Grid } from "./tiles.js";

const TESTSAVES = [
    { id: 0, save: new Save("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 1, save: new Save("baaaaaaaaaaaa", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 2, save: new Save("c", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 3, save: new Save("a", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 4, save: new Save("b", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 5, save: new Save("c", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 6, save: new Save("a", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 7, save: new Save("b", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 8, save: new Save("c", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) },
    { id: 9, save: new Save("d", new Grid(4, 4, (i, j) => (i + j) % 2), 4, true, true, [{r: 255, g: 255, b: 255}, {r: 0, g: 0, b: 0}]) }];

export class UserView {
    constructor(apiContext, loadSaveCallback, signupForm, loginForm, userProfile, showLoginButton, showSignupButton) {
        this.apiContext = apiContext;
        this.loadSaveCallback = loadSaveCallback;
        this.signupForm = signupForm;
        this.loginForm = loginForm;
        this.userProfile = userProfile;

        // add form event listeners
        this.signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(this.signupForm);
            console.log(formData);

            const success = await this.apiContext.signup(formData);
            if(success) this.showProfile();
        });

        this.loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const formData = new FormData(this.loginForm);
            console.log(formData);

            const success = await this.apiContext.login(formData);
            if(success) this.showProfile();
        });

        // add button event listeners
        showLoginButton.addEventListener("click", () => {
            this.showLogin();
        });

        showSignupButton.addEventListener("click", () => {
            this.showSignup();
        });

        // Initialize view state
        this.showLogin();
    }

    createCard(id, save) {
        const card = document.createElement("div");
        card.className = "save-card";

        const canvas = document.createElement("canvas");
        canvas.width = 150;
        canvas.height = 150;
        const gridCanvas = new GridCanvas(save.grid, canvas, save.palette);
        gridCanvas.render();
        card.appendChild(canvas);

        const nameElement = document.createElement("div");
        nameElement.className = "save-name";
        nameElement.textContent = save.name;
        card.appendChild(nameElement);

        const loadButton = document.createElement("button");
        loadButton.textContent = "Load";
        loadButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log(`Loading save: ${save.name}`);
            this.loadSaveCallback(id, save);
        });
        card.appendChild(loadButton);

        const deleteButton = document.createElement("button");
        deleteButton.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log(`Deleting save: ${save.name}`);
            // Here you would typically call an API to delete the save
            // For now, just log it
            alert(`Delete functionality not implemented for ${save.name}`);
        });
        deleteButton.textContent = "Delete";
        card.appendChild(deleteButton);

        return card;
    }

    renderProfile() {
        this.userProfile.innerHTML = ""; // Clear previous content

        const welcomeMessage = document.createElement("h2");
        welcomeMessage.textContent = `Welcome, ${"TEST"}!`;
        this.userProfile.appendChild(welcomeMessage);

        const savesTitle = document.createElement("h3");
        savesTitle.textContent = "Your Saves:";
        this.userProfile.appendChild(savesTitle);

        const savesContainer = document.createElement("div");
        savesContainer.className = "saves-container";

        TESTSAVES.forEach(({ id, save }) => {
            const card = this.createCard(id, save);
            savesContainer.appendChild(card);
        });

        this.userProfile.appendChild(savesContainer);
    }

    showSignup() {
        this.signupForm.hidden = false;
        this.loginForm.hidden = true;
        this.userProfile.hidden = true;
    }

    showLogin() {
        this.signupForm.hidden = true;
        this.loginForm.hidden = false;
        this.userProfile.hidden = true;
    }

    showProfile() {
        this.renderProfile();
        this.signupForm.hidden = true;
        this.loginForm.hidden = true;
        this.userProfile.hidden = false;
    }
}