# InternalAI Project

Welcome to the InternalAI project!

Don't worry if you've never coded before or used GitHub – this guide is made for you! We'll walk you through everything you need to get started, step-by-step.

For styling, you can reference Knowit's [Visual Identity Guidelines](https://www.knowit.se/globalassets/brand-book/2024-assets/knowitvisuald240828.pdf)

---

## Table of Contents

1.  [Running the Servers Locally (After Initial Setup)](#1-running-the-servers-locally-after-initial-setup)
    * [1.1 Running on Windows](#11-running-on-windows)
    * [1.2 Running on Windows (with WSL)](#12-running-on-windows-with-wsl)
2.  [Running Tests](#2-running-tests)
    * [2.1 How to Run Tests](#21-how-to-run-tests)
    * [2.2 Where to Add New Tests](#22-where-to-add-new-tests)
3.  [First-Time Setup: Getting Started](#3-first-time-setup-getting-started)
    * [3.1 Setup for Windows](#31-setup-for-windows)
    * [3.2 Setup for Windows (with WSL)](#32-setup-for-windows-with-wsl)
4.  [Making Changes & Contributing (Your First Steps with Git)](#4-making-changes--contributing-your-first-steps-with-git)
5.  [Creating a New Release Tag](#5-creating-a-new-release-tag)
6.  [Troubleshooting Common Issues](#6-troubleshooting-common-issues)

---

## 1. Running the Servers Locally (After Initial Setup)

Once you've completed the "First-Time Setup" steps below for your chosen environment, you can run both the Backend (Flask) and Frontend (React) servers. You will need **two separate terminal windows/tabs** open for this, one for each server.

### 1.1 Running on Windows

1.  **Open your first PowerShell window.**
2.  **Navigate to your project root:**
    ```powershell
    cd C:\Path\To\Your\InternalAI\Project
    ```
    *(**Important:** Replace `C:\Path\To\Your\InternalAI\Project` with the actual folder path where you cloned or copied the `InternalAI` project on your computer.)*
3.  **Activate your Python virtual environment:**
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
    You should see `(venv)` at the beginning of your prompt.
4.  **Navigate to the `backend` folder:**
    ```powershell
    cd backend
    ```
5.  **Set the Flask application environment variable:**
    ```powershell
    $env:FLASK_APP = "app.py"
    ```
6.  **Run the Flask server:**
    ```powershell
    flask run
    ```
    You should see messages like `Running on http://127.0.0.1:5000`. Keep this window open and running. To stop the server, press `Ctrl + C`.

7.  **Open your second PowerShell window.**
8.  **Navigate to your project root:**
    ```powershell
    cd C:\Path\To\Your\InternalAI\Project
    ```
    *(**Important:** Again, replace this with your actual project path.)*
9.  **Navigate to the `frontend` folder:**
    ```powershell
    cd frontend
    ```
10. **Start the React development server:**
    ```powershell
    npm start
    ```
    This will open your browser to `http://localhost:3000` (or another port if 3000 is taken) and show your React application. Keep this window open and running. To stop the server, press `Ctrl + C`.

### 1.2 Running on Windows (with WSL)

1.  **Open VS Code and connect to WSL:**
    * Launch VS Code.
    * Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the Command Palette.
    * Type `WSL` and select **"Remote-WSL: New WSL Window"**.
    * Once the new VS Code window opens and connects to your WSL distro, go to "File" > "Open Folder..." and navigate to your project within the WSL file system (e.g., `/home/your_username/projects/InternalAI/`).
2.  **Open your first WSL terminal (for Backend):**
    * In VS Code, open a new terminal: `Ctrl+`` (backtick) or go to "Terminal" > "New Terminal".
3.  **Navigate to the `backend` folder:**
    ```bash
    cd backend
    ```
4.  **Activate your Python virtual environment:**
    ```bash
    source ../.venv/bin/activate
    ```
    * You should see `(venv)` at the beginning of your terminal prompt, like: `(venv) your_username@your_wsl_distro_name:~/projects/InternalAI/backend$`
5.  **Tell Flask where your app is:**
    ```bash
    export FLASK_APP=app.py
    ```
6.  **Run the Flask server:**
    ```bash
    flask run
    ```
    * You should see messages like `Running on http://127.0.0.1:5000`. Keep this terminal tab open and running. To stop the server, press `Ctrl + C`.

7.  **Open your second WSL terminal (for Frontend):**
    * In VS Code, click the `+` icon next to your current terminal tab to open a new one, or go to "Terminal" > "New Terminal".
8.  **Navigate to the `frontend` folder:**
    ```bash
    cd frontend
    ```
    * Your prompt should look like: `(venv) your_username@your_wsl_distro_name:~/projects/InternalAI/frontend$`
9.  **Ensure correct Node.js version (if using NVM):**
    ```bash
    nvm use --lts
    ```
    * This makes sure your terminal is using the recommended Node.js version.
10. **Start the React development server:**
    ```bash
    npm start
    ```
    * This will usually automatically open your web browser to `http://localhost:3000` (or another port if 3000 is taken) and show your React application. Keep this terminal tab open and running. To stop the server, press `Ctrl + C`.

---

## 2. Running Tests

Unit tests are crucial for ensuring the frontend components work as expected and to catch regressions early. The InternalAI frontend uses Jest and React Testing Library for testing.

### 2.1 How to Run Tests

Whether you are using Windows PowerShell or a WSL terminal, the commands to run frontend tests are similar.

1.  **Open a new terminal window/tab.**
2.  **Navigate to the `frontend` directory:**
    * **For Windows:**
        ```powershell
        cd C:\Path\To\Your\InternalAI\Project\frontend
        ```
        *(**Important:** Replace `C:\Path\To\Your\InternalAI\Project` with your actual project path)*
    * **For Windows (with WSL):**
        First, ensure your terminal is connected to WSL (e.g., in VS Code, open a new WSL terminal). Then navigate:
        ```bash
        cd ~/projects/InternalAI/frontend
        # Or, if you cloned to a different path:
        # cd /path/to/your/InternalAI/frontend
        ```
3.  **Run the tests:**
    ```powershell
    npm run test:e2e
    ```
    * This command will start Jest in **watch mode**. By default, it tries to run tests related to files changed since your last Git commit.
    * If you see "No tests found related to files changed since last commit.", simply **press `a` then Enter** at the prompt to run all tests.
    * To run all tests **immediately without entering watch mode** (e.g., for CI/CD pipelines or a quick full run), you can use:
        ```powershell
        npm run test:e2e -- --watchAll=false
        ```
    * For convenience, you can also add a shortcut in your `frontend/package.json` file. Under the `"scripts"` section, add:
        ```json
        "test:all": "react-scripts test --watchAll=false"
        ```
        Then, you can run all tests directly with `npm run test:e2e:all`.

### 2.2 Where to Add New Tests

* **Frontend (React) Tests:**
    * Frontend tests are located in the `frontend/src/` directory.
    * For a component named `MyComponent.js` (or `.jsx`, `.ts`, `.tsx`), its unit tests should typically be in a file named `MyComponent.test.js` (or `MyComponent.test.jsx`, `MyComponent.test.ts`, `MyComponent.test.tsx`) in the **same directory** as the component.
    * Example File Structure:
        ```
        frontend/src/
        ├── App.js
        ├── App.test.js        <-- Test file for App.js
        ├── components/
        │   ├── MyButton.js
        │   └── MyButton.test.js <-- Test file for MyButton.js
        └── pages/
            └── HomePage.js
            └── HomePage.test.js <-- Test file for HomePage.js
        ```
    * `react-scripts` (which `npm run test:e2e` uses) automatically finds files with `.test.js`, `.spec.js`, etc., suffixes within the `src` directory.

---

## 3. First-Time Setup: Getting Started

This section will help you set up your computer to work on the InternalAI project. Choose the setup method that suits your preference: **Windows** or **Windows (with WSL)**.

### 3.1 Setup for Windows

This is the traditional way to set up your development environment directly on Windows.

1.  **What is the Command Prompt (PowerShell)?**
    Think of the Command Prompt (or PowerShell on Windows) as a way to type commands directly to your computer instead of clicking on icons. We'll use it to run Python programs and Git commands.
    * **How to Open PowerShell:**
        * Click the Windows Start button.
        * Type `powershell` and press Enter. A blue window will appear. This is your terminal.

2.  **Install Python:**
    Python is the programming language this project uses.
    1.  **Download Python:** Go to the official Python website: [https://www.python.org/downloads/](https://www.python.org/downloads/)
    2.  **Choose the Latest Version:** Download the latest "Windows installer" (usually a `.exe` file).
    3.  **Run the Installer:** Double-click the downloaded `.exe` file.
        * **VERY IMPORTANT:** On the first screen of the installer, make sure to check the box that says **"Add Python.exe to PATH"**. This makes it easy for your computer to find Python.
        * Then, click "Install Now" and follow the prompts.
    4.  **Verify Python Installation:** Open a **NEW** PowerShell window (close any old ones first). Type:
        ```powershell
        python --version
        ```
        You should see `Python 3.x.x` (e.g., `Python 3.10.5`). If you get an error, close PowerShell, restart your computer, and try again.

3.  **Install Git:**
    Git is a tool that helps us manage changes to our code and collaborate with others. GitHub is a website that uses Git.
    1.  **Download Git:** Go to the official Git website: [https://git-scm.com/download/win](https://git-scm.com/download/win)
    2.  **Run the Installer:** Double-click the downloaded `.exe` file.
        * You can generally click "Next" through most of the options, accepting the defaults. The default options are usually fine for beginners.
    3.  **Verify Git Installation:** Open a **NEW** PowerShell window. Type:
        ```powershell
        git --version
        ```
        You should see `git version X.X.X`.

4.  **Get the Project Files (Clone the Repository):**
    "Cloning" means making a copy of the entire project from GitHub to your computer.
    1.  **Choose a Location:** Decide where on your computer you want to store the project. A good place might be a new folder called `Projects` directly on your `C:` or `D:` drive (e.g., `C:\Users\YourUser\Projects` or `D:\Projects`).
        * In PowerShell, use `cd` to navigate to your chosen drive (e.g., `D:` then `cd D:\`)
        * Then, `mkdir YourChosenFolderName` (e.g., `mkdir Projects`) and press Enter to create a new folder.
        * Then `cd YourChosenFolderName` (e.g., `cd Projects`) and press Enter to go inside that folder. Your prompt will show your current location.
    2.  **Clone the Project:** In your PowerShell window, inside your chosen folder (e.g., `PS D:\Projects>`), type this command:
        ```powershell
        git clone [https://github.com/KnowitQSS/InternalAI.git](https://github.com/KnowitQSS/InternalAI.git)
        ```
        This will download all the project files into a new folder named `InternalAI` inside your chosen location.
    3.  **Go into the Project Folder:**
        ```powershell
        cd InternalAI
        ```
        Your PowerShell prompt should now look something like `(YourChosenLocation)\InternalAI>`. This is your main project folder!
    4.  **In order to normalise end-of-line between the windows and linux machines run once:**
        ```powershell
        git config --global core.autocrlf true
        ```

5.  **Set Up Your Project Environment (Virtual Environment):**
    A "virtual environment" (or "venv") is like a separate, clean box for your project's Python tools. It keeps this project's tools separate from other Python projects you might work on.
    1.  **Create the Virtual Environment:** While you are in your `InternalAI` project folder (e.g., `PS D:\Projects\InternalAI>`), type:
        ```powershell
        python -m venv venv
        ```
        This creates a new folder named `venv` inside your `InternalAI` project folder.
    2.  **Activate the Virtual Environment:** This step "enters" your clean box, so any Python commands you run will use the tools inside it.
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
        You'll know it worked because your PowerShell prompt will change to include `(venv)` at the beginning, like this: `(venv) PS D:\Projects\InternalAI>`.
        * **Remember:** You need to run this `Activate.ps1` command **every time you open a new PowerShell window** to work on this project.

6.  **Install Project Dependencies (Backend):**
    "Dependencies" are other Python tools or libraries that our InternalAI project (specifically the backend) needs to run.
    1.  **Install Them:** While your `(venv)` is active and you're in your `InternalAI` project folder (e.g., `(venv) PS D:\Projects\InternalAI>`), type:
        ```powershell
        pip install -r requirements.txt
        ```
        This command reads a file called `requirements.txt` which lists all the necessary tools, and `pip` (Python's package installer) will download and install them into your `venv`. This might take a few moments.

7.  **Install Frontend Dependencies (React):**
    The frontend also has its own set of dependencies. You'll need Node.js and npm installed globally for this.
    1.  **Download Node.js:** Go to the official Node.js website: [https://nodejs.org/en/download](https://nodejs.org/en/download)
    2.  **Choose the LTS Version:** Download the "LTS" (Long Term Support) Windows Installer.
    3.  **Run the Installer:** Double-click the downloaded `.msi` file. You can usually click "Next" through most options, accepting the defaults. This will install Node.js and npm.
    4.  **Verify Node.js and npm:** Open a **NEW** PowerShell window. Type:
        ```powershell
        node --version
        npm --version
        ```
        You should see version numbers for both.
    5.  **Go to the `frontend` folder:**
        ```powershell
        cd frontend
        ```
        Your prompt should now be `(venv) PS D:\Projects\InternalAI\frontend>`.
    6.  **Install Frontend Dependencies:**
        ```powershell
        npm install
        ```
        This command reads the `package.json` file in the `frontend` folder and installs all required JavaScript libraries. This might take a few moments.

### 3.2 Setup for Windows (with WSL)

This method involves setting up a Linux environment within Windows using WSL. This can be more streamlined for some development workflows.

1.  **Install WSL (Windows Subsystem for Linux):**
    * WSL lets you run a Linux environment directly on Windows, which is great for development.
    1.  **Open PowerShell as Administrator:**
        * Click the Windows Start button.
        * Type `powershell`.
        * Right-click on "Windows PowerShell" or "PowerShell" in the search results and select "Run as administrator". Confirm if prompted.
    2.  **Install WSL and Ubuntu:**
        * In the Administrator PowerShell window, type:
            ```powershell
            wsl --install
            ```
            * This command will install WSL and set up Ubuntu (a popular Linux distribution) as its default. This might take a few minutes.
            * If it asks you to restart your computer, do so.
    3.  **Set up your Linux username and password:**
        * After restarting, a new Linux terminal window will usually open automatically. It will prompt you to create a username and password for your Linux user. **Remember these!**
    4.  **Install VS Code:**
        * If you don't have it, download and install Visual Studio Code from [https://code.visualstudio.com/](https://code.visualstudio.com/).
    5.  **Install the WSL Extension for VS Code:**
        * Open VS Code.
        * Go to the Extensions view (Ctrl+Shift+X).
        * Search for `WSL` and install the "WSL" extension by Microsoft.

2.  **Set Up Python 3.13 in WSL:**
    * Your backend uses Python. We'll install a specific version in your WSL environment.
    1.  **Open VS Code and connect to WSL:** (Follow section 1.2, step 1)
    2.  **Open a WSL terminal:** (Follow section 1.2, step 2)
    3.  **Add the Python repository (PPA):** This gives us access to newer Python versions.
        ```bash
        sudo add-apt-repository ppa:deadsnakes/ppa -y
        ```
        * `sudo` means "run as administrator". You'll be prompted for your Linux password.
    4.  **Update your package list:**
        ```bash
        sudo apt update
        ```
    5.  **Install Python 3.13 and its virtual environment tool:**
        ```bash
        sudo apt install python3.13 python3.13-venv -y
        ```
    6.  **Verify Python 3.13 installation:**
        ```bash
        python3.13 --version
        ```
        * You should see `Python 3.13.x`.
    7.  **Ensure Python's package installer (pip) is ready:**
        ```bash
        python3.13 -m ensurepip --upgrade
        ```
        * You might see a warning about `pip` not being on PATH, but you can ignore it for now as we'll use `python3.13 -m pip` to run it reliably.

3.  **Install Node.js and npm in WSL:**
    * Your frontend uses Node.js and npm (Node Package Manager). We'll use `nvm` (Node Version Manager) to install them.
    1.  **In your WSL terminal (the same one or a new one):**
    2.  **Install `nvm`:**
        ```bash
        curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh) | bash
        ```
        * After this, **close and then re-open your WSL terminal tab in VS Code** to make sure `nvm` starts correctly.
    3.  **Install a stable Node.js version using `nvm`:**
        * In the *newly opened* WSL terminal:
        ```bash
        nvm install --lts # This installs the latest Long Term Support (LTS) version of Node.js
        nvm use --lts     # This sets that LTS version as the default for your current shell
        ```
    4.  **Verify Node.js and npm installation:**
        ```bash
        node --version
        npm --version
        ```
        * You should see version numbers for both.

4.  **Get the Project Files into WSL:**
    * Now we'll get the project code from GitHub into your WSL environment.
    1.  **Navigate to your home directory in WSL:**
        ```bash
        cd ~
        ```
        * Your prompt should look like `your_username@your_wsl_distro_name:~$`.
    2.  **Create a dedicated folder for your projects:**
        ```bash
        mkdir -p ~/projects
        ```
    3.  **Go into your new projects folder:**
        ```bash
        cd ~/projects
        ```
        * Your prompt should now be `your_username@your_wsl_distro_name:~/projects$`.
    4.  **Clone the project from GitHub:** This will download all the project files into a new folder named `InternalAI` inside `~/projects`.
        ```bash
        git clone [https://github.com/KnowitQSS/InternalAI.git](https://github.com/KnowitQSS/InternalAI.git)
        ```
        * This command creates the `InternalAI` folder automatically.
    5.  **Go into the project folder:**
        ```bash
        cd InternalAI
        ```
        * Your prompt should now be `your_username@your_wsl_distro_name:~/projects/InternalAI$`. This is your main project folder!
    6.  **In order to normalise end-of-line between the windows and linux machines run once:**
        ```powershell
        git config --global core.autocrlf input
        ```
    7.  **Observe that if you are using a bash you need to change your directory by a command like:**
        ```bash
        cd //wsl.localhost/Ubuntu/home/your_username/projects/InternalAI
        ```

5.  **Set Up Python Backend Dependencies:**
    * Your Python backend needs some additional tools to run. We'll install them into a special "virtual environment" for this project.
    1.  **Ensure you are in the `InternalAI` project folder:**
        * Your prompt should be `your_username@your_wsl_distro_name:~/projects/InternalAI$`.
    2.  **Create the Python virtual environment:**
        ```bash
        python3.13 -m venv .venv
        ```
        * This creates a hidden folder named `.venv` inside your project.
    3.  **Activate the virtual environment:**
        ```bash
        source .venv/bin/activate
        ```
        * Your prompt will change to `(venv) your_username@your_wsl_distro_name:~/projects/InternalAI$`, showing it's active.
    4.  **Install backend dependencies:**
        ```bash
        pip install Flask flask-cors playwright pytest
        ```
        * This downloads and installs all the necessary Python libraries. This might take a few moments.
        * (Note: If there's a `requirements.txt` file in your project root, you could also use `pip install -r requirements.txt`.)

6.  **Set Up Frontend Dependencies:**
    * Your React frontend also needs its own tools.
    1.  **Go to the `frontend` folder:**
        ```bash
        cd frontend
        ```
        * Your prompt should now be `(venv) your_username@your_wsl_distro_name:~/projects/InternalAI/frontend$`.
    2.  **Install frontend dependencies:**
        ```bash
        npm install
        ```
        * This command reads the `package.json` file in the `frontend` folder and installs all required JavaScript libraries into a `node_modules` folder. This might take a few moments.

---

## 4. Making Changes & Contributing (Your First Steps with Git)

### The Idea of Branches

Imagine the project's code as a tree with a `main` branch (the stable, main version). When you want to work on something new or fix a bug, you don't work directly on `main`. Instead, you create a "new branch" from `main`.

Think of your branch as your **personal workspace**. You can make all the changes you want on your branch without affecting the `main` code or other people's work until you're ready.

### Step A: Start Your Own Workspace (Create a New Branch)

Before you start making any changes, always create a new branch.

1.  **Go to the Project Root:** Make sure your PowerShell/WSL terminal prompt is in your project's main `InternalAI` folder. If you're in a subfolder (like `backend` or `frontend`), type `cd ..` until you are in the `InternalAI` folder.

2.  **Create and Switch to a New Branch:**
    ```bash
    git checkout -b your-new-feature-branch-name
    ```
    * Replace `your-new-feature-branch-name` with a short, descriptive name for what you're working on (e.g., `add-user-auth`, `fix-login-bug`, `update-readme`).
    * You'll see a message like "Switched to a new branch 'your-new-feature-branch-name'".

### Step B: Make Your Code Changes

* Now, use your code editor (like VS Code, Notepad++, etc.) to open the project files (e.g., `C:\Path\To\Your\InternalAI\backend\app.py` or `C:\Path\To\Your\InternalAI\frontend\src\App.js` for Windows, or `/home/your_username/projects/InternalAI/backend/app.py` for WSL).
* Make the changes you want.
* **Save your files** normally.

### Step C: Save Your Changes (Commit)

After you've made some changes and saved your files, you need to tell Git about them.

1.  **Check What Git Sees:**
    ```bash
    git status
    ```
    This command shows you:
    * Files you've changed but haven't told Git to track yet (like new files, or modifications to existing files).
    * Files that are "staged" (ready for your snapshot).

2.  **Stage Your Changes (Prepare for the Snapshot):**
    This tells Git, "Hey, these are the specific changes I want to include in my next saved version."
    ```bash
    git add .
    ```
    The `.` (dot) means "add all changes in the current folder and its subfolders."

    Run `git status` again. Now your changes should be listed under "Changes to be committed."

3.  **Commit Your Changes (Take the Snapshot):**
    This creates a permanent record (a "commit") of your staged changes in your branch's history.
    ```bash
    git commit -m "A short, clear message about what you changed"
    ```
    * Replace `"A short, clear message about what you changed"` with a brief summary.
        * **Good examples:** "feat: Add new user registration endpoint", "fix: Correct calculation bug in AI module", "docs: Update README with setup instructions".
        * **Bad examples:** "stuff", "changes", "oops".

### Step D: Share Your Changes (Push)

Committing saves changes to your computer. To send them to your branch on GitHub, you need to "push" them.

1.  **Push to GitHub:**
    ```bash
    git push --set-upstream origin your-new-feature-branch-name
    ```
    * The first time you push a new branch, you need the `--set-upstream origin your-new-feature-branch-name` part. This tells Git to link your local branch to a new one on GitHub.
    * After the first push, you can usually just use `git push`.

    **What if it's rejected? (`non-fast-forward` error)**
    If `git push` fails with a message like `! [rejected] (non-fast-forward)`, it means someone else updated the branch on GitHub since you last got changes.
    * **Solution:** First, get their changes: `git pull`.
    * Then, try to `git push` again. If Git says there are conflicts, you might need help resolving them (don't worry, it's normal!).

### Step E: Propose Your Changes (Pull Request)

Once your changes are on your branch on GitHub, you create a Pull Request (PR). This is how you ask for your changes to be reviewed and eventually merged into the `main` branch.

1.  **Go to GitHub:** Open your web browser and go to your project's GitHub page: `https://github.com/KnowitQSS/InternalAI`
2.  **Look for the PR button:** GitHub will usually show a green banner like "your-new-feature-branch-name had recent pushes. Compare & pull request." Click this button.
3.  **Set Branches:** Make sure the "base" branch is `main` (where you want your changes to go) and the "compare" branch is your `your-new-feature-branch-name`.
4.  **Add a Title & Description:** Give your PR a clear title and explain what your changes do.
5.  **Create Pull Request:** Click the green button.

## Note:
-Just a friendly reminder about something important when you add new tools (which we call "packages") to your project's main code.
If you or someone on your team adds a new package, like xlsx or papaparse (which are tools for handling spreadsheets or data), your colleagues won't automatically have these tools on their computers.

### What happens if they don't update?

They might see an error like this when they try to run the code:

"Module not found: Error: Can't resolve 'xlsx'"
"Module not found: Error: Can't resolve 'papaparse'"

This simply means their computer can't find the new tool the code is trying to use.

### The Fix:
To make sure everyone's code works smoothly after new packages are added, your teammates just need to run one simple command in their terminal (while inside the frontend folder of the project):

```
npm install 
```
This command tells their computer, "Hey, go check our project's list of tools (package.json) and install any new ones, or update existing ones, that I don't have yet!" It's like updating their toolbox.

---------------------------------------------------------------------------------------------------------------------------

Now, others can review your code!

---

## 5. Creating a New Release Tag

Git tags are like permanent bookmarks that point to specific commits in your repository's history. They are typically used to mark release points (e.g., `v1.0.0`, `v1.0.1`).

### When to Create a Tag

* When you have finished a set of changes that constitute a new version of the software.
* After your changes have been merged into the `main` branch (or your designated release branch).

### Best Practices for Tag Naming

It's highly recommended to use [Semantic Versioning](https://semver.org/) for your tags, which follows the pattern `MAJOR.MINOR.PATCH` (e.g., `v1.0.0`, `v1.2.3`).

### How to Create and Push a Tag

1.  **Ensure you are on the `main` branch and it's up-to-date:**
    First, navigate to your project's root directory in your terminal (PowerShell or WSL).
    ```bash
    git checkout main
    git pull origin main
    ```
    This ensures your local `main` branch has the latest changes from GitHub.

2.  **Create the Tag:**
    We recommend using **annotated tags** as they store metadata like the tagger name, email, and date, and can have a message.
    ```bash
    git tag -a v1.0.0 -m "Release version 1.0.0 - Initial stable release"
    ```
    * Replace `v1.0.0` with your desired version number (e.g., `v1.0.1`, `v2.0.0`).
    * Replace `"Release version 1.0.0 - Initial stable release"` with a brief, descriptive message for this release.

3.  **Push the Tag to GitHub:**
    Tags are not pushed automatically with your commits. You need to explicitly push them.
    ```bash
    git push origin v1.0.0
    ```
    * Replace `v1.0.0` with the tag name you just created.

    To push *all* your local tags to the remote (if you've created several):
    ```bash
    git push origin --tags
    ```

### Viewing Tags

* **List all local tags:**
    ```bash
    git tag
    ```
* **View details of a specific tag:**
    ```bash
    git show v1.0.0
    ```

### Deleting Tags (If Necessary)

Sometimes you might need to remove a tag if it was created incorrectly.

1.  **Delete a local tag:**
    ```bash
    git tag -d v1.0.0
    ```
2.  **Delete a remote tag on GitHub:**
    You must first delete it locally, then push the deletion to the remote.
    ```bash
    git push origin :refs/tags/v1.0.0
    # Or more simply:
    # git push origin --delete v1.0.0
    ```

---

## 6. Troubleshooting Common Issues

* **Windows specific issues:**
    * **`python` is not recognized:**
        * Make sure you checked "Add Python.exe to PATH" during installation.
        * Restart your PowerShell window or even your computer.
        * If still not working, you might need to manually add Python to your system's PATH. (Search online for "add python to path windows" if this happens).
    * **`pip` is not recognized / `No module named venv`:**
        * This usually means Python wasn't installed correctly or its path isn't set. Re-check Step 3.1 - Install Python.
    * **`(venv) PS C:\Path\To\Your\InternalAI\Project> ` doesn't show `(venv)`:**
        * You forgot to run `.\venv\Scripts\Activate.ps1`. Run it again in your PowerShell window. Remember to do this every time you start a new session.
    * **`npm` is not recognized:**
        * You might not have Node.js and npm installed. You can download them from [https://nodejs.org/](https://nodejs.org/). `npm` usually comes with Node.js.

* **WSL specific issues:**
    * **`python3.13` is not found or `pip` is not recognized:**
        * Double-check that you added the `deadsnakes` PPA and ran `sudo apt update` and `sudo apt install python3.13 python3.13-venv -y` in your WSL terminal.
        * Ensure you ran `python3.13 -m ensurepip --upgrade`.
    * **`(venv)` doesn't show in my prompt:**
        * You forgot to run `source ../.venv/bin/activate` in your Python project directory. Remember to do this every time you open a new terminal tab for the backend.
    * **`node` or `npm` commands are not recognized:**
        * Ensure you installed `nvm` and then ran `nvm install --lts` and `nvm use --lts` in your WSL terminal. Remember to open a new terminal after installing `nvm`.

* **General project issues:**
    * **Frontend errors like "Module not found: Error: Can't resolve 'react-router-dom'":**
        * This means a JavaScript package is missing. While in your `frontend` directory, run `npm install <missing-package-name>` (e.g., `npm install react-router-dom`) or simply `npm install` again to re-check all dependencies.
    * **Backend errors like "ModuleNotFoundError: No module named 'flask_cors'":**
        * This means a Python package is missing. While your virtual environment is active in the project root or backend folder, run `pip install <missing-package-name>` (e.g., `pip install flask-cors`).
    * **`git push` gives `non-fast-forward` error:**
        * See "Step D: Share Your Changes (Push)" above. You need to `git pull` first.

---

We're excited to have you contribute to InternalAI! If you get stuck at any point, don't hesitate to ask for help. Good luck!
