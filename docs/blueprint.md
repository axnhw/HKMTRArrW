# **App Name**: MTR Arrival Time

## Core Features:

- Station Selector: Provide sliders or a dropdown menu for the user to select an MTR line and station from the data available in the MTR data dictionary.
- Line Color Background: Change the background color of the app to match the selected MTR line color (taken from the Wikipedia page), with 50% transparency.
- ETA Display: Display an estimated time of arrival screen, styled after the example image. Display the key data points available from the API in a clear and simple design.
- Data Fetching: Fetch real-time data from the MTR Open Data API for the selected station. Extract and format the key information about train arrival times to display them clearly and promptly.

## Style Guidelines:

- Primary color: Off-white (#FAFAFA) for the main content areas, providing a clean backdrop.
- Background color: Dynamically set based on the selected MTR line color, using a 50% transparency to allow the content to remain visible. Example: Light Orange (#FF8C00) might be rendered as rgba(255, 140, 0, 0.5).
- Accent color: A darker shade of gray (#424242) to provide contrast for interactive elements and text.
- Font pairing: 'Inter' (sans-serif) for both headlines and body text, providing a modern and readable appearance.
- Use simple, monochrome icons to represent MTR lines and directions. The style will match the cleanliness and modern style, consistent with the station designs.
- The layout will mimic the real-life displays found in MTR stations: time, platform number, and destination should have good visual prominence.
- Subtle transitions and loading animations when updating arrival times.