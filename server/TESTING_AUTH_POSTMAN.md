# Testing Clerk Authentication with Postman

Since Clerk handles authentication on the frontend and passes a token to the backend, testing protected backend routes via Postman requires passing a valid Clerk Session Token in the request headers.

Here is the exact step-by-step process to test the `/api/auth/sync` route:

## Step 1: Get a valid Session Token from your Frontend

1. Run your frontend (e.g., React/Next.js/React Native) that has Clerk installed.
2. Sign up or log in as a user.
3. Once logged in, open the **Browser Developer Tools** (F12) -> **Console**.
4. Run the following command to retrieve your raw Clerk JWT session token:
   ```javascript
   await window.Clerk.session.getToken()
   ```
5. Copy the long string output (this is your Bearer token).

## Step 2: Set up Postman Request

1. Open Postman and create a new **POST** request.
2. Set the URL to: `http://localhost:5000/api/auth/sync`
3. Go to the **Headers** tab.
4. Add a new Key-Value pair:
   - **Key**: `Authorization`
   - **Value**: `Bearer <YOUR_COPIED_TOKEN>` *(Replace `<YOUR_COPIED_TOKEN>` with the string you copied in Step 1)*

## Step 3: Send Request & Verify

1. Hit **Send**.
2. If successful, your Node.js backend will:
   - Verify the token using the `@clerk/express` middleware.
   - Extract the `userId` from the token.
   - Look up the user in MongoDB.
   - If the user doesn't exist, it will automatically fetch their details using the `clerkClient` and create a new document in your `users` collection.
3. You should see a JSON response like this:
   ```json
   {
       "success": true,
       "message": "User synced successfully",
       "data": {
           "_id": "648a7b9e1c2d3e4f...",
           "clerkId": "user_2Pabc...",
           "name": "John Doe",
           "email": "johndoe@example.com",
           "image": "https://img.clerk.com/...",
           "createdAt": "2023-11-01T12:00:00Z",
           "__v": 0
       }
   }
   ```

### Troubleshooting:
- **401 Unauthorized**: You either forgot the `Authorization` header, the Bearer token was pasted incorrectly, or the token expired. (Clerk session tokens usually expire after 1 minute! Always generate a fresh one from the browser console before testing).
- **500 Server Error**: Ensure your `.env` has both `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` set correctly, and your MongoDB instance is running.
