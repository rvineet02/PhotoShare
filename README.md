# PhotoShare

## Instructions

### 1. DATABASE - execute `schema.sql` in your preferred way

Example `source ./schema.sql` when logged into `mysql`.

### 2. CONFIG

Rename `backend/.fenv` to `backend/.env` and replace `YOUR_PASSWORD_HERE` with your MySQL password.

### 3. BACKEND - Open a terminal tab, cd into project's root directory and run

```bash
cd backend
virtualenv venv #Only if using virtual envs
source venv/bin/activate #Only if using virtual envs
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```

### 4. FRONTEND - Open a different terminal, cd into project's root directory and run one of the following

#### Using `npm`
```bash
cd frontend
npm i
npm start
```

#### Using `yarn`
```bash
cd frontend
yarn
yarn start
```

### 5. WEBSITE ACCESS

We have created 4 users with some already-created albums, comments and likes. Here is their login info:

- Email: `admin1@bu.edu`, password: `1234`
- Email: `admin2@bu.edu`, password: `1234`
- Email: `admin3@bu.edu`, password: `1234`
- Email: `admin4@bu.edu`, password: `1234`

You can login with their credentials or create another user by registering.


### 6. TROUBLESHOOTING - If you have some complications running the frontend, run our pre-built code using one of the following
#### Using `npm`
```
npm i serve
npm run serve
```

#### Using `yarn`
```
yarn add serve
yarn serve
```
