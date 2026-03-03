# Google Authentication Flow Documentation

## Overview
This document describes the updated Google authentication flow for the Blog Site application.

## Changes Made

### 1. **Frontend Changes** ([src/screens/Login.jsx](src/screens/Login.jsx))

#### New Handler: `handleGoogleSignup()`
- Used when user clicks "Continue with Google" in the **SIGNUP tab**
- Creates a new account with Google credentials
- Stores user data in localStorage
- Redirects to dashboard on success

#### Updated Handler: `handleGoogleAuth()`
- Used when user clicks "Continue with Google" in the **LOGIN tab**
- Only allows login if user is already registered
- Shows popup error: *"User not registered. Please register first using Google Sign Up."*
- No auto-registration

### 2. **Backend Changes**

#### Updated Endpoint: `POST /api/auth/google`
**Purpose:** Login only (for Sign In tab)
- Checks if user exists in MongoDB
- If NOT found → Returns `{ success: false, isNewUser: true, error: "User not registered..." }`
- If found → Returns `{ success: true, user: {...}, isNewUser: false }`
- Does NOT auto-create users

#### New Endpoint: `POST /api/auth/google-signup`
**Purpose:** Registration only (for Sign Up tab)
- Creates new user in MongoDB
- Checks for duplicates and prevents double registration
- Returns `{ success: true, user: {...} }` on success

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SIGNIN TAB                               │
├─────────────────────────────────────────────────────────────┤
│  User clicks "Continue with Google"                         │
│         ↓                                                     │
│  Calls handleGoogleAuth()                                   │
│         ↓                                                     │
│  POST /api/auth/google                                      │
│         ↓                                                     │
│  ┌─────────────────────────────────────┐                    │
│  │ User exists in DB?                  │                    │
│  ├─────────────────────────────────────┤                    │
│  │ YES → Login successful              │  → Redirect to     │
│  │        Store user in localStorage   │     Dashboard ✓    │
│  │                                     │                    │
│  │ NO  → Show error popup:             │  → Prompt to use   │
│  │       "Not registered, register     │     Sign Up tab    │
│  │        first using Sign Up"         │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    SIGNUP TAB                               │
├─────────────────────────────────────────────────────────────┤
│  User clicks "Continue with Google"                         │
│         ↓                                                     │
│  Calls handleGoogleSignup()                                 │
│         ↓                                                     │
│  POST /api/auth/google-signup                               │
│         ↓                                                     │
│  ┌─────────────────────────────────────┐                    │
│  │ User already exists in DB?          │                    │
│  ├─────────────────────────────────────┤                    │
│  │ NO  → Create new user               │  → Redirect to     │
│  │       Store user in localStorage    │     Dashboard ✓    │
│  │                                     │                    │
│  │ YES → Show error:                   │  → Prompt to use   │
│  │       "Already registered, login    │     Login tab      │
│  │        instead"                     │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Key Behaviors

### Sign In Tab (Login)
- ✅ User already registered → Login successful, redirect to dashboard
- ❌ User NOT registered → Show popup: "User not registered. Please register first using Google Sign Up."
- No automatic registration

### Sign Up Tab (Register)
- ✅ User is new → Create account, redirect to dashboard
- ❌ User already registered → Show error: "User already registered. Please log in instead."

## Files Modified

1. **Frontend:**
   - [src/screens/Login.jsx](src/screens/Login.jsx) - Added `handleGoogleSignup()`, updated `handleGoogleAuth()`

2. **Backend:**
   - [backend/controllers/authController.js](backend/controllers/authController.js) - Updated `googleAuth()`, added `googleSignup()`
   - [backend/routes/auth.js](backend/routes/auth.js) - Added new route for `/google-signup`

## Testing Checklist

- [ ] Sign In with Google (new user) → Shows "Not registered" error
- [ ] Sign Up with Google (new user) → Creates account, redirects to dashboard
- [ ] Sign In with Google (existing user) → Logs in, redirects to dashboard
- [ ] Sign Up with Google (existing user) → Shows "Already registered" error
- [ ] User data is correctly stored in localStorage after successful auth
