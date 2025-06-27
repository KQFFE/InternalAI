# InternalAI Project

Welcome to the InternalAI project!

Don't worry if you've never coded before or used GitHub – this guide is made for you! We'll walk you through everything you need to get started, step-by-step.

For styling, you can reference Knowit's [Visual Identity Guidelines](https://www.knowit.se/globalassets/brand-book/2024-assets/knowitvisuald240828.pdf)

---

## Table of Contents

1.  [Running the Servers Locally](#1-running-the-servers-locally)
2.  [Getting Started (For Absolute Beginners)](#2-getting-started-for-absolute-beginners)
    * [What is the Command Prompt (PowerShell)?](#what-is-the-command-prompt-powershell)
    * [Step 1: Install Python](#step-1-install-python)
    * [Step 2: Install Git](#step-2-install-git)
    * [Step 3: Get the Project Files (Clone the Repository)](#step-3-get-the-project-files-clone-the-repository)
    * [Step 4: Set Up Your Project Environment (Virtual Environment)](#step-4-set-up-your-project-environment-virtual-environment)
    * [Step 5: Install Project Dependencies](#step-5-install-project-dependencies)
    * [Step 6: Install Frontend Dependencies](#step-6-install-frontend-dependencies)
3.  [Making Changes & Contributing (Your First Steps with Git)](#3-making-changes--contributing-your-first-steps-with-git)
    * [The Idea of Branches](#the-idea-of-branches)
    * [Step A: Start Your Own Workspace (Create a New Branch)](#step-a-start-your-own-workspace-create-a-new-branch)
    * [Step B: Make Your Code Changes](#step-b-make-your-code-changes)
    * [Step C: Save Your Changes (Commit)](#step-c-save-your-changes-commit)
    * [Step D: Share Your Changes (Push)](#step-d-share-your-changes-push)
    * [Step E: Propose Your Changes (Pull Request)](#step-e-propose-your-changes-pull-request)
4.  [Troubleshooting Common Issues](#4-troubleshooting-common-issues)

---

## 1. Running the Servers Locally

Once you have completed the [Getting Started](#2-getting-started-for-absolute-beginners) steps below, you can run both the Backend (Flask) and Frontend (React) servers. You will need **two separate PowerShell windows** open for this, one for each server.

### 1.1 Running the Backend (Flask) Server

1.  **Open your first PowerShell window.**
2.  **Navigate to your project root:**
    ```powershell
    cd D:\Dev\InternalAI
    ```
    *(Adjust `D:\Dev\InternalAI` to your actual project path)*
3.  **Activate your virtual environment:**
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

### 1.2 Running the Frontend (React) Server

1.  **Open your second PowerShell window.**
2.  **Navigate to your project root:**
    ```powershell
    cd D:\Dev\InternalAI
    ```
3.  **Navigate to the `frontend` folder:**
    ```powershell
    cd frontend
    ```
4.  **Start the React development server:**
    ```powershell
    npm start
    ```
    This will open your browser to `http://localhost:3000` (or another port if 3000 is taken) and show your React application. Keep this window open and running. To stop the server, press `Ctrl + C`.

---

## 2. Getting Started (For Absolute Beginners)

This section will help you set up your computer to work on the InternalAI project.

### What is the Command Prompt (PowerShell)?

Think of the Command Prompt (or PowerShell on Windows) as a way to type commands directly to your computer instead of clicking on icons. We'll use it to run Python programs and Git commands.

**How to Open PowerShell:**
* Click the Windows Start button.
* Type `powershell` and press Enter. A blue window will appear. This is your terminal.

### Step 1: Install Python

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

### Step 2: Install Git

Git is a tool that helps us manage changes to our code and collaborate with others. GitHub is a website that uses Git.

1.  **Download Git:** Go to the official Git website: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2.  **Run the Installer:** Double-click the downloaded `.exe` file.
    * You can generally click "Next" through most of the options, accepting the defaults. The default options are usually fine for beginners.
3.  **Verify Git Installation:** Open a **NEW** PowerShell window. Type:
    ```powershell
    git --version
    ```
    You should see `git version X.X.X`.

### Step 3: Get the Project Files (Clone the Repository)

"Cloning" means making a copy of the entire project from GitHub to your computer.

1.  **Choose a Location:** Decide where on your computer you want to store the project. A good place might be a new folder called `Dev` directly on your `D:` drive (e.g., `D:\Dev`).
    * In PowerShell, type `D:` and press Enter to go to your D drive.
    * Then type `mkdir Dev` and press Enter to create the folder.
    * Then type `cd Dev` and press Enter to go inside that folder. Your prompt should look like `PS D:\Dev>`.

2.  **Clone the Project:** In your PowerShell window, inside the `D:\Dev` folder, type this command:
    ```powershell
    git clone [https://github.com/KnowitQSS/InternalAI.git](https://github.com/KnowitQSS/InternalAI.git)
    ```
    This will download all the project files into a new folder named `InternalAI` inside `D:\Dev`.

3.  **Go into the Project Folder:**
    ```powershell
    cd InternalAI
    ```
    Your PowerShell prompt should now look something like `PS D:\Dev\InternalAI>`. This is your main project folder!

### Step 4: Set Up Your Project Environment (Virtual Environment)

A "virtual environment" (or "venv") is like a separate, clean box for your project's Python tools. It keeps this project's tools separate from other Python projects you might work on.

1.  **Create the Virtual Environment:** While you are in the `PS D:\Dev\InternalAI>` folder, type:
    ```powershell
    python -m venv venv
    ```
    This creates a new folder named `venv` inside your `InternalAI` project folder.

2.  **Activate the Virtual Environment:** This step "enters" your clean box, so any Python commands you run will use the tools inside it.
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
    You'll know it worked because your PowerShell prompt will change to include `(venv)` at the beginning, like this: `(venv) PS D:\Dev\InternalAI>`.

    * **Remember:** You need to run this `Activate.ps1` command **every time you open a new PowerShell window** to work on this project.

### Step 5: Install Project Dependencies (Backend)

"Dependencies" are other Python tools or libraries that our InternalAI project (specifically the backend) needs to run.

1.  **Install Them:** While your `(venv)` is active and you're in `PS D:\Dev\InternalAI>`, type:
    ```powershell
    pip install -r requirements.txt
    ```
    This command reads a file called `requirements.txt` which lists all the necessary tools, and `pip` (Python's package installer) will download and install them into your `venv`. This might take a few moments.

### Step 6: Install Frontend Dependencies (React)

The frontend also has its own set of dependencies.

1.  **Go to the `frontend` folder:**
    ```powershell
    cd frontend
    ```
    Your prompt should now be `(venv) PS D:\Dev\InternalAI\frontend>`.
2.  **Install Frontend Dependencies:**
    ```powershell
    npm install
    ```
    This command reads the `package.json` file in the `frontend` folder and installs all required JavaScript libraries. This might take a few moments.

---

## 3. Making Changes & Contributing (Your First Steps with Git)

This section explains how to make changes to the code and share them with the project.

### The Idea of Branches

Imagine the project's code as a tree with a `main` branch (the stable, main version). When you want to work on something new or fix a bug, you don't work directly on `main`. Instead, you create a "new branch" from `main`.

Think of your branch as your **personal workspace**. You can make all the changes you want on your branch without affecting the `main` code or other people's work until you're ready.

### Step A: Start Your Own Workspace (Create a New Branch)

Before you start making any changes, always create a new branch.

1.  **Go to the Project Root:** Make sure your PowerShell prompt is `(venv) PS D:\Dev\InternalAI>`. If you're in a subfolder (like `backend` or `frontend`), type `cd ..` until you are in the `InternalAI` folder.

2.  **Create and Switch to a New Branch:**
    ```powershell
    git checkout -b your-new-feature-branch-name
    ```
    * Replace `your-new-feature-branch-name` with a short, descriptive name for what you're working on (e.g., `add-user-auth`, `fix-login-bug`, `update-readme`).
    * You'll see a message like "Switched to a new branch 'your-new-feature-branch-name'".

### Step B: Make Your Code Changes

* Now, use your code editor (like VS Code, Notepad++, etc.) to open the project files (e.g., `D:\Dev\InternalAI\backend\app.py` or `D:\Dev\InternalAI\frontend\src\App.js`).
* Make the changes you want.
* **Save your files** normally.

### Step C: Save Your Changes (Commit)

After you've made some changes and saved your files, you need to tell Git about them.

1.  **Check What Git Sees:**
    ```powershell
    git status
    ```
    This command shows you:
    * Files you've changed but haven't told Git to track yet (like new files, or modifications to existing files).
    * Files that are "staged" (ready for your snapshot).

2.  **Stage Your Changes (Prepare for the Snapshot):**
    This tells Git, "Hey, these are the specific changes I want to include in my next saved version."
    ```powershell
    git add .
    ```
    The `.` (dot) means "add all changes in the current folder and its subfolders."

    Run `git status` again. Now your changes should be listed under "Changes to be committed."

3.  **Commit Your Changes (Take the Snapshot):**
    This creates a permanent record (a "commit") of your staged changes in your branch's history.
    ```powershell
    git commit -m "A short, clear message about what you changed"
    ```
    * Replace `"A short, clear message about what you changed"` with a brief summary.
        * **Good examples:** "feat: Add new user registration endpoint", "fix: Correct calculation bug in AI module", "docs: Update README with setup instructions".
        * **Bad examples:** "stuff", "changes", "oops".

### Step D: Share Your Changes (Push)

Committing saves changes to your computer. To send them to your branch on GitHub, you need to "push" them.

1.  **Push to GitHub:**
    ```powershell
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

Now, others can review your code!

---

## 4. Troubleshooting Common Issues

* **`python` is not recognized:**
    * Make sure you checked "Add Python.exe to PATH" during installation.
    * Restart your PowerShell window or even your computer.
    * If still not working, you might need to manually add Python to your system's PATH. (Search online for "add python to path windows" if this happens).

* **`pip` is not recognized / `No module named venv`:**
    * This usually means Python wasn't installed correctly or its path isn't set. Re-check Step 1.

* **`(venv) PS D:\Dev\InternalAI> ` doesn't show `(venv)`:**
    * You forgot to run `.\venv\Scripts\Activate.ps1`. Run it again in your PowerShell window. Remember to do this every time you start a new session.

* **`npm` is not recognized:**
    * You might not have Node.js and npm installed. You can download them from [https://nodejs.org/](https://nodejs.org/). `npm` usually comes with Node.js.

* **`git push` gives `non-fast-forward` error:**
    * See "Step D: Share Your Changes (Push)" above. You need to `git pull` first.

---

We're excited to have you contribute to InternalAI! If you get stuck at any point, don't hesitate to ask for help. Good luck!