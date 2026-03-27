# 🎬 Movie Explorer

A full-stack movie review web application where users can discover movies, write personal reviews, rate films, manage watchlists, and explore community opinions — built entirely on free-tier APIs with zero infrastructure cost.

> Built by interns during a 2-week sprint | Powered by TMDb + Supabase + Netlify

🔗 **Live Demo:** [moviereviewexploreroffocoal.netlify.app](https://moviereviewexploreroffocoal.netlify.app/login)

---

## ✨ Features

- 🔐 **Authentication** — Sign up, log in, log out, and password reset via Supabase Auth
- 🎥 **Movie Discovery** — Browse Trending, Popular, Top Rated, and Now Playing sections
- 🔍 **Real-time Search** — Debounced movie search powered by the TMDb API
- ⭐ **Review System** — Write, edit, and delete personal reviews with 1–5 star ratings
- 🌍 **Community Reviews** — See all user reviews and average ratings per movie
- 📋 **Watchlist** — Add/remove movies to a personal watchlist, persisted in Supabase
- 👤 **User Profile** — View review history, average rating given, and watchlist count
- 🌙 **Dark / Light Mode** — Theme toggle persisted via React Context API
- 📱 **Fully Responsive** — Mobile-first design across mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Styling | Tailwind CSS v3 |
| Routing | React Router DOM v6 |
| State Management | React Context + Hooks |
| Authentication | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Movie Data | TMDb REST API |
| Supplementary Data | OMDb API |
| Trailer Embeds | YouTube iFrame API |
| Hosting | Netlify |
| Linting | ESLint + Prettier |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
movie-explorer/
├── public/
├── src/
│   ├── assets/              # Images, icons, static files
│   ├── components/          # Reusable UI components
│   │   ├── MovieCard/
│   │   ├── StarRating/
│   │   ├── ReviewCard/
│   │   ├── Navbar/
│   │   ├── WatchlistButton/
│   │   ├── SkeletonLoader/
│   │   └── ProtectedRoute.jsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── WatchlistContext.jsx
│   ├── hooks/               # Custom hooks
│   │   ├── useMovies.js
│   │   ├── useReviews.js
│   │   └── useWatchlist.js
│   ├── pages/               # Page-level components
│   │   ├── HomePage.jsx
│   │   ├── MovieDetailPage.jsx
│   │   ├── SearchResultsPage.jsx
│   │   ├── WatchlistPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── SignUpPage.jsx
│   ├── services/            # External API abstraction
│   │   ├── tmdbService.js
│   │   ├── omdbService.js
│   │   └── supabaseClient.js
│   ├── utils/               # Helper functions
│   │   └── formatDate.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                     # API keys (git-ignored)
├── .env.example             # Template for team members
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A free [TMDb API key](https://developer.themoviedb.org/docs)
- A free [Supabase](https://supabase.com) project
- (Optional) A free [OMDb API key](https://www.omdbapi.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/movie-explorer.git
   cd movie-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your keys:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be running at `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

VITE_OMDB_API_KEY=your_omdb_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 🗄️ Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to create the required tables and policies.

### Tables

```sql
-- Profiles table (linked to Supabase Auth users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now()
);

-- Reviews table
create table reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  movie_id integer not null,
  rating smallint check (rating between 1 and 5) not null,
  body text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (user_id, movie_id)
);

-- Watchlist table
create table watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  movie_id integer not null,
  movie_title text not null,
  poster_path text,
  added_at timestamp with time zone default now(),
  unique (user_id, movie_id)
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table reviews enable row level security;
alter table watchlist enable row level security;

-- Profiles: users can read all, update only their own
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Reviews: anyone can read, authenticated users can insert/update/delete their own
create policy "Reviews are viewable by everyone" on reviews for select using (true);
create policy "Users can insert their own reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update their own reviews" on reviews for update using (auth.uid() = user_id);
create policy "Users can delete their own reviews" on reviews for delete using (auth.uid() = user_id);

-- Watchlist: users can only access their own entries
create policy "Users can view their own watchlist" on watchlist for select using (auth.uid() = user_id);
create policy "Users can add to their watchlist" on watchlist for insert with check (auth.uid() = user_id);
create policy "Users can remove from their watchlist" on watchlist for delete using (auth.uid() = user_id);
```

### Auto-create Profile on Sign Up

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🌐 Deployment (Netlify)

1. Push your code to GitHub.
2. Connect the repository to [Netlify](https://netlify.com).
3. Set the following build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add all environment variables from your `.env` file to Netlify's **Site Settings → Environment Variables**.
5. Deploy!

---

## 📡 API Reference

### TMDb Endpoints Used

| Feature | Endpoint |
|---|---|
| Trending Weekly | `GET /trending/movie/week` |
| Popular Movies | `GET /movie/popular` |
| Top Rated | `GET /movie/top_rated` |
| Now Playing | `GET /movie/now_playing` |
| Search | `GET /search/movie?query={q}` |
| Movie Details | `GET /movie/{id}` |
| Movie Credits | `GET /movie/{id}/credits` |
| Movie Videos | `GET /movie/{id}/videos` |

**Image Base URL:** `https://image.tmdb.org/t/p/w500/`

---

## 🤝 Contributing

This project follows a feature-branch Git workflow:

1. Create a new branch from `main`: `git checkout -b feature/your-feature-name`
2. Commit your changes with clear messages.
3. Open a Pull Request for review before merging to `main`.
4. Ensure ESLint passes with zero errors before submitting a PR.

---

## 📋 Out of Scope (Phase 2)

- Payment processing or premium subscriptions
- Social following / friend graph features
- Video streaming or trailer hosting
- Admin dashboard
- Native mobile application
- Email notifications

---

## 📚 References

- [TMDb API Docs](https://developer.themoviedb.org/docs)
- [OMDb API](https://www.omdbapi.com/)
- [Supabase Docs](https://supabase.com/docs)
- [React.js](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router v6](https://reactrouter.com/en/main)
- [Vite](https://vitejs.dev/guide)
- [Netlify Docs](https://docs.netlify.com)
- [YouTube iFrame API](https://developers.google.com/youtube/iframe_api_reference)

---

*Built with ❤️ by the intern team | March 2026*
