import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SITE } from "../data/constants";
import CreateReview from "../components/CreateReview";

const RESULTS_PER_PAGE = 10;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;
  const url = `https://${SITE}/api/reviews/?page=${page}`;

  const fetchReviews = async (fetchUrl) => {
    setLoading(true);
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setReviews(data.results || []);
      setNext(data.next || null);
      setPrevious(data.previous || null);
      setTotal(data.count || 0);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(url);
  }, [url]);

  const goToPage = (pageNum) => {
    setSearchParams({ page: pageNum });
  };

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

  return (
    <div style={{
      maxWidth: "800px",
      margin: "2rem auto",
      padding: "2rem",
    }}>
      <CreateReview />
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#ffffff" }}>Customer Reviews</h2>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", color: "white" }}>
          <div className="spinner" />
        </div>
      ) : reviews.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No reviews yet.</p>
      ) : (
        <>
          <p style={{ marginBottom: "1rem", color: "#666" }}>
            Showing {reviews.length} / {total} results
          </p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviews.map((r, idx) => (
              <li key={idx} style={{
                padding: "1rem",
                borderBottom: "1px solid #ddd"
              }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ marginRight: "1rem", color: "#ffffff" }}>{r.name}</strong>
                  <span style={{ color: "#f5b301" }}>
                    {"⭐".repeat(r.rating)}
                  </span>
                </div>
                <p style={{ margin: 0, color: "#ffffff" }}>{r.review}</p>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              goToPage={goToPage}
              previous={previous}
              next={next}
            />
          </div>
        </>
      )}
    </div>
  );
};

const Pagination = ({ totalPages, currentPage, goToPage, previous, next }) => {
    if (totalPages <= 1) return null;
  
    const handleLinkClick = (e, pageNum) => {
      e.preventDefault();
      goToPage(pageNum);
    };
  
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <span
          onClick={(e) => handleLinkClick(e, 1)}
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            color: "#fff",
            borderRadius: "0.5rem",
            cursor: "pointer",
            textDecoration: "none",
            pointerEvents: currentPage === 1 ? "none" : "auto",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          |&lt;
        </span>
  
        <span
          onClick={(e) => handleLinkClick(e, Math.max(1, currentPage - 1))}
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            color: previous ? "#fff" : "#333",
            borderRadius: "0.5rem",
            cursor: "pointer",
            textDecoration: "none",
            pointerEvents: currentPage === 1 ? "none" : "auto",
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          &lt;
        </span>
  
        {pageNumbers.map((num) => (
          <span
            key={num}
            onClick={(e) => handleLinkClick(e, num)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #ccc",
              backgroundColor: num === currentPage ? "#3182ce" : "#f9f9f9",
              color: num === currentPage ? "#333" : "#fff",
              borderRadius: "0.5rem",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            {num}
          </span>
        ))}
  
        <span
          onClick={(e) => handleLinkClick(e, Math.min(totalPages, currentPage + 1))}
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            color: next ? "#fff" : "#333",
            borderRadius: "0.5rem",
            cursor: "pointer",
            textDecoration: "none",
            pointerEvents: currentPage === totalPages ? "none" : "auto",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          &gt;
        </span>
        <span
          onClick={(e) => handleLinkClick(e, totalPages)}
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            color: "#fff",
            borderRadius: "0.5rem",
            cursor: "pointer",
            textDecoration: "none",
            pointerEvents: currentPage === totalPages ? "none" : "auto",
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          &gt;|
        </span>
      </nav>
    );
  };
export default Reviews;
