# InternalAI Project

Welcome to the InternalAI project!

Don't worry if you've never coded before or used GitHub – this guide is made for you! We'll walk you through everything you need to get started, step-by-step.

For styling, you can reference Knowit's [Visual Identity Guidelines](https://www.knowit.se/globalassets/brand-book/2024-assets/knowitvisuald240828.pdf)

---

## 📁 Project Structure

Here's how the InternalAI project is organized:

```
InternalAI/
├── 📁 .github/
│   └── 📁 workflows/
│       └── azure-deployment.yml     # CI/CD pipeline configuration
├── 📁 backend/                      # Flask API server
│   ├── app.py                       # Main Flask application
│   ├── test_app.py                  # Tests for Flask routes and API endpoints
│   └── requirements.txt             # Python dependencies
├── 📁 frontend/                     # React web application
│   ├── 📁 public/
│   │   ├── index.html              # HTML template
│   │   ├── team.json               # Team member data
│   │   ├── favicon.ico             # Website icon
│   │   └── 📁 img/                 # Team member photos
│   ├── 📁 src/                     # React source code
│   │   ├── App.js                  # Main React component
│   │   ├── App.css                 # Global styles
│   │   ├── index.js                # React entry point
│   │   └── 📁 components/          # Reusable React components
│   ├── 📁 e2e/                     # End-to-end tests (Playwright)
│   │   ├── home_page.spec.js
│   │   ├── team_data.spec.js
│   │   └── team_page.spec.js
│   ├── package.json                # Frontend dependencies & scripts
│   └── package-lock.json           # Dependency lock file
├── 📄 README.md                    # Project documentation (this file)
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .gitattributes              # Git file handling rules
├── 📄 startup.sh                   # Azure deployment startup script
└── 📄 web.config                   # IIS/Azure configuration
```

### 🏗️ Architecture Overview

**Full-Stack Structure:**
- **Frontend (React)**: Modern web interface built with React, served statically
- **Backend (Flask)**: Python API server that serves the React app and provides API endpoints
- **Deployment**: Single Azure App Service that serves both frontend and backend
- **Database**: Currently file-based (team.json), ready for database integration

**Development Workflow:**
1. **Frontend**: React development server (`npm start`) on port 3000
2. **Backend**: Flask development server (`python app.py`) on port 5000  
3. **Production**: Combined deployment where Flask serves React build files

**Key Folders Explained:**
- `backend/` - All server-side Python code and configurations
- `frontend/src/` - React components, pages, and client-side logic
- `frontend/public/` - Static assets (images, data files, icons)
- `frontend/e2e/` - Automated browser tests using Playwright
- `.github/workflows/` - Automated deployment and testing pipelines

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
6.  [CI-CD (Continuous Integration and Continuous Deployment)](#6-ci-cd-continuous-integration-and-continuous-deployment)
7.  [Troubleshooting Common Issues](#7-troubleshooting-common-issues)

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

    OR you can run
    ```powershell
    python app.py
    ```
    Both commands start Flask's built-in development server but the second version is simpler to set up and easier for testing and debugging.

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
10. **Install frontend dependencies (if not already done):**
    ```powershell
    npm install
    ```
11. **Start the React development server:**
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

    OR you can run
    ```bash
    python app.py
    ```
    Both commands start Flask's built-in development server but the second version is simpler to set up and easier for testing and debugging.

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
10. **Ensure Python command works (one-time setup):**
    ```bash
    sudo apt install python-is-python3
    ```
    * This ensures `python` command points to `python3` (required for Flask)
11. **Install frontend dependencies (if not already done):**
    ```bash
    npm install
    ```
12. **Start the React development server:**
    ```bash
    npm start
    ```
    * This will usually automatically open your web browser to `http://localhost:3000` (or another port if 3000 is taken) and show your React application. Keep this terminal tab open and running. To stop the server, press `Ctrl + C`.
13. **Alternative super lazy start using aliases**
    In your environment there is .bashrc file that you find on the same level as your username. Open it in any editor (or write: nano ~/.bashrc) and add these lines at the bottom of the file, save and close:
 ```   
 # InternalAI Development Aliases

# Backend setup and run
alias backend="cd ~/projects/InternalAI && source .venv/bin/activate && cd backend && python3 app.py"

# Frontend setup and run  
alias frontend="cd ~/projects/InternalAI/frontend && npm start"

# Project navigation
alias proj="cd ~/projects/InternalAI"

# Git shortcuts for the project
alias gstatus="cd ~/projects/InternalAI && git status"
alias gcommit="cd ~/projects/InternalAI && git add . && git commit -m"
alias gfresh="cd ~/projects/InternalAI && git pull origin main"
alias gdeploy="cd ~/projects/InternalAI && git add . && git commit -m 'Deploy updates' && git push origin main"

# Environment info
alias envinfo="cd ~/projects/InternalAI && source .venv/bin/activate && echo '📁 Project: InternalAI' && echo '🐍 Python:' && python3 --version && echo '📦 Flask:' && pip show flask | grep Version && echo '⚛️  Node:' && node --version && echo '📦 npm:' && npm --version"
 ```
 now restart your WSL and you can use the aliases. Just writing 'backend' for instance gets you in the correct directory, run the activate script and starts app.py

---

## 2. Running Tests

The InternalAI frontend uses two types of tests for comprehensive coverage:
- **Jest Unit Tests** for component testing (using React Testing Library)
- **Playwright E2E Tests** for end-to-end testing

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

#### **Unit Tests (Jest + React Testing Library):**
3.  **Run unit tests:**
    ```bash
    npm test
    ```
    * This command will start Jest in **watch mode**. By default, it tries to run tests related to files changed since your last Git commit.
    * If you see "No tests found related to files changed since last commit.", simply **press `a` then Enter** at the prompt to run all tests.
    * To run all tests **immediately without entering watch mode** (e.g., for CI/CD pipelines or a quick full run), you can use:
        ```bash
        npm run test:all
        ```

#### **End-to-End Tests (Playwright):**
4.  **Run E2E tests:**
    ```bash
    npm run test:e2e
    ```
    * This command runs Playwright tests that simulate real user interactions with your application.
    * These tests run in headless browsers and test the full application flow.

#### **Backend Tests (pytest):**
5.  **Run backend tests:**
    
    **For WSL:**
    ```bash
    # Navigate to project root and activate virtual environment
    cd ~/projects/InternalAI
    source .venv/bin/activate
    
    # Install testing dependencies (first time only)
    pip install pytest pytest-cov pytest-flask
    
    # Navigate to backend directory  
    cd backend
    
    # Run tests
    pytest
    
    # OR run with verbose output:
    pytest -v
    
    # OR run with coverage (like CI/CD):
    pytest --cov=. --cov-report=xml --cov-report=term-missing
    ```
    
    **For Windows:**
    ```powershell
    # Navigate to project root and activate virtual environment
    cd C:\Path\To\Your\InternalAI\Project
    .\venv\Scripts\Activate.ps1
    
    # Install testing dependencies (first time only)
    pip install pytest pytest-cov pytest-flask
    
    # Navigate to backend directory
    cd backend
    
    # Run tests
    pytest
    ```
    
    * These tests verify the Flask API endpoints and backend functionality
    * Tests are located in `backend/test_*.py` files
    * Use `-v` flag for detailed output showing each test that runs

#### **Code Quality Checks (ESLint):**
6.  **Run ESLint for code quality analysis:**
    
    **Navigate to the frontend directory:**
    ```bash
    cd ~/projects/InternalAI/frontend
    ```
    
    **Run ESLint (same as pipeline):**
    ```bash
    npx eslint src/ --format=compact --max-warnings=0
    ```
    
    **Alternative ESLint commands:**
    ```bash
    # More detailed output showing what files were checked
    npx eslint src/ --format=stylish
    
    # Check specific file only
    npx eslint src/App.test.js --format=compact --max-warnings=0
    
    # Check specific file with detailed output
    npx eslint src/App.test.js --format=stylish
    ```
    
    **Expected Results:**
    - **No output** = No errors found ✅
    - **Error output** = Code quality issues found ❌
    
    **Note:** ESLint checks for code quality, best practices, and Testing Library usage patterns. The pipeline uses the same commands, so running locally helps catch issues before pushing code.

### 2.2 Where to Add New Tests

#### **Unit Tests (Jest):**
* **Frontend (React) Unit Tests:**
    * Unit tests should be located in the `frontend/src/` directory.
    * For a component named `MyComponent.js` (or `.jsx`, `.ts`, `.tsx`), its unit tests should be in a file named `MyComponent.test.js` (or `MyComponent.test.jsx`, `MyComponent.test.ts`, `MyComponent.test.tsx`) in the **same directory** as the component.
    * Example File Structure:
        ```
        frontend/src/
        ├── App.js
        ├── App.test.js        <-- Unit test file for App.js
        ├── components/
        │   ├── MyButton.js
        │   └── MyButton.test.js <-- Unit test file for MyButton.js
        └── pages/
            └── HomePage.js
            └── HomePage.test.js <-- Unit test file for HomePage.js
        ```
    * `react-scripts` (which `npm test` uses) automatically finds files with `.test.js`, `.spec.js`, etc., suffixes within the `src` directory.

#### **End-to-End Tests (Playwright):**
* **E2E Tests:**
    * E2E tests are located in the `frontend/e2e/` directory.
    * Use `.spec.js` extension for consistency with Playwright conventions.
    * Current E2E test structure:
        ```
        frontend/e2e/
        ├── home_page.spec.js    <-- Tests for home page functionality
        ├── team_data.spec.js    <-- Tests for team data validation
        └── team_page.spec.js    <-- Tests for team page interactions
        ```
    * Playwright (which `npm run test:e2e` uses) automatically finds `.spec.js` files within the `e2e` directory.

#### **Backend Tests (pytest):**
* **Backend (Flask) Unit Tests:**
    * Backend tests should be located in the `backend/` directory.
    * Test files must start with `test_` prefix (e.g., `test_app.py`, `test_api.py`)
    * Current backend test structure:
        ```
        backend/
        ├── app.py              # Main Flask application
        ├── test_app.py         # Tests for Flask routes and API endpoints
        └── requirements.txt    # Python dependencies
        ```
    * `pytest` automatically finds files with `test_*.py` pattern within the `backend` directory.

### 2.3 Test Types Summary

| Test Type | Command | Purpose | Location | Extension |
|-----------|---------|---------|----------|-----------|
| **Unit Tests** | `npm test` | Component testing | `frontend/src/` | `.test.js` |
| **E2E Tests** | `npm run test:e2e` | Full app testing | `frontend/e2e/` | `.spec.js` |
| **Backend Unit Tests** | `pytest` | API/backend testing | `backend/` | `test_*.py` |
| **Code Quality** | `npx eslint src/` | Code analysis & linting | `frontend/src/` | `.js` files |

**Testing Dependencies Installation:**
- **Frontend**: Dependencies installed automatically with `npm install`
- **Backend**: Install with `pip install pytest pytest-cov pytest-flask` (one-time setup)

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
        You should see `Python 3.x.x` (e.g., `Python 3.11.x`). If you get an error, close PowerShell, restart your computer, and try again.

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
        git clone https://github.com/KnowitQSS/InternalAI.git
        ```
        This will download all the project files into a new folder named `InternalAI` inside your chosen location.
    3.  **Go into the Project Folder:**
        ```powershell
        cd InternalAI
        ```
        Your PowerShell prompt should now look something like `PS (YourChosenLocation)\InternalAI>`. This is your main project folder!
    4.  **Configure Git for line endings:**
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
    "Dependencies" are other Python tools or libraries that our InternalAI project needs to run.
    1.  **Install Them:** While your `(venv)` is active and you're in your `InternalAI` project folder (e.g., `(venv) PS D:\Projects\InternalAI>`), type:
        ```powershell
        pip install -r backend/requirements.txt
        ```
        This command reads the `requirements.txt` file in the `backend` folder which lists all the necessary tools, and `pip` (Python's package installer) will download and install them into your `venv`. This might take a few moments.

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

2.  **Set Up Python 3.11 in WSL:**
    * Your backend uses Python 3.11 (to match the production environment). We'll install this specific version in your WSL environment.
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
    5.  **Install Python 3.11 and its virtual environment tool:**
        ```bash
        sudo apt install python3.11 python3.11-venv python3.11-dev -y
        ```
    6.  **Make 'python' command point to Python 3.11:**
        ```bash
        sudo apt install python-is-python3 -y
        ```
    7.  **Verify Python 3.11 installation:**
        ```bash
        python3.11 --version
        python --version
        ```
        * You should see `Python 3.11.x` for both commands.

3.  **Install Node.js and npm in WSL:**
    * Your frontend uses Node.js and npm (Node Package Manager). We'll use `nvm` (Node Version Manager) to install them.
    1.  **In your WSL terminal (the same one or a new one):**
    2.  **Install `nvm`:**
        ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
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
        git clone https://github.com/KnowitQSS/InternalAI.git
        ```
        * This command creates the `InternalAI` folder automatically.
    5.  **Go into the project folder:**
        ```bash
        cd InternalAI
        ```
        * Your prompt should now be `your_username@your_wsl_distro_name:~/projects/InternalAI$`. This is your main project folder!
    6.  **Configure Git for line endings:**
        ```bash
        git config --global core.autocrlf input
        ```

5.  **Set Up Python Backend Dependencies:**
    * Your Python backend needs some additional tools to run. We'll install them into a special "virtual environment" for this project.
    1.  **Ensure you are in the `InternalAI` project folder:**
        * Your prompt should be `your_username@your_wsl_distro_name:~/projects/InternalAI$`.
    2.  **Create the Python virtual environment:**
        ```bash
        python3.11 -m venv .venv
        ```
        * This creates a hidden folder named `.venv` inside your project.
    3.  **Activate the virtual environment:**
        ```bash
        source .venv/bin/activate
        ```
        * Your prompt will change to `(venv) your_username@your_wsl_distro_name:~/projects/InternalAI$`, showing it's active.
    4.  **Install backend dependencies:**
        ```bash
        pip install -r backend/requirements.txt
        ```
        * This reads the `requirements.txt` file in the `backend` folder and installs all necessary Python libraries. This might take a few moments.

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

### Step A: Start Fresh (Get Latest Changes)

Before creating a new branch, always make sure you have the latest version of the project.

1.  **Go to the Project Root:** Make sure your PowerShell/WSL terminal prompt is in your project's main `InternalAI` folder. If you're in a subfolder (like `backend` or `frontend`), type `cd ..` until you are in the `InternalAI` folder.

2.  **Check which branch you're on:**
    ```bash
    git branch
    ```
    * You should see `* main` (the asterisk shows your current branch). If not, switch to main: `git checkout main`

3.  **Get the latest changes from GitHub:**
    ```bash
    git pull origin main
    ```
    * This downloads any new changes that others have made since you last updated.

### Step B: Start Your Own Workspace (Create a New Branch)

Now create your personal workspace for the changes you want to make.

1.  **Create and Switch to a New Branch:**
    ```bash
    git checkout -b your-feature-name
    ```
    * Replace `your-feature-name` with a short, descriptive name for what you're working on:
        * **Good examples:** `add-user-auth`, `fix-login-bug`, `update-readme`, `team-page-design`
        * **Bad examples:** `test`, `stuff`, `branch1`
    * You'll see a message like "Switched to a new branch 'your-feature-name'".

2.  **Verify you're on the right branch:**
    ```bash
    git branch
    ```
    * You should now see `* your-feature-name` (with the asterisk).

### Step C: Make Your Code Changes

* Now, use your code editor (like VS Code) to open the project files and make your changes.
* **Examples of files you might edit:**
    * `backend/app.py` - For backend/API changes
    * `frontend/src/App.js` - For frontend/React changes
    * `README.md` - For documentation updates
* Make the changes you want.
* **Save your files** normally.

### Step D: Save Your Changes (Commit)

After you've made some changes and saved your files, you need to tell Git about them.

1.  **Check What Git Sees:**
    ```bash
    git status
    ```
    This command shows you:
    * Files you've changed (in red)
    * Files that are "staged" and ready to commit (in green)

2.  **Stage Your Changes (Prepare for the Snapshot):**
    This tells Git which changes to include in your next save.
    ```bash
    git add .
    ```
    * The `.` (dot) means "add all changes in the current folder and its subfolders."
    * **Alternative:** To add specific files only: `git add filename.txt`

    Run `git status` again. Now your changes should be listed in green under "Changes to be committed."

3.  **Commit Your Changes (Take the Snapshot):**
    This creates a permanent record of your changes in your branch's history.
    ```bash
    git commit -m "Brief description of what you changed"
    ```
    * **Good commit message examples:**
        * `"feat: Add user registration form"`
        * `"fix: Correct login button alignment"`
        * `"docs: Update setup instructions in README"`
    * **Bad commit message examples:** `"stuff"`, `"changes"`, `"oops"`

### Step E: Share Your Changes (Push)

Committing saves changes to your local computer. To send them to GitHub, you need to "push" them.

1.  **Push to GitHub:**
    ```bash
    git push --set-upstream origin your-feature-name
    ```
    * **Important:** Replace `your-feature-name` with the exact same name you used when creating your branch in Step B.
    * The first time you push a new branch, you need the `--set-upstream origin your-feature-name` part. This creates the branch on GitHub.
    * After the first push, you can usually just use `git push`.

2.  **What if it's rejected? (`non-fast-forward` error)**
    If `git push` fails with a message like `! [rejected] (non-fast-forward)`, it means someone else updated the main branch since you created your branch.
    * **Solution 1:** Get their changes: `git pull origin main`
    * **Solution 2:** If that doesn't work, ask for help - merge conflicts can be tricky for beginners!

### Step F: Propose Your Changes (Pull Request)

Once your changes are on GitHub, create a Pull Request (PR) to ask for your changes to be reviewed and merged into the `main` branch.

1.  **Go to GitHub:** Open your web browser and go to your project's GitHub page: `https://github.com/KnowitQSS/InternalAI`

2.  **Look for the PR Banner:** GitHub will usually show a yellow banner like:
    ```
    your-feature-name had recent pushes [Compare & pull request]
    ```
    Click the green **"Compare & pull request"** button.

3.  **Set Up Your Pull Request:**
    * **Base branch:** Should be `main` (where you want your changes to go)
    * **Compare branch:** Should be `your-feature-name` (your branch)
    * **Title:** Give it a clear title describing what you did
    * **Description:** Explain what you changed and why

4.  **Create Pull Request:** Click the green **"Create pull request"** button.

5.  **What happens next:**
    * Others can review your code
    * You might get feedback or requests for changes
    * Once approved, someone will merge your changes into `main`
    * Your changes will then be deployed automatically!

### 🔧 Helpful Git Commands for Daily Use

**Check your current status:**
```bash
git status          # See what's changed
git branch          # See which branch you're on
```

**Switch between branches:**
```bash
git checkout main               # Switch to main branch
git checkout your-feature-name  # Switch to your feature branch
```

**Make more changes to your branch:**
```bash
git add .
git commit -m "More improvements"
git push                        # After first push, this is all you need
```

### 📦 Important Note About Adding New Packages

**If you add new tools (packages) to the project**, your teammates need to install them too!

**For Frontend packages** (like `xlsx` or `papaparse`):
* When you add: `npm install package-name`
* Teammates need to run: `npm install` (in the `frontend` folder)

**For Backend packages** (like `flask-cors` or `requests`):
* When you add: `pip install package-name` 
* Then update: `pip freeze > backend/requirements.txt`
* Teammates need to run: `pip install -r backend/requirements.txt`

**What happens if they don't update?**
They'll see errors like:
```
Module not found: Error: Can't resolve 'xlsx'
ModuleNotFoundError: No module named 'requests'
```

**The fix is simple:** Run the install commands above to update their toolbox!

### 💡 Pro Tips for Beginners

1. **Always start from `main`** - Follow Step A every time
2. **Use descriptive branch names** - You'll thank yourself later
3. **Commit often** - Small commits are easier to understand
4. **Ask for help** - Git can be confusing at first, and that's normal!
5. **Don't work directly on `main`** - Always use branches

**Remember:** This workflow keeps everyone's changes organized and prevents conflicts. It might seem like extra steps at first, but it makes collaboration much smoother!

---

## 5. Creating a New Release Tag

Git tags are like permanent bookmarks that point to specific commits in your repository's history. They mark important milestones in your project's development, typically stable release points that you can always go back to.

### 🎯 What Are Release Tags For?

In the InternalAI project, tags serve several purposes:
- **Mark stable versions** of your application
- **Create reference points** for bug fixes and rollbacks  
- **Generate GitHub releases** with changelogs
- **Track project evolution** over time
- **Communicate progress** to stakeholders

### ⚠️ Who Should Create Tags?

**Important:** Tags should typically be created by:
- Project maintainers
- Senior developers
- Team leads

**Not everyone needs to create tags** - they represent official releases, not individual feature completions.

### 📅 When to Create a Tag

Create a new tag when you have:
- **Completed a significant feature** or set of features
- **Fixed critical bugs** that warrant a new release
- **Reached a project milestone** (MVP, beta, production-ready)
- **Merged multiple pull requests** that together constitute a release
- **Thoroughly tested** the current `main` branch

**Always tag AFTER**:
- ✅ All changes are merged into `main`
- ✅ CI/CD pipeline has successfully deployed
- ✅ Basic testing confirms everything works
- ✅ Team agrees the version is stable

### 🏷️ Semantic Versioning Guidelines

This project uses [Semantic Versioning](https://semver.org/) with the pattern `MAJOR.MINOR.PATCH` (e.g., `v1.2.3`):

| Version Part | When to Increment | Example |
|--------------|-------------------|---------|
| **MAJOR** (v**2**.0.0) | Breaking changes, major redesigns | Complete UI overhaul, API changes |
| **MINOR** (v1.**3**.0) | New features, significant enhancements | New team member page, API endpoints |
| **PATCH** (v1.2.**4**) | Bug fixes, small improvements | Fix login bug, update styling |

**Project-Specific Examples:**
- `v0.1.0` - Initial MVP with basic functionality
- `v0.2.0` - Added team management features  
- `v0.2.1` - Fixed team page loading bug
- `v1.0.0` - First production-ready release
- `v1.1.0` - Added user authentication
- `v1.1.1` - Fixed authentication redirect bug

### 📋 How to Create and Push a Tag

**Step 1: Prepare Your Environment**
Navigate to your project's root directory in your terminal:
```bash
cd ~/projects/InternalAI  # For WSL
# OR
cd C:\Path\To\Your\InternalAI  # For Windows
```

**Step 2: Ensure You're on Latest Main**
```bash
git checkout main
git pull origin main
```
This ensures you're tagging the latest stable version.

**Step 3: Create an Annotated Tag**
```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release

- Added complete team management system
- Implemented responsive design
- Integrated with Azure deployment
- Added comprehensive testing
- Fixed all known bugs from beta"
```

**Key points:**
- Replace `v1.0.0` with your chosen version number
- Use a **descriptive message** that summarizes what's new
- **Multi-line messages** are encouraged for significant releases

**Step 4: Verify Your Tag**
```bash
git tag -l
git show v1.0.0
```
This shows all tags and details of your new tag.

**Step 5: Push the Tag to GitHub**
```bash
git push origin v1.0.0
```

**Alternative - Push all local tags:**
```bash
git push origin --tags
```

### 📊 Viewing and Managing Tags

**List all tags:**
```bash
git tag                    # Simple list
git tag -l "v1.*"         # Filter by pattern
```

**View tag details:**
```bash
git show v1.0.0           # Shows commit, message, and changes
git log --oneline v1.0.0  # Shows commit history up to this tag
```

**Compare tags:**
```bash
git diff v1.0.0..v1.1.0   # See changes between versions
```

### 🗑️ Deleting Tags (If Necessary)

Sometimes you need to remove an incorrect tag:

**Delete local tag:**
```bash
git tag -d v1.0.0
```

**Delete remote tag from GitHub:**
```bash
git push origin --delete v1.0.0
# OR
git push origin :refs/tags/v1.0.0
```

**⚠️ Warning:** Deleting published tags can confuse team members and break dependencies!

### 🚀 Creating GitHub Releases

After pushing your tag, you can create a GitHub Release:

1. Go to `https://github.com/KnowitQSS/InternalAI/releases`
2. Click **"Create a new release"**
3. Select your tag from the dropdown
4. Add a release title: `InternalAI v1.0.0`
5. Write release notes describing:
   - New features
   - Bug fixes  
   - Breaking changes
   - Upgrade instructions
6. Click **"Publish release"**

### 💡 Best Practices

**Tag Naming:**
- ✅ `v1.0.0`, `v1.2.3` (with 'v' prefix)
- ❌ `release-1.0`, `version1`, `stable`

**Tag Messages:**
- ✅ Be specific: "Add user authentication system"
- ❌ Generic: "New release", "Updates"

**Timing:**
- ✅ Tag after successful deployment and testing
- ❌ Tag immediately after development

**Communication:**
- ✅ Announce new releases to the team
- ✅ Update documentation
- ❌ Create tags without telling anyone

### 🔗 Integration with Your Workflow

**Typical Release Process:**
1. Complete feature development
2. Merge all PRs into `main`
3. Verify CI/CD deployment succeeds
4. Test the deployed application
5. Create and push tag
6. Create GitHub release
7. Communicate release to stakeholders

**Remember:** Tags mark stable points in your project's history. Take time to ensure the code is truly ready before tagging!

---
## 6. CI-CD (Continuous Integration and Continuous Deployment)
# 🚀 **GitHub Actions Pipeline Triggers**

## 🎯 **When the Pipeline Runs**

Looking at `.github/workflows/azure-deployment.yml`, the pipeline is configured to run on:

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
```

### ✅ **Automatic Triggers:**

1. **Push to main branch** - 🚀 **DEPLOYS TO AZURE**
   ```bash
   git push origin main
   # OR
   gdeploy  # (using your alias)
   ```

2. **Pull Request to main branch** - 🧪 **BUILDS & TESTS ONLY**
   ```bash
   # When you create a PR targeting main branch
   # Pipeline runs but doesn't deploy
   ```

3. **Manual Trigger** - 🎮 **MANUAL DEPLOYMENT**
   ```bash
   # Can be triggered manually from GitHub Actions tab
   # Go to Actions → Select workflow → Run workflow
   ```

## 🔄 **What Happens Automatically**

### 📤 **On Push to Main:**
```
You push → GitHub detects push → Pipeline starts → Full deployment
```

**Pipeline Steps (All Automatic):**
1. ✅ **Checkout code** from your repository
2. ✅ **Setup Node.js 18** and cache npm dependencies
3. ✅ **Build React app** (npm ci, npm run build)
4. ✅ **Setup Python 3.11** and cache pip dependencies
5. ✅ **Install Flask dependencies** from requirements.txt
6. ✅ **Integrate React with Flask** (copy build to templates/static)
7. ✅ **Create deployment package** with dummy startup.sh
8. ✅ **Deploy to Azure** App Service
9. ✅ **Your app is live** at `https://qss-ai-webapp.azurewebsites.net`

### 🧪 **On Pull Request:**
```
You create PR → GitHub detects PR → Pipeline starts → Build & test only
```

**Pipeline Steps (No Deployment):**
1. ✅ **Checkout code** from PR branch
2. ✅ **Build React app** (test if it builds successfully)
3. ✅ **Setup Python** and install Flask dependencies
4. ✅ **Integration test** (verify React + Flask integration works)
5. ❌ **Skip deployment** (only builds/tests, no Azure deployment)

## 🎯 **Deployment Conditions**

### 🚀 **WILL Deploy:**
- ✅ **Direct push to main**
- ✅ **Merge PR into main**
- ✅ **Any commit to main branch**
- ✅ **Manual workflow dispatch**

### 🧪 **WON'T Deploy (Test Only):**
- ❌ **Push to feature branch**
- ❌ **Open PR (not merged yet)**
- ❌ **Push to any branch except main**

## 📋 **Common Development Scenarios**

### Scenario 1: Direct Push (Most Common)
```bash
# You make changes and push directly
git add .
git commit -m "Add new feature"
git push origin main
# → Pipeline runs → Deploys to Azure ✅
```

### Scenario 2: Feature Branch Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# → No pipeline runs ❌

# Create pull request on GitHub
# → Pipeline runs but doesn't deploy (just tests) 🧪

# Merge PR on GitHub
# → Pipeline runs and deploys ✅
```

### Scenario 3: Using Your Alias
```bash
gdeploy
# → Commits changes → Pushes to main → Pipeline runs → Deploys ✅
```

### Scenario 4: Manual Deployment
```bash
# Go to GitHub → Actions → Select "Build and Deploy InternalAI to Azure"
# → Click "Run workflow" → Select main branch → Run workflow
# → Pipeline runs → Deploys to Azure ✅
```

## 👀 **How to Monitor the Pipeline**

### 📊 **GitHub Actions Tab:**
1. Go to your GitHub repository
2. Click **"Actions"** tab
3. See all workflow runs with status:
   - 🟡 **Yellow**: Running
   - ✅ **Green**: Success (deployed)
   - ❌ **Red**: Failed

### 📱 **Real-time Monitoring:**
```
GitHub → Actions → Latest workflow run → Click to see live logs
```

### 🔔 **Notifications:**
- **GitHub** sends email notifications on success/failure
- **Azure** shows deployment status in App Service

## ⏱️ **Timeline Expectations**

### 🚀 **Typical Deployment:**
```
Push to main → 2-3 minutes → React build → 1-2 minutes → Deploy → 1-2 minutes → Live
Total: ~5-8 minutes
```

### 🧪 **PR Testing:**
```
Create PR → 2-3 minutes → Build test → 1-2 minutes → Results
Total: ~3-5 minutes
```

## 🔧 **Pipeline Configuration Details**

### 📝 **From Your Workflow File:**
```yaml
# Only deploys on main branch pushes
- name: 🚀 Deploy to Azure App Service
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

### 🎯 **Environment Variables:**
```yaml
env:
  AZURE_WEBAPP_NAME: qss-ai-webapp
  PYTHON_VERSION: '3.11'
  NODE_VERSION: '18'
```

### 🛠️ **Technical Details:**
- **Azure Actions Version**: azure/login@v2, azure/webapps-deploy@v2
- **Node Setup**: actions/setup-node@v4 with npm caching
- **Python Setup**: actions/setup-python@v4 with pip caching
- **Deployment Package**: Creates dummy startup.sh to satisfy Azure Oryx build system
- **Static Files**: React build integrated into Flask templates/static structure

## 📋 **Summary**

### ✅ **Completely Automatic:**
- **No manual intervention** needed
- **Runs on every push** to main
- **Deploys immediately** after successful build
- **Notifies you** of success/failure

### 🎯 **Your Workflow:**
1. **Make changes** locally
2. **Push to main** (`git push origin main` or `gdeploy`)
3. **GitHub Actions runs** automatically
4. **Check progress** in Actions tab
5. **App is live** at `https://qss-ai-webapp.azurewebsites.net` in ~5-8 minutes

**The pipeline is 100% automatic - just push to main and it handles everything!** 🚀
___
## 7. Troubleshooting Common Issues

This section covers the most common problems you might encounter while setting up or working on the InternalAI project, organized by category for easy reference.

### 🖥️ Windows-Specific Issues

#### **`python` is not recognized as an internal or external command**
**Symptoms:** PowerShell can't find Python when you type `python --version`

**Solutions:**
1. **Check installation:** Make sure you checked **"Add Python.exe to PATH"** during Python installation
2. **Restart everything:** Close all PowerShell windows and restart your computer
3. **Manual PATH fix:** If still not working:
   - Search "Environment Variables" in Windows Start menu
   - Click "Edit the system environment variables"
   - Click "Environment Variables" button
   - In "User variables", find "Path", click "Edit"
   - Click "New" and add: `C:\Users\YourUsername\AppData\Local\Programs\Python\Python311`
   - Replace `YourUsername` with your actual Windows username
   - Restart PowerShell

#### **`pip` is not recognized / `No module named venv`**
**Symptoms:** Can't install packages or create virtual environments

**Solutions:**
1. **Reinstall Python:** Usually means Python wasn't installed correctly - re-run the installer from [python.org](https://www.python.org/downloads/)
2. **Check PATH:** Same as above Python issue
3. **Repair installation:** In Windows Settings → Apps → Python → Modify → Repair

#### **Virtual environment not activating - `(venv)` doesn't show**
**Symptoms:** Prompt doesn't show `(venv)` prefix

**Solutions:**
```powershell
# Make sure you're in the project root
cd C:\Path\To\Your\InternalAI\Project

# Try activating again
.\venv\Scripts\Activate.ps1

# If permission error, run this once:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### **`npm` is not recognized**
**Symptoms:** Node.js commands don't work

**Solutions:**
1. **Install Node.js:** Download from [nodejs.org](https://nodejs.org/) - choose LTS version
2. **Restart terminal:** Close PowerShell and reopen after installation
3. **Check installation:** `node --version` and `npm --version` should both work

---

### 🐧 WSL-Specific Issues

#### **`python3.11` is not found or `python` command fails**
**Symptoms:** Can't find Python in WSL

**Solutions:**
```bash
# Add the repository for newer Python versions
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# Install Python 3.11 (matches production environment)
sudo apt install python3.11 python3.11-venv python3.11-dev -y

# Make python command work
sudo apt install python-is-python3 -y

# Verify installation
python3.11 --version
python --version
```

#### **WSL virtual environment not activating - `(venv)` doesn't show**
**Symptoms:** Python virtual environment won't activate in WSL

**Solutions:**
```bash
# Make sure you're in project root
cd ~/projects/InternalAI

# Create venv if it doesn't exist
python3.11 -m venv .venv

# Activate (note the dot before venv)
source .venv/bin/activate

# You should see (venv) in your prompt
```

#### **`nvm`, `node`, or `npm` commands not found in WSL**
**Symptoms:** Node.js tools don't work in WSL

**Solutions:**
```bash
# Install nvm first
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# IMPORTANT: Close and reopen your WSL terminal

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

#### **Permission denied errors in WSL**
**Symptoms:** `sudo: command not found` or permission errors

**Solutions:**
```bash
# If sudo doesn't work, you might need to reinstall WSL
# Or try running commands without sudo first

# For npm permission issues:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

### 📦 Package Installation Issues

#### **Frontend: "Module not found" errors**
**Symptoms:** 
```
Module not found: Error: Can't resolve 'react-router-dom'
Module not found: Error: Can't resolve 'xlsx'
```

**Solutions:**
```bash
# Navigate to frontend directory
cd frontend

# Try installing the missing package specifically
npm install react-router-dom
# OR install all dependencies
npm install

# If still failing, clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### **Backend: "ModuleNotFoundError" in Python**
**Symptoms:**
```
ModuleNotFoundError: No module named 'flask_cors'
ModuleNotFoundError: No module named 'flask'
```

**Solutions:**
```bash
# Make sure virtual environment is active (you should see (venv))
source .venv/bin/activate  # WSL
# OR
.\venv\Scripts\Activate.ps1  # Windows

# Install backend dependencies
pip install -r backend/requirements.txt

# If specific package is missing:
pip install flask flask-cors

# Verify installation
pip list | grep flask
```

#### **Package version conflicts**
**Symptoms:** Installation fails with version conflict messages

**Solutions:**
```bash
# For Python packages - create fresh virtual environment
rm -rf .venv  # or venv on Windows
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# For npm packages - clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### 🔧 Development Server Issues

#### **Flask server won't start**
**Symptoms:** 
```
flask: command not found
ModuleNotFoundError when running python app.py
```

**Solutions:**
```bash
# Make sure you're in the backend directory
cd backend

# Ensure virtual environment is active
source ../.venv/bin/activate  # WSL
# OR
..\venv\Scripts\Activate.ps1  # Windows

# Try the simpler approach
python app.py

# Or set Flask app explicitly
export FLASK_APP=app.py  # WSL
$env:FLASK_APP = "app.py"  # Windows
flask run
```

#### **React server won't start**
**Symptoms:**
```
npm start fails
Port 3000 is already in use
```

**Solutions:**
```bash
# Make sure you're in frontend directory
cd frontend

# If port is in use, find and kill the process
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# On WSL:
lsof -ti:3000 | xargs kill -9

# If npm start still fails:
rm -rf node_modules
npm install
npm start
```

#### **Servers can't communicate (CORS errors)**
**Symptoms:** Frontend can't reach backend API

**Solutions:**
1. **Check both servers are running:**
   - Backend on `http://127.0.0.1:5000`
   - Frontend on `http://localhost:3000`

2. **Verify backend has CORS enabled:** Check `backend/app.py` has `CORS(app)`

3. **Check firewall:** Windows Firewall might block connections

---

### 🌐 Git and GitHub Issues

#### **`git push` rejected with "non-fast-forward"**
**Symptoms:**
```
! [rejected] main -> main (non-fast-forward)
```

**Solutions:**
```bash
# Someone else made changes - get their changes first
git pull origin main

# If there are conflicts, Git will tell you which files
# Edit the files to resolve conflicts, then:
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

#### **Authentication failed with GitHub**
**Symptoms:** Git push asks for username/password and fails

**Solutions:**
1. **Use personal access token instead of password:**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with repo permissions
   - Use token instead of password when prompted

2. **Set up SSH keys:** [Follow GitHub's SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

#### **Wrong branch or can't switch branches**
**Symptoms:** Working on wrong branch or git checkout fails

**Solutions:**
```bash
# Check which branch you're on
git branch

# Switch to main
git checkout main

# If you have uncommitted changes:
git stash  # Save changes temporarily
git checkout main
git stash pop  # Restore changes
```

---

### 🚀 Deployment and CI/CD Issues

#### **GitHub Actions pipeline failing**
**Symptoms:** Red X on commits, deployment not working

**Solutions:**
1. **Check the Actions tab** on GitHub to see detailed error messages
2. **Common fixes:**
   ```bash
   # Update dependencies in your branch
   npm audit fix  # in frontend/
   pip check      # with venv active
   ```
3. **Verify all tests pass locally:**
   ```bash
   npm test       # in frontend/
   npm run test:e2e  # in frontend/
   ```

#### **Azure deployment not updating**
**Symptoms:** Changes pushed but website shows old version

**Solutions:**
1. **Check deployment status:** GitHub → Actions tab → Latest workflow
2. **Clear browser cache:** Hard refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. **Verify deployment:** Check `https://qss-ai-webapp.azurewebsites.net/api/health`

---

### 🆘 VS Code and IDE Issues

#### **VS Code can't find Python or Node**
**Symptoms:** Red underlines, import errors, or IntelliSense not working

**Solutions:**
1. **Select correct Python interpreter:**
   - Press `Ctrl+Shift+P`
   - Type "Python: Select Interpreter"
   - Choose the one in your project's `.venv` folder

2. **Reload VS Code:** Press `Ctrl+Shift+P` → "Developer: Reload Window"

3. **Install extensions:**
   - Python extension by Microsoft
   - WSL extension (if using WSL)

#### **WSL integration not working in VS Code**
**Symptoms:** Can't connect to WSL or files don't sync

**Solutions:**
1. **Install WSL extension** in VS Code
2. **Connect to WSL:** Press `Ctrl+Shift+P` → "Remote-WSL: New WSL Window"
3. **Open project in WSL:** File → Open Folder → Navigate to `~/projects/InternalAI`

---

### 💡 Getting Help

If you're still stuck after trying these solutions:

1. **Check the error message carefully** - often it contains the exact solution
2. **Search the error online** - add "InternalAI" or "React Flask" to your search
3. **Ask team members** - someone likely faced the same issue
4. **Check our project's Issues tab** on GitHub
5. **Share the complete error message** when asking for help - screenshots are helpful!

### 🔍 Diagnostic Commands

When asking for help, run these commands and share the output:

**Environment Check:**
```bash
# System info
python --version
node --version
npm --version
git --version

# Project status
git status
git branch
ls -la  # WSL
dir     # Windows

# Virtual environment
which python  # WSL
where python  # Windows
```

**Common Log Locations:**
- **Flask errors:** Check the terminal where you ran `python app.py`
- **React errors:** Check the terminal where you ran `npm start`
- **Browser errors:** Press F12 → Console tab
- **GitHub Actions:** Repository → Actions tab → Click on failed run

---
We're excited to have you contribute to InternalAI! If you get stuck at any point, don't hesitate to ask for help. Good luck!


Remember: **Don't give up!** These setup challenges are normal, especially when learning. Each error you solve makes you a better developer! 🚀