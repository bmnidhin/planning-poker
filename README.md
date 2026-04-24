<h1 align="center">Neptune Poker App</h1>

Free / Open source Scrum/Agile Neptune Poker Web App to estimate user stories for the Agile/Scrum teams. Create session and invite team members to estimate user stories efficiently. Intuitive UI/UX for voting the story points, showing team members voting status with emojis(👍 - Voting Done, 🤔 - Yet to Vote). Session Moderator has full control on revealing story points and restarting the session.

## Features

1. Create new Session(Fibonacci, Short Fibonacci, TShirt size or Custom)
2. Join Session
3. Invite Link
4. Share User story name/number with others using the board
5. Session controller - Moderator can Reveal and restart the session anytime.
6. Reveal - Reveal the cards for all users
7. Voting status - Users Cards show voting status using emojis - 👍 - Voting Done, 🤔 - Yet to Vote
8. Remove user from session
9. Delete Session - Moderator can delete the session completely
10. Dark Theme Support
11. Multiple language support
12. Mobile/Tablet screen support
13. Timer 

## Tech Stack

1. React - Frontend
2. Tailwind CSS - For styling
3. Firestore - Database
4. Firebase - Hosting

## How to run the app locally for development

Pre-req

- Node.js version 16.0 or higher.
- Yarn
- Java JDK version 11 or higher.(for firestore db emulator)

1. Clone the repo

   ```bash
   git clone https://github.com/hellomuthu23/planning-poker.git
   ```

2. Run `yarn` command to install the required npm package.
3. Install the Firebase CLI

   ```bash
   npm install -g firebase-tools
   ```

4. Start the firebase db emulator

   ```bash
   npm run start:emulator
   ```

5. Copy `.env.example` file as `.env` file and make sure `REACT_APP_USE_FIRESTORE_EMULATOR` is set to `true`
6. Run `yarn start` to start the app.
7. Access the app at `http://localhost:3000`.

## Creating container with Podman

pre-req

- Podman 

```
podman machine start
```

1. Build the app using below command. Make sure `REACT_APP_USE_FIRESTORE_EMULATOR` env variable is set to true.

   ```bash
   npm run build
   ```

2. Build container image

   ```bash
   podman build -t appcon-neptune/scrum-poker . 
   ```

3. Running the container

   ```bash
   podman run -it -p 8080:8080 -p 3000:3000  planning-poker
   ```

4. Wait for both emulator and app to start
5. Access the app from local container using <http://localhost:3000>

## Development Guidelines

1. Keep it simple as much as possible
2. Add required unit tests
3. Use strong type always
4. Use functional and hooks based approach for components
5. Avoid adding new colors
6. Use tailwind utility classes for styling the components
7. Don't duplicate code and use service folder to keep non-component/shared codes

## Pending features open to development

1. Export options
2. Preserve history of voting and show it in session
3. Ask AI Option

## Tech Debts

1. Add Semantic Release to generate changelog and release notes
2. Add missing unit tests for services


