export default function InformationsPage() {
  return (
    <div className="min-h-screen bg-transparent text-white font-sans px-2 md:px-6 py-5 lg:py-8">
      {/* Header */}
      <div className="text-center mb-3 lg:mb-10">
        <h1 className="text-xl md:text-3xl lg:text-5xl font-bold md:my-4">
          Project <span className="text-red-700 animate-gradient-red">Details</span>
        </h1>
        <p className="text-left md:text-center text-md md:text-lg lg:text-2xl max-w-5xl mx-auto text-gray-200 animate-gradient-lighted p-2">
          A personal movie and TV discovery platform built to gain real-world experience with modern
          web technologies and external APIs.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto space-y-8 text-gray-100 tracking-wide bg-black/60 p-2 lg:px-8 lg:py-4 rounded-xl text-base md:text-lg leading-relaxed">
        {/* Project Overview */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-gray-100 mb-3 animate-gradient-red">
            Project Overview
          </h2>
          <p>
            This project was developed using{' '}
            <strong className="animate-gradient-info">JavaScript</strong> and modern web
            technologies including
            <strong className="animate-gradient-info"> Express.js</strong>,{' '}
            <strong className="animate-gradient-info">Next.js</strong>,{' '}
            <strong className="animate-gradient-info">TypeScript</strong>,
            <strong className="animate-gradient-info"> React</strong>, and{' '}
            <strong className="animate-gradient-info">Tailwind CSS</strong>. The main objective was
            to gain practical experience with real-world, third-party APIs while building a fully
            functional and visually polished application.
          </p>
          <p className="mt-4">
            Because I am passionate about movies and TV series, I chose to integrate
            <strong className="animate-gradient-info"> The Movie Database (TMDB)</strong>. After
            obtaining an API key, I implemented TMDB to fetch real-time data for movies, TV shows,
            actors, and trending content.
          </p>
        </section>

        {/* Authentication */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 animate-gradient-red">
            Authentication and User Accounts
          </h2>
          <p>
            Users can register and log in to the platform.{' '}
            <strong className="animate-gradient-info">Email verification</strong> is handled through{' '}
            <strong className="animate-gradient-info">Resend</strong>, configured using my own
            custom domain through DNS records. After registration, the system sends a secure
            verification link to the users email. Once the link is confirmed, the account becomes
            active and the user can log in.
          </p>
          <p className="mt-4">
            The system prevents creating accounts with an email address that already exists,
            ensuring that each email can be used only once. All passwords are securely hashed using{' '}
            <strong className="animate-gradient-info">bcrypt</strong>. After the email is verified,
            the temporary verification token is automatically removed for security purposes. Only
            authenticated users can access protected pages like the user profile.
          </p>
          <p className="mt-4">
            An automatic logout feature is also implemented. Users are signed out 3 hours after
            logging in, even if they remain active, ensuring the session expires for security
            reasons. Users can also manually log out or permanently delete their account. In both
            situations, they are redirected to the login page to prevent unauthorized access.
          </p>
        </section>

        {/* Ratings */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 animate-gradient-red">
            Ratings System
          </h2>

          <p>
            Logged-in users can rate both movies and TV series. Ratings are stored in the database
            and linked directly to the user profile. Users can view, edit, or delete their ratings
            at any time. In the profile, ratings are sorted from highest to lowest, and the system
            calculates average scores for titles rated by multiple users.
          </p>

          <p className="mt-4">
            The platform also includes a leaderboard that highlights the most active users across
            several categories:
          </p>

          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>total number of ratings</li>
            <li>most rated movies</li>
            <li>most rated TV series</li>
          </ul>

          <p className="mt-4">
            Each user earns a rank badge based on their total number of submitted ratings:
          </p>

          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>
              👑 <strong className="animate-gradient-info">Cinema Legend</strong> - 40+ ratings
            </li>
            <li>
              ⭐ <strong className="animate-gradient-info">Movie Master</strong> - 20–39 ratings
            </li>
            <li>
              🎥 <strong className="animate-gradient-info">Movie Analyst</strong> - 10–19 ratings
            </li>
            <li>
              🍿 <strong className="animate-gradient-info">Cinema Explorer</strong> - 5–9 ratings
            </li>
            <li>
              🎬 <strong className="animate-gradient-info">Movie Rookie</strong> - 0–4 ratings
            </li>
          </ul>

          <p className="mt-4">
            These badges highlight the most active users and appear both in their profile and on the
            leaderboard.
          </p>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 animate-gradient-red">
            Reviews System
          </h2>
          <p>
            Logged-in users can write text reviews for movies and TV series. Each review is stored
            in a dedicated table in the database and linked to both the user and the related title.
          </p>
          <p className="mt-4">
            Each review also displays the rating the user assigned, giving a clear overview of how
            the user evaluated the title along with their written feedback.
          </p>
          <p className="mt-4">
            To maintain a respectful environment, a manual profanity filter is implemented:
            offensive words are automatically blocked. This system uses the{' '}
            <code className="animate-gradient-info font-bold">leo-profanity</code> library combined
            with <code className="animate-gradient-info font-bold">remove-accents</code> to detect
            variations with diacritics and prevent inappropriate content.
          </p>
          <p className="mt-4">
            Users can also <span className="animate-gradient-info font-bold">delete</span> their own
            reviews at any time.
          </p>
        </section>

        {/* Home Page Section */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 animate-gradient-red">
            Home Page Features
          </h2>
          <p>
            The home page includes a powerful search feature that allows users to look up
            <strong className="animate-gradient-info"> movies, TV series, and actors</strong> using
            real-time TMDB data. It also showcases curated sections including
            <strong className="animate-gradient-info"> Trending</strong>,{' '}
            <strong className="animate-gradient-info"> Popular</strong>,{' '}
            <strong className="animate-gradient-info"> Top Rated Movies</strong>, and{' '}
            <strong className="animate-gradient-info"> Top Series</strong>.
          </p>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 animate-gradient-red">
            Categories Page
          </h2>
          <p>
            On the Categories page, users can filter content by selected genres. When one or
            multiple genres are chosen, the page dynamically displays only results that match the
            selected categories.
          </p>
          <p className="mt-4">
            This page also features community-driven sections such as
            <strong className="animate-gradient-info"> Top Movies by Users</strong> and
            <strong className="animate-gradient-info"> Top Series by Users</strong>. To improve
            navigation, predefined genre blocks are included, such as Action, Drama, Science
            Fiction, Horror, Comedy, and Animation.
          </p>
        </section>

        {/* Series */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 animate-gradient-red">
            Series Page
          </h2>
          <p>
            The Series page focuses exclusively on TV series. It includes a dedicated search feature
            for series and displays categorized sections such as Trending Series, Popular Series,
            and Top Rated Series.
          </p>
        </section>

        {/* Actors */}
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 animate-gradient-red">
            Actors and Persons
          </h2>
          <p>
            The Actors page highlights people from the film industry. Users can search specifically
            for actors and other persons through TMDB. The page includes sections like Popular
            Actors and Trending Actors, showcasing currently relevant personalities.
          </p>
        </section>

        {/* Closing */}
        <section>
          <p className="text-center text-gray-300 italic mt-12 max-w-3xl mx-auto animate-gradient-info">
            This project represents an important milestone in my development as a web programmer,
            combining technical growth with my personal interest in films and television.
          </p>
        </section>
      </div>
    </div>
  );
}
