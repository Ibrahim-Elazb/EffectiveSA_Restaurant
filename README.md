# EffectiveSA Restaurant Project

## Project Description
The project is divided into two parts:
1. Client Interface: Allows clients to view the menu, add meals to carts, and place orders.
2. Dashboard Interface: For restaurant employees and administrators to manage orders and employee roles.

## Installation Instructions
1. Clone the repository.
2. Change to the project directory.
3. Install the dependencies by running `npm install`.
4. Set up the environment variables:
   - Create a `.env` file in the server directory.
   - Specify the required environment variables (e.g., database connection details, session keys, etc.).
5. Start the server by running `node index.js`.

## Usage Guide
- Client Interface:
  - Access the client interface in your browser at: http://127.0.0.1:3000/
  - Explore the menu, add meals to the cart, and place orders.

- Dashboard Interface:
  - Access the dashboard interface in your browser at: http://127.0.0.1:3000/dashboard/
  - Restaurant employees can log in and view/manage orders using their credentials.
  - Administrators have additional privileges to change employee roles.

## Technologies Used
- HTML
- CSS
- Express Framework
- PostgreSQL

## Project Structure
- `/controllers`: Contains each path's Express routes, path, and validation models.
- `/middleware`: Contains authentication and validation middleware.
- `/models`: Contains the server-side code for database operations.
- `/public`: Contains static files (CSS files, JS scripts, images).
- `/services`: Contains Multer (node.js middleware for handling multipart/form-data, primarily used for file uploads) and SendEmail for sending emails if needed.
- `/utils`: Contains utility functions for date formatting, deleting files, error handling, and custom HTTP errors.
- `/views`: The "ejs" files will be rendered to HTML files.

## Database Configuration
Create a PostgreSQL database for the project.
Update the database configuration in the `.env` file in the server directory with the following variables:
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

## Database Structure
- `menu_type` table: Contains the following columns:
  - id: Primary key for the menu type.
  - name_ar: Name of the menu type in Arabic.
  - name_en: Name of the menu type in English.
  
- `menu` table: Contains the following columns:
  - id: Primary key for the menu item.
  - name_ar: Name of the menu item in Arabic.
  - name_en: Name of the menu item in English.
  - price: Price of the menu item.
  - discount: Discount amount for the menu item.
  - image: Path or URL to the image of the menu item.
  - menu_type: Foreign key referencing the id column of the `menu_type` table.

- `messages` table: Contains the following columns:
  - id: Primary key for the message.
  - name: Name of the sender.
  - email: Email address of the sender.
  - subject: Subject of the message.
  - message: Content of the message.
  - phone: Phone number of the sender.
  - date: Date and time of the message.
  - has_read: Flag indicating whether the message has been read.

- `users` table: Contains the following columns:
  - id: Primary key for the user.
  - name: Name of the user.
  - email: Email address of the user.
  - phone: Phone number of the user.
  - password: Encrypted password of the user.
  - role: Role of the user (e.g., employee, administrator).
  - start_working_day: Start working day of the user.
  - notes: Additional notes or information about the user.

- `orders` table: Contains the following columns:
  - id: Primary key for the order.
  - client_name: Name of the client.
  - client_phone: Phone number of the client.
  - client_email: Email address of the client.
  - client_vehicle: Vehicle information for drive-thru service (if applicable).
  - order_time: Timestamp of when the order was placed.
  - total_price: Total price of the order.
  - status: Status of the order (pending, ready, delivered, cancelled). 

- `order_details` table: Contains the following columns:
  - id: Primary key for the order detail.
  - count: Quantity of the menu item in the order.
  - price: Price of the menu item at the time of the order.
  - discount: Discount amount for the menu item at the time of the order.
  - order_id: Foreign key referencing the id column of the `orders` table.
  - menu_id: Foreign key referencing the id column of the `menu` table.

## API Documentation
The following API endpoints are available:

### Message API
- POST `<URL>/api/v1/message/new`: Add a new message.
- GET `<URL>/api/v1/message/search`: Search for messages.
- GET `<URL>/api/v1/message/?page=2`: Get a page of messages.
- GET `<URL>/api/v1/message/unread`: Get unread messages.

### Menu Type API
- POST `<URL>/api/v1/menu-type/new`: Add a new menu type.
- GET `<URL>/api/v1/menu-type/all`: Get all menu types.
- PATCH `<URL>/api/v1/menu-type/edit/<menu-type-id>`: Edit a menu type.

### Menu API
- POST `<URL>/api/v1/menu/new`: Add a new menu item.
- PATCH `<URL>/api/v1/menu/edit/<menu-id>`: Edit a menu item.
- GET `<URL>/api/v1/menu/all`: Get all menu items.
- GET `<URL>/api/v1/menu/<menu-id>`: Get details of a menu item.
- GET `<URL>/api/v1/menu/type/<menu-type-id>`: Get all menu items of a specific menu type.
- GET `<URL>/api/v1/menu/delete/<menu-id>`: Delete a menu item.

### User API
- POST `<URL>/api/v1/user/new`: Create a new user.
- PATCH `<URL>/api/v1/user/edit/<user-id>`: Edit user information.
- GET `<URL>/api/v1/user/all`: Get all users.
- GET `<URL>/api/v1/user/<user-id>`: Get user details.
- POST `<URL>/api/v1/user/login`: User login.
- DELETE `<URL>/api/v1/user/delete/<user-id>`: Delete a user.

### Order API
- POST `<URL>/api/v1/order/new`: Add a new order.
- GET `<URL>/api/v1/order/<order-id>`: Get information about an order.
- PATCH `<URL>/api/v1/order/status/<order-id>`: Edit the status of an order (pending, ready, delivered, cancelled).
- GET `<URL>/api/v1/order/all?page=3`: Get all orders by page.
- GET `<URL>/api/v1/order/search_period?start_date=05-13-2023&end_date=05-25-2023`: Get all orders within a specific date range.

### Views Pages
- `<URL>/`: Home page.
- `<URL>/Menu`: Menu page showing all menu items and allowing users to add items to their cart.
- `<URL>/contact-us`: Contact us page.
- `<URL>/About-Us`: About Us page.
- `<URL>/Orders`: Orders page for clients to make orders.

### Dashboard Pages
- `<URL>/dashboard`: Dashboard homepage.
- `<URL>/dashboard/messages`: Show messages for employees.
- `<URL>/dashboard/orders`: Show all orders with their statuses and allow status changes.
- `<URL>/dashboard/menu`: Show all menu items, edit them, add new items, and remove items.
- `<URL>/dashboard/menu-types`: Show all menu types, edit them, add new types, and remove types.
- `<URL>/dashboard/users`: For administrators, manage all users, edit roles, and remove users.
- `<URL>/dashboard/settings`: Allow users to change their settings.
- `<URL>/dashboard/password-change`: Allow users to change their password.
- `<URL>/dashboard/login`: Allow users to log in.

## Deployment Instructions
Set up a PostgreSQL database server.
Update the database configuration in the `.env` file in the server directory with the appropriate credentials for the production environment.
Set Database Schema (Tables and Relationships) as in Database Structure 
Install PM2 globally: `npm install -g pm2`
Start the server using PM2: `pm2 start index.js --name "effectivesa-restaurant-project"`
Access the deployed app through the appropriate URL or IP address.
