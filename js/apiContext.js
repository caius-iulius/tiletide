export class ApiContext {
    constructor() {
        this.user = null;
        this.token = null;
        this.loggedIn = false;
    }

    async signup(formData) {
        try {
            const response = await fetch("/php/signup.php", {
                method: "POST",
                body: formData
            });
            const responseData = await response.json();

            if(responseData.status === "success") {
                this.user = responseData.user;
                this.token = responseData.token;
                this.loggedIn = true;
                return true;
            } else {
                alert(responseData.message);
                return false;
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("An error occurred during signup. Please try again.");
            return false;
        }
    }

    async login(formData) {
        try {
            const response = await fetch("/php/login.php", {
                method: "POST",
                body: formData
            });
            const responseData = await response.json();

            if (responseData.status === "success") {
                this.user = responseData.user;
                this.token = responseData.token;
                this.loggedIn = true;
                return true;
            } else {
                alert(responseData.message);
                return false;
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred during login. Please try again.");
            return false;
        }
    }

    async save(saveName, saveJson) {
        if (!this.loggedIn) {
            alert("You must be logged in to save.");
            return false;
        }

        const requestData = {
            save_name: saveName,
            save_json: saveJson,
            user_id: this.user.id,
            token: this.token
        };

        try {
            const response = await fetch("/php/save.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });
            const responseData = await response.json();
            alert("Save successful!");
            return responseData;
        } catch (error) {
            console.error("Error during save:", error);
            alert("An error occurred while saving. Please try again.");
        }
    }

    async delete(saveId) {
        if (!this.loggedIn) {
            alert("You must be logged in to delete a save.");
            return false;
        }

        const requestData = {
            save_id: saveId,
            user_id: this.user.id,
            token: this.token
        };

        try {
            await fetch("/php/delete.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });
            alert("Save deleted successfully!");
        } catch (error) {
            console.error("Error during delete:", error);
            alert("An error occurred while deleting the save. Please try again.");
        }
    }
}