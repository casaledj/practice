# Local Restaurants Web

This project is a web application that allows users to find local restaurants within a user-defined radius. It is built using React and TypeScript.

## Features

- User input for location and radius
- Displays a list of restaurants based on the user's criteria
- Responsive and user-friendly interface

## Project Structure

```
local-restaurants-web
├── src
│   ├── App.tsx                # Main component managing state and rendering
│   ├── components
│   │   └── RestaurantList.tsx  # Component for displaying the list of restaurants
│   ├── services
│   │   └── restaurantService.ts # Service for fetching restaurant data
│   └── types
│       └── index.ts           # TypeScript interfaces for type safety
├── public
│   └── index.html             # Entry point for the React application
├── package.json                # npm configuration file
├── tsconfig.json              # TypeScript configuration file
└── README.md                  # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd local-restaurants-web
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

- Enter your location and desired radius in the input fields.
- Click the search button to fetch and display the list of restaurants within the specified radius.

## License

This project is licensed under the MIT License.