
5. Open your browser and navigate to `http://localhost:3000` to see the application running.

## Project Structure

- `/src/pages`: Contains the Next.js pages and API routes
- `/src/components`: React components used throughout the application
- `/src/lib`: Utility functions and shared code
- `/public`: Static assets

## Key Features

- Job management with CRUD operations
- Role-based access control (Tradesman, Foreman, Admin)
- AI-powered job summary generation using OpenAI
- Image upload and management for jobs
- Voice notes functionality
- Safety reporting system
- Asset management

## Local Development

As you make changes to the code, the development server will automatically reload, and you'll see the updates in your browser.

### API Routes

Your API routes will be accessible at `http://localhost:3000/api/...`

### Database

This project uses Supabase as the database. Any changes you make to the database during local development will affect your actual Supabase project, so be cautious with data modifications.

### AI Integration

The OpenAI API calls will use your actual API key, so keep an eye on your usage if you're on a limited plan.

## Troubleshooting

- If you encounter any errors related to missing dependencies, try running `npm install` again.
- If you see errors related to environment variables, double-check your `.env.local` file to ensure all variables are correctly set.
- If you're having issues with Supabase connections, verify that your Supabase project is up and running, and that the connection details in your `.env.local` file are correct.
- For any TypeScript errors, run `npm run type-check` to see more detailed error messages.

## Deployment

This project can be easily deployed to Vercel or any other Next.js-compatible hosting platform. Make sure to set up the environment variables in your hosting platform's settings.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE).