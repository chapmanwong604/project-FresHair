# **FresHair**

## **Overview:**

This is a **React.js project** which helps clients to match their desired hair stylists.

It involves some concepts of gig economy, and the Web App can be seen as a platform for gig workers (**Hair Stylists**) to display their services to their **Clients**.

The Web App allows registration for two roles: **Clients** and **Hair Stylists**.

## **Features:**

#### **Hair Stylists**

- Create and display personal profile, service plans to **Clients**
  
- Manage, check the timetable, and open new time slots for potential hair appointments

- Manage (confirm, reject) and check the appointments made by **Clients**

- Receive email notifications for any new requests from **Clients**
  
#### **Clients**

- Search for desired **Hair Stylists** and their profiles with filters

- Look for different service plans and make requests for hair appointments with **Hair Stylist**

- Check status of requests for hair appointments

- Rate the experience after appointments

- Receive email notifications for any confirmation or rejection of hair appointments

## **Setup for the Project:**
        
#### **Express Server Setup**

1. Install the dependencies of **`/server`** (node.js) in package.json.
   
        cd server/
        npm install

2. Follow `example.sql` to create a new **PostgreSQL** database for storing data of hair stylists, services and clients.

3. Follow `example.env` under **`/server`** to create new `.env` file for connection to database, and **Nodemailer** if you wish.
   
4. Run **Knex** `migration` and `seed` to create tables and required data of the database.
   
        npx knex migrate:latest
    
        npx knex seed:run

5. Run the **Express** server.
   
        npm start

6. **Express** server should be running at http://localhost:8088/ now.
    
#### **React App Setup**

1. Install the dependencies of **`/App`** (React.js) in package.json.
    
        cd App/
        npm install

2. Follow `example.env` under **`/App`** to create new `.env` file for API connection to **Express** server.
   
3. Run the **React App** server.
   
        npm start

4.  **React App** (http://localhost:3000/) should pop up and start immediately, try it out!

## **Contributors:**

-   William Chi
-   Hang Tsui
-   Chapman Wong