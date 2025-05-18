import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchMovies,
  addMovie,
  editMovie,
  deleteMovie,
} from "../redux/movieSlice";
import "../../src/App.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.list);
  const loading = useSelector((state) => state.movies.status === "loading");
  const [movie, setMovie] = useState({ _id: "", title: "", year: "", poster: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("title");
  const itemsPerPage = 4;

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(editMovie(movie));
    } else {
      dispatch(addMovie(movie));
    }
    setMovie({ _id: "", title: "", year: "", poster: "" });
    setIsEditing(false);
  };

  const handleEdit = (movie) => {
    setMovie(movie);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      dispatch(deleteMovie(id));
    }
  };

  const filteredMovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortCriteria === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortCriteria === "year") {
        return a.year - b.year;
      }
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Movie Dashboard</h1>
        <Link to="/profile" className="profile-button">My Profile</Link>
      </div>

      <form onSubmit={handleSubmit} className="movie-form">
        <input type="text" name="title" value={movie.title} onChange={handleChange} placeholder="Movie Title" required />
        <input type="number" name="year" value={movie.year} onChange={handleChange} placeholder="Release Year" required min="1880" max="2099" />
        <input type="url" name="poster" value={movie.poster} onChange={handleChange} placeholder="Poster URL" required />
        <button type="submit" disabled={loading} className="submit-btn">{isEditing ? "Update Movie" : "Add Movie"}</button>
      </form>

      <div className="search-sort-container" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "10px", marginRight: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "200px" }}
        />
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        >
          <option value="title">Sort by Title</option>
          <option value="year">Sort by Year</option>
        </select>
      </div>

      {loading && <p className="loading-message">Loading movies...</p>}

      {!loading && currentMovies.length > 0 ? (
        <div className="movie-list">
          {currentMovies.map((movie) => (
            <div key={movie._id} className="movie-card">
              <img src={movie.poster} alt={movie.title} className="movie-poster" />
              <h3>{movie.title} ({movie.year})</h3>
              <div className="movie-actions">
                <button className="edit-btn" onClick={() => handleEdit(movie)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(movie._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies-message">No movies available.</p>
      )}

      <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "10px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            border: "1px solid #ccc",
            background: currentPage === 1 ? "#d3d3d3" : "#f8f8f8",
            color: "#000",
            borderRadius: "50%",
            width: "40px",
            height: "40px"
          }}
        >
          &laquo;
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              padding: "10px",
              cursor: "pointer",
              border: "1px solid #ccc",
              background: currentPage === index + 1 ? "#060110" : "#f8f8f8",
              color: currentPage === index + 1 ? "white" : "black",
              borderRadius: "50%",
              width: "40px",
              height: "40px"
            }}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "10px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            border: "1px solid #ccc",
            background: currentPage === totalPages ? "#d3d3d3" : "#f8f8f8",
            color: "#000",
            borderRadius: "50%",
            width: "40px",
            height: "40px"
          }}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
