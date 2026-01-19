

export default function InformationsPage() {
  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-5 lg:py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-xl md:text-3xl lg:text-5xl font-bold md:my-4">
          About <span className="text-red-700 animate-gradient-red">CinemaSpace</span>
        </h1>
        <p className="text-md lg:text-2xl max-w-5xl m-auto text-gray-200 animate-gradient-lighted pt-2">
          A personal movie and TV discovery platform built to gain real-world experience
          with modern web technologies and external APIs.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto space-y-10 text-gray-100 tracking-wide bg-black/60 p-2 lg:px-8 lg:py-4 rounded-xl text-base md:text-lg leading-relaxed">

        {/* Project Overview */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 animate-gradient-red">
            Project Overview
          </h2>
          <p>
            This project was built using <strong className="animate-gradient-info">JavaScript</strong> and modern web technologies such as
            <strong className="animate-gradient-info"> Express.js</strong>, <strong className="animate-gradient-info">Next.js</strong>, <strong className="animate-gradient-info">TypeScript</strong>,
            <strong className="animate-gradient-info"> React</strong>, and <strong className="animate-gradient-info">Tailwind CSS</strong>.
            The main goal was to gain hands-on experience working with real-world, third-party APIs
            while building a fully functional and visually polished application.
          </p>
          <p className="mt-4">
            Because I am passionate about movies and TV series, I decided to work with
            <strong className="animate-gradient-info"> The Movie Database (TMDB)</strong>. After obtaining an API key, I integrated TMDB
            into the project to fetch real-time data about movies, TV shows, actors, and trends.
          </p>
        </section>

        {/* Authentication */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 animate-gradient-red">
            Authentication & User Accounts
          </h2>
          <p>
            Users can register and log in to the platform. During registration, an email verification
            system is implemented using <strong className="animate-gradient-info">Nodemailer</strong>. After signing up, the user receives
            a verification email containing a secure link. Once the link is clicked, the account is
            activated in the database and the user can successfully log in.
          </p>
          <p className="mt-4">
            The system also prevents registering an email address that is already in use, ensuring that each email can be associated with only one account.
            All passwords are securely hashed using <strong className="animate-gradient-info">bcrypt</strong>. After email verification,
            a temporary verification token is removed to ensure security.
            Only authenticated users are allowed to access protected pages such as the user profile.
          </p>
          <p className="mt-4">
            Additionally, an automatic logout feature has been implemented, which signs the user out 3 hours after logging in, regardless of activity, ensuring that even if the user does not manually log out, their session will expire for security purposes.
            Users also have the option to log out or permanently delete their account.
            In both cases, they are automatically redirected to the login page to prevent unauthorized access.
          </p>
        </section>

        {/* Ratings */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 animate-gradient-red">
            Ratings System
          </h2>

          <p>
            Once logged in, users can rate both movies and TV series. These ratings are
            stored in the database and linked to the user profile. Each user can view,
            edit, or delete their ratings at any time. Ratings are displayed in the
            profile and sorted from highest to lowest. The system also calculates
            average ratings for titles rated by multiple users.
          </p>

          <p className="mt-4">
            The platform includes a leaderboard that highlights the most active users
            across several categories:
          </p>

          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>total number of ratings</li>
            <li>most rated movies</li>
            <li>most rated TV series</li>
          </ul>

          <p className="mt-4">
            Each user also receives a rank badge based on the total number of ratings
            they have submitted:
          </p>

          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>👑 <strong className="animate-gradient-info">Cinema Legend</strong> - 40+ ratings</li>
            <li>⭐ <strong className="animate-gradient-info">Movie Master</strong> - 20–39 ratings</li>
            <li>🎥 <strong className="animate-gradient-info">Movie Analyst</strong> - 10–19 ratings</li>
            <li>🍿 <strong className="animate-gradient-info">Cinema Explorer</strong> - 5–9 ratings</li>
            <li>🎬 <strong className="animate-gradient-info">Movie Rookie</strong> - 0–4 ratings</li>
          </ul>

          <p className="mt-4">
            These badges highlight the most active users and appear both in their
            profile and on the leaderboard.
          </p>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 animate-gradient-red">
            Reviews System
          </h2>
          <p>
            Logged-in users can write text reviews for both movies and TV series. Each review is stored in a separate table in the database, linked to both the user and the title.
          </p>
          <p className="mt-4">
            Each review also displays the rating the user assigned to that movie or series, providing a clear view of how the user evaluated the title alongside their written feedback.
          </p>
          <p className="mt-4">
            To maintain a respectful environment, we implemented a manual profanity filter: offensive words are automatically blocked from being submitted. This uses the <code  className="animate-gradient-info font-bold">leo-profanity</code> library combined with <code  className="animate-gradient-info font-bold">remove-accents</code> to catch variations and diacritics, ensuring inappropriate language is rejected.
          </p>
          <p className="mt-4">
            Users also have the ability to <span className="animate-gradient-info font-bold">delete</span> their own reviews at any time.
          </p>
        </section>


        {/* Home Page Section*/}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 animate-gradient-red">
            Home Page Features
          </h2>
          <p>
            The home page includes a powerful search feature that allows users to search for
            <strong className="animate-gradient-info"> movies, TV series, and actors</strong> using TMDB data.
            Additionally, the homepage showcases curated content divided into sections such as
            <strong className="animate-gradient-info"> Trending</strong>, <strong className="animate-gradient-info"> Popular</strong>, <strong className="animate-gradient-info"> Top Rated Movies</strong>,
            and <strong className="animate-gradient-info"> Top Series</strong>.
          </p>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 animate-gradient-red">
            Categories Page
          </h2>
          <p>
            On the Categories page, users can filter content by specific genres.
            By selecting one or multiple genres, the filter dynamically displays only
            the results that match the selected categories.
          </p>
          <p className="mt-4">
            This page also highlights community-driven content such as
            <strong className="animate-gradient-info"> “Top Rated Movies by Our Users”</strong> and
            <strong className="animate-gradient-info"> “Top Rated Series by Our Users”</strong>.
            To enhance the browsing experience, predefined genre sections are included,
            such as Action, Drama, Science Fiction, Horror, Comedy, and Animation.
          </p>
        </section>

        {/* Series */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 animate-gradient-red">
            Series Page
          </h2>
          <p>
            The Series page is dedicated exclusively to TV series.
            It includes a search feature limited to series only and displays content
            organized into sections such as Trending Series, Popular Series, and Top Rated Series.
          </p>
        </section>

        {/* Actors */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4  animate-gradient-red">
            Actors & Persons
          </h2>
          <p>
            The Actors page focuses on people from the film industry.
            Users can search specifically for actors and other persons using TMDB data.
            The page includes sections such as Popular Actors and Trending Actors,
            providing insight into currently popular personalities.
          </p>
        </section>

        {/* Closing */}
        <section>
          <p className="text-center text-gray-300 italic mt-12 max-w-3xl mx-auto animate-gradient-info">
            This project represents a significant step in my journey as a web developer,
            combining technical growth with personal interests in film and television.
          </p>
        </section>

      </div>
    </div>
  );
}

