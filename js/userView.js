export class UserView {
    constructor(apiContext, signupForm, loginForm, userProfile, showLoginButton, showSignupButton) {
        this.apiContext = apiContext;
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
        this.signupForm.hidden = true;
        this.loginForm.hidden = true;
        this.userProfile.hidden = false;
    }
}